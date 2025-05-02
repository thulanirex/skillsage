"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateInterviewPrivacy } from "@/lib/actions/general.action";

interface InterviewPrivacyToggleProps {
  interviewId: string;
  userId: string;
  isPublic: boolean;
}

export default function InterviewPrivacyToggle({ 
  interviewId, 
  userId, 
  isPublic: initialIsPublic 
}: InterviewPrivacyToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (!userId) return;
    
    setIsUpdating(true);
    
    try {
      const result = await updateInterviewPrivacy({
        interviewId,
        userId,
        isPublic: checked
      });
      
      if (result.success) {
        setIsPublic(checked);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating interview privacy:", error);
      toast.error("Failed to update interview privacy");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id={`privacy-${interviewId}`}
        checked={isPublic}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
      />
      <Label htmlFor={`privacy-${interviewId}`} className="text-sm text-gray-300">
        {isPublic ? "Public" : "Private"}
      </Label>
    </div>
  );
}
