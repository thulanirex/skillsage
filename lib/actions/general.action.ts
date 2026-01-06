"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

type Interview = {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  questions: string[];
  createdAt: string;
  isPublic?: boolean;
};

type UpdateInterviewPrivacyParams = {
  interviewId: string;
  userId: string;
  isPublic: boolean;
};

type CreateFeedbackParams = {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
};

type GetFeedbackByInterviewIdParams = {
  interviewId: string;
  userId: string;
};

type GetLatestInterviewsParams = {
  userId?: string;
  limit?: number;
};

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  // Return null if either interviewId or userId is undefined
  if (!interviewId || !userId) {
    return null;
  }

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Create a base query
  let query = db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("isPublic", "==", true); // Only show public interviews
    
  // Only add the userId filter if userId is defined
  if (userId) {
    query = query.where("userId", "!=", userId);
  }
  
  // Add limit and execute query
  const interviews = await query.limit(limit).get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string | undefined
): Promise<Interview[] | null> {
  // Return empty array if userId is undefined
  if (!userId) {
    console.log('getInterviewsByUserId: userId is undefined, returning empty array');
    return [];
  }

  console.log(`getInterviewsByUserId: Fetching interviews for userId: ${userId}`);

  try {
    // First, let's check if there are any interviews in the collection at all
    const allInterviews = await db.collection("interviews").limit(5).get();
    console.log(`Total interviews in collection (sample): ${allInterviews.size}`);
    
    if (allInterviews.size > 0) {
      // Log a sample interview to see its structure
      const sampleDoc = allInterviews.docs[0];
      const sampleData = sampleDoc.data();
      console.log('Sample interview data structure:', {
        id: sampleDoc.id,
        userId: sampleData.userId || 'not found',
        userid: sampleData.userid || 'not found', // Check for lowercase variant
        role: sampleData.role,
        createdAt: sampleData.createdAt
      });
    }

    // Now perform the actual query
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    console.log(`Found ${interviews.size} interviews for userId: ${userId}`);

    // If no interviews found with camelCase userId, try with lowercase
    if (interviews.size === 0) {
      console.log('No interviews found with camelCase userId, trying lowercase userid');
      const interviewsAlt = await db
        .collection("interviews")
        .where("userid", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      console.log(`Found ${interviewsAlt.size} interviews for lowercase userid: ${userId}`);
      
      if (interviewsAlt.size > 0) {
        return interviewsAlt.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Normalize the field name to camelCase for consistency
          userId: doc.data().userid
        })) as Interview[];
      }
    }

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error('Error in getInterviewsByUserId:', error);
    return [];
  }
}

