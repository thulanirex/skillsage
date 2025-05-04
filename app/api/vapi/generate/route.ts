import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import console from "console";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // Get the authenticated user from the session
//     const user = await getCurrentUser();
    
    
//     // If no authenticated user, return unauthorized
//     if (!user) {
//       console.log('No authenticated user found');
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Get the userId directly from the authenticated user
//     const userId = user.id;
//     console.log('Got authenticated userId from session:', userId);
    
//     // Log the raw request body for debugging
//     const rawBody = await request.text();
//     console.log('Raw request body:', rawBody);
    
//     // Try to parse the body as JSON
//     let parsedBody;
//     try {
//       parsedBody = JSON.parse(rawBody);
//     } catch (error) {
//       console.error('Error parsing request body:', error);
//       return Response.json({ 
//         success: false, 
//         error: 'Invalid JSON in request body' 
//       }, { status: 400 });
//     }
    
//     // Extract fields from parsed body
//     let type = parsedBody.type;
//     let role = parsedBody.role;
//     let level = parsedBody.level;
//     let techstack = parsedBody.techstack;
//     let amount = parsedBody.amount;
    
//     // Check URL parameters for overrides
//     const url = new URL(request.url);
//     if (url.searchParams.get('type')) type = url.searchParams.get('type');
//     if (url.searchParams.get('role')) role = url.searchParams.get('role');
//     if (url.searchParams.get('level')) level = url.searchParams.get('level');
//     if (url.searchParams.get('techstack')) techstack = url.searchParams.get('techstack');
//     if (url.searchParams.get('amount')) amount = url.searchParams.get('amount');
    
//     // Set defaults if values are missing
//     if (!type) type = 'mixed';
//     if (!role) role = 'Software Engineer';
//     if (!level) level = 'intermediate';
//     if (!techstack) techstack = 'JavaScript,React';
//     if (!amount) amount = '5';
    
//     console.log('Final interview parameters:', {
//       type,
//       role,
//       level,
//       techstack,
//       amount,
//       userId
//     });
    
//     // Validate the userId
//     if (!userId || userId.trim() === '') {
//       console.error('Error: User ID is empty');
//       return Response.json({ 
//         success: false, 
//         error: 'User ID cannot be empty' 
//       }, { status: 400 });
//     }
    
//     console.log('Generating interview for user:', userId);

//     // Generate questions using AI
//     const { text: questions } = await generateText({
//       model: google("gemini-2.0-flash-001"),
//       prompt: `Prepare questions for a job interview.
//         The job role is ${role}.
//         The job experience level is ${level}.
//         The tech stack used in the job is: ${techstack}.
//         The focus between behavioural and technical questions should lean towards: ${type}.
//         The amount of questions required is: ${amount}.
//         Please return only the questions, without any additional text.
//         The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//         Return the questions formatted like this:
//         ["Question 1", "Question 2", "Question 3"]
        
//         Thank you! <3
//     `,
//     });

//     // Parse the generated questions
//     let parsedQuestions;
//     try {
//       parsedQuestions = JSON.parse(questions);
//     } catch (parseError) {
//       console.error('Error parsing questions:', parseError);
//       console.log('Raw questions text:', questions);
//       return Response.json({ 
//         success: false, 
//         error: 'Failed to parse generated questions' 
//       }, { status: 400 });
//     }

//     // Create interview object
//     const interview = {
//       role: role,
//       type: type,
//       level: level,
//       techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
//       questions: parsedQuestions,
//       userId: userId, // Use the authenticated user ID
//       // Also add lowercase variant for backward compatibility
//       userid: userId,
//       finalized: true,
//       isPublic: false, // Default to private interviews
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };
    
//     console.log('Interview object to save:', { ...interview, questions: `${parsedQuestions.length} questions` });

//     console.log('Saving interview to Firestore...', {
//       role: interview.role,
//       type: interview.type,
//       level: interview.level,
//       userId: interview.userId,
//       questionCount: interview.questions.length
//     });
    
//     // Add to Firestore
//     try {
//       const docRef = await db.collection("interviews").add(interview);
//       console.log('Interview saved successfully with ID:', docRef.id);
      
//       // Verify the interview was saved correctly by reading it back
//       const savedDoc = await db.collection("interviews").doc(docRef.id).get();
//       if (savedDoc.exists) {
//         const savedData = savedDoc.data();
//         console.log('Verified saved interview:', {
//           id: docRef.id,
//           userId: savedData?.userId,
//           role: savedData?.role,
//           questionCount: savedData?.questions?.length
//         });
//       } else {
//         console.error('Failed to verify saved interview - document not found');
//       }
      
