"use server";

import { db } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

export async function addToWaitlist(formData: { name: string; email: string }) {
  try {
    // Create a new document in the waitlist collection
    const waitlistRef = db.collection("waitlist");
    
    // Check if email already exists in waitlist
    const existingEntries = await waitlistRef
      .where("email", "==", formData.email)
      .get();
    
    if (!existingEntries.empty) {
      return { success: false, message: "Email already exists in waitlist" };
    }
    
    // Add the new entry with a timestamp
    await waitlistRef.add({
      name: formData.name,
      email: formData.email,
      status: "pending", // pending, approved, rejected
      createdAt: new Date(),
    });
    
    revalidatePath("/waitlist");
    return { success: true, message: "Added to waitlist successfully" };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { success: false, message: "Failed to add to waitlist" };
  }
}