// Get all interviews created by a user and all feedback for those interviews
export async function getUserInterviewsWithFeedback(
  userId: string | undefined
): Promise<{ interviews: Interview[], feedbackMap: Record<string, Feedback> }> {
  // Return empty data if userId is undefined
  if (!userId) {
    console.log('getUserInterviewsWithFeedback: userId is undefined, returning empty data');
    return { interviews: [], feedbackMap: {} };
  }

  console.log(`getUserInterviewsWithFeedback: Fetching interviews for userId: ${userId}`);

  try {
    // First, check if there are any interviews in the collection at all
    const allInterviews = await db.collection("interviews").limit(5).get();
    console.log(`Total interviews in collection (sample): ${allInterviews.size}`);
    
    if (allInterviews.size > 0) {
      // Log a sample interview to see its structure
      const sampleDoc = allInterviews.docs[0];
      const sampleData = sampleDoc.data();
      console.log('Sample interview data structure:', {
        id: sampleDoc.id,
        userId: sampleData.userId || 'not found',
        userid: sampleData.userid || 'not found', // Check for lowercase variant
        role: sampleData.role,
        createdAt: sampleData.createdAt
      });
    }

    // Get interviews with camelCase userId field
    const camelCaseInterviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    console.log(`Found ${camelCaseInterviews.size} interviews with camelCase userId: ${userId}`);

    // Get interviews with lowercase userid field
    const lowercaseInterviews = await db
      .collection("interviews")
      .where("userid", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    console.log(`Found ${lowercaseInterviews.size} interviews with lowercase userid: ${userId}`);
    
    // Also check for any interviews with template literal userId values
    // This is to find interviews that might have been created with the placeholder
    console.log('Checking for interviews with template literal userId...');
    const templateInterviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    
    // Filter locally for template literals
    const templatesFound = templateInterviews.docs.filter(doc => {
      const data = doc.data();
      return (
        (data.userId && typeof data.userId === 'string' && data.userId.includes('{{')) ||
        (data.userid && typeof data.userid === 'string' && data.userid.includes('{{'))
      );
    });
    
    console.log(`Found ${templatesFound.length} interviews with template literal userId`);
    if (templatesFound.length > 0) {
      console.log('Template literal interviews:', templatesFound.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        userid: doc.data().userid
      })));
      
      // Fix the template literal interviews by updating them with the correct userId
      console.log('Attempting to fix template literal interviews...');
      for (const doc of templatesFound) {
        try {
          await db.collection("interviews").doc(doc.id).update({
            userId: userId,
            userid: userId
          });
          console.log(`Fixed interview ${doc.id} with correct userId: ${userId}`);
        } catch (error) {
          console.error(`Failed to fix interview ${doc.id}:`, error);
        }
      }
    }

    // Combine the results
    const allUserInterviews: Interview[] = [];

    // Add camelCase userId interviews
    camelCaseInterviews.forEach(doc => {
      allUserInterviews.push({
        id: doc.id,
        ...doc.data(),
      } as Interview);
    });

    // Add lowercase userid interviews with normalized field name
    lowercaseInterviews.forEach(doc => {
      const data = doc.data();
      allUserInterviews.push({
        id: doc.id,
        ...data,
        userId: data.userid, // Normalize the field name to camelCase
      } as Interview);
    });
    
    // Also include any template literal interviews that we found and fixed
    // This ensures they show up immediately without waiting for a page refresh
    for (const doc of templatesFound) {
      // Check if this interview is already included
      const alreadyIncluded = allUserInterviews.some(interview => interview.id === doc.id);
      if (!alreadyIncluded) {
        const data = doc.data();
        // Add it with the correct userId
        // Make sure we have all the required fields for an Interview type
        const interviewData = {
          id: doc.id,
          ...data,
          userId: userId, // Use the current user's ID
          userid: userId,
          role: data.role || 'Software Engineer',
          type: data.type || 'mixed',
          techstack: data.techstack || ['JavaScript'],
          questions: data.questions || [],
          createdAt: data.createdAt || new Date().toISOString()
        } as Interview;
        allUserInterviews.push(interviewData);
        console.log(`Added fixed template interview ${doc.id} to results`);
      }
    }

    console.log(`Combined total: ${allUserInterviews.length} interviews`);
    
    // Log the IDs of all interviews for debugging
    console.log('All interview IDs:', allUserInterviews.map(interview => interview.id));

    // If no interviews found, return empty data
    if (allUserInterviews.length === 0) {
      console.log('No interviews found for this user');
      return { interviews: [], feedbackMap: {} };
    }
  
    // Get all feedback for these interviews
    const feedbackMap: Record<string, Feedback> = {};
    
    // Get all feedback where the user is the creator of the interview
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();
      
    console.log(`Found ${feedbackSnapshot.size} feedback items for userId: ${userId}`);
      
    // Process the feedback
    feedbackSnapshot.forEach(doc => {
      const feedback = { id: doc.id, ...doc.data() } as Feedback;
      feedbackMap[feedback.interviewId] = feedback;
    });
    
    return { interviews: allUserInterviews, feedbackMap };
  } catch (error) {
    console.error('Error in getUserInterviewsWithFeedback:', error);
    return { interviews: [], feedbackMap: {} };
  }
}

// Update the privacy settings of an interview
export async function updateInterviewPrivacy(
  params: UpdateInterviewPrivacyParams
): Promise<{ success: boolean; message: string }> {
  const { interviewId, userId, isPublic } = params;

  try {
    // Verify that the user is the owner of the interview
    const interviewRef = db.collection("interviews").doc(interviewId);
    const interview = await interviewRef.get();

    if (!interview.exists) {
      return {
        success: false,
        message: "Interview not found",
      };
    }

    const interviewData = interview.data();
    if (interviewData?.userId !== userId) {
      return {
        success: false,
        message: "You do not have permission to update this interview",
      };
    }

    // Update the privacy setting
    await interviewRef.update({
      isPublic,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Interview is now ${isPublic ? "public" : "private"}`,
    };
  } catch (error) {
    console.error("Error updating interview privacy:", error);
    return {
      success: false,
      message: "Failed to update interview privacy",
    };
  }
}