//       return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
//     } catch (firestoreError) {
//       console.error('Firestore error:', firestoreError);
//       if (firestoreError instanceof Error) {
//         console.error('Error message:', firestoreError.message);
//         console.error('Error stack:', firestoreError.stack);
//       }
//       return Response.json({ 
//         success: false, 
//         error: 'Failed to save interview to database' 
//       }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("Error in POST handler:", error);
//     if (error instanceof Error) {
//       console.error('Error message:', error.message);
//       console.error('Error stack:', error.stack);
//     }
//     return Response.json({ 
//       success: false, 
//       error: 'Internal server error' 
//     }, { status: 500 });
//   }
// }

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Log the entire body for debugging
    console.log('API received full body:', JSON.stringify(body, null, 2));
    
    // Extract parameters with defaults
    const type = body.type || 'mixed';
    const role = body.role || 'Software Engineer';
    const level = body.level || 'intermediate';
    const techstack = body.techstack || 'JavaScript,React';
    const amount = body.amount || '5';
    
    // Extract userId from all possible locations
    let userid = null;
    
    // Check for userid in the main body
    if (body.userid) {
      userid = body.userid;
      console.log('Found userid in body.userid:', userid);
    }
    // Check for userId (camelCase) in the main body
    else if (body.userId) {
      userid = body.userId;
      console.log('Found userid in body.userId:', userid);
    }
    // Check for user_id (snake_case) in the main body
    else if (body.user_id) {
      userid = body.user_id;
      console.log('Found userid in body.user_id:', userid);
    }
    // Check in variableValues (VAPI specific)
    else if (body.variableValues) {
      if (body.variableValues.userid) {
        userid = body.variableValues.userid;
        console.log('Found userid in body.variableValues.userid:', userid);
      }
      else if (body.variableValues.userId) {
        userid = body.variableValues.userId;
        console.log('Found userid in body.variableValues.userId:', userid);
      }
      else if (body.variableValues.user_id) {
        userid = body.variableValues.user_id;
        console.log('Found userid in body.variableValues.user_id:', userid);
      }
    }
    
    // Log the extracted userid
    console.log('Final extracted userid:', userid);
    
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Check if we have a valid userId
    if (!userid) {
      console.error('Error: No userId found in the request');
      return Response.json({ success: false, error: 'No userId found in the request' }, { status: 400 });
    }
    
    console.log('Using userid for interview:', userid);
    
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
      questions: JSON.parse(questions),
      // Set userId directly with the extracted value
      userId: userid,
      // Also set it in lowercase format for compatibility
      userid: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };
    
    // Log the interview object before saving
    console.log('Saving interview with userId:', interview.userId);

    const docRef = await db.collection("interviews").add(interview);
    console.log('Interview created with ID:', docRef.id);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Get the URL parameters
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const role = url.searchParams.get('role') || 'Software Engineer';
  const level = url.searchParams.get('level') || 'intermediate';
  const type = url.searchParams.get('type') || 'mixed';
  const techstack = url.searchParams.get('techstack') || 'JavaScript,React';
  const amount = url.searchParams.get('amount') || '5';
  
  console.log('GET request with params:', { userId, role, level, type, techstack, amount });
  
  if (!userId) {
    return Response.json({ 
      success: false, 
      error: 'User ID is required as a query parameter' 
    }, { status: 400 });
  }
  
  try {
    // Generate questions using AI
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Parse the generated questions
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
    } catch (parseError) {
      console.error('Error parsing questions:', parseError);
      console.log('Raw questions text:', questions);
      return Response.json({ 
        success: false, 
        error: 'Failed to parse generated questions' 
      }, { status: 400 });
    }

    // Create interview object
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userId,
      finalized: true,
      isPublic: false,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };
    
    console.log('Saving interview to Firestore...', {
      role: interview.role,
      type: interview.type,
      level: interview.level,
      userId: interview.userId,
      questionCount: interview.questions.length
    });
    
    // Add to Firestore
    try {
      const docRef = await db.collection("interviews").add(interview);
      console.log('Interview saved successfully with ID:', docRef.id);
      
      // Verify the interview was saved correctly by reading it back
      const savedDoc = await db.collection("interviews").doc(docRef.id).get();
      if (savedDoc.exists) {
        const savedData = savedDoc.data();
        console.log('Verified saved interview:', {
          id: docRef.id,
          userId: savedData?.userId,
          role: savedData?.role,
          questionCount: savedData?.questions?.length
        });
      } else {
        console.error('Failed to verify saved interview - document not found');
      }
      
      return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      if (firestoreError instanceof Error) {
        console.error('Error message:', firestoreError.message);
        console.error('Error stack:', firestoreError.stack);
      }
      return Response.json({ 
        success: false, 
        error: 'Failed to save interview to database' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return Response.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
