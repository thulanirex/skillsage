import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { type, role, level, techstack, amount, userid } = await request.json();
    
    console.log('Generating interview for:', { type, role, level, techstack, amount, userid });

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
      techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      isPublic: false, // Default to private interviews
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log('Saving interview to Firestore...');
    
    // Add to Firestore
    try {
      const docRef = await db.collection("interviews").add(interview);
      console.log('Interview saved with ID:', docRef.id);
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
    console.error("Error in POST handler:", error);
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

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
