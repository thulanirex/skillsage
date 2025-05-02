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
    return [];
  }

  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

// Get all interviews created by a user and all feedback for those interviews
export async function getUserInterviewsWithFeedback(
  userId: string | undefined
): Promise<{ interviews: Interview[], feedbackMap: Record<string, Feedback> }> {
  // Return empty data if userId is undefined
  if (!userId) {
    return { interviews: [], feedbackMap: {} };
  }

  // Get all interviews created by the user
  const interviews = await getInterviewsByUserId(userId);
  
  if (!interviews || interviews.length === 0) {
    return { interviews: [], feedbackMap: {} };
  }
  
  // Get all feedback for these interviews
  const feedbackMap: Record<string, Feedback> = {};
  
  // Create a batch query to get all feedback for these interviews
  // const interviewIds = interviews.map(interview => interview.id);
  // Note: We're not using interviewIds directly as Firestore doesn't support array contains with other filters
  
  // Firestore doesn't support array contains with other filters, so we'll do multiple queries
  // Get all feedback where the user is the creator of the interview
  const feedbackSnapshot = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();
    
  // Process the feedback
  feedbackSnapshot.forEach(doc => {
    const feedback = { id: doc.id, ...doc.data() } as Feedback;
    feedbackMap[feedback.interviewId] = feedback;
  });
  
  return { interviews, feedbackMap };
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
