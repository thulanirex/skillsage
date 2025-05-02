"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { vapi } from "@/lib/vapi.sdk";

interface InterviewSetupProps {
  userName: string;
  userId: string;
  profileImage?: string;
}

const roles = [
  { id: "frontend", name: "Frontend Developer", icon: "/icons/frontend.svg" },
  { id: "backend", name: "Backend Developer", icon: "/icons/backend.svg" },
  { id: "fullstack", name: "Full Stack Developer", icon: "/icons/fullstack.svg" },
  { id: "devops", name: "DevOps Engineer", icon: "/icons/devops.svg" },
  { id: "data", name: "Data Scientist", icon: "/icons/data.svg" },
  { id: "product", name: "Product Manager", icon: "/icons/product.svg" },
];

const experienceLevels = [
  { id: "junior", name: "Junior (0-2 years)" },
  { id: "mid", name: "Mid-level (2-5 years)" },
  { id: "senior", name: "Senior (5+ years)" },
];

const InterviewSetup = ({ userName, userId, profileImage }: InterviewSetupProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("frontend");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [interviewLength, setInterviewLength] = useState(15);
  const [includeCodeQuestions, setIncludeCodeQuestions] = useState(true);
  const [includeBehavioral, setIncludeBehavioral] = useState(true);
  const [activeTab, setActiveTab] = useState("role");
  
  const handleStartInterview = async () => {
    setIsLoading(true);
    
    try {
      // Start the interview with the selected parameters
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
          role: selectedRole,
          experience: experienceLevel,
          duration: interviewLength,
          includeCode: includeCodeQuestions,
          includeBehavioral: includeBehavioral
        },
      });
      
      // Navigate to the interview session page
      router.push("/interview/session");
    } catch (error) {
      console.error("Error starting interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === "role") {
      setActiveTab("experience");
    } else if (activeTab === "experience") {
      setActiveTab("options");
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "experience") {
      setActiveTab("role");
    } else if (activeTab === "options") {
      setActiveTab("experience");
    }
  };

  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-dark-300/50">
        <h2 className="text-xl font-semibold text-white">Configure Your Interview</h2>
        <p className="text-gray-400 text-sm mt-1">Customize your practice interview to match your career goals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6 border-b border-dark-300/50">
          <TabsList className="grid grid-cols-3 bg-dark-300/50">
            <TabsTrigger 
              value="role" 
              className="data-[state=active]:bg-primary-200 data-[state=active]:text-dark-100"
            >
              1. Role
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="data-[state=active]:bg-primary-200 data-[state=active]:text-dark-100"
            >
              2. Experience
            </TabsTrigger>
            <TabsTrigger 
              value="options" 
              className="data-[state=active]:bg-primary-200 data-[state=active]:text-dark-100"
            >
              3. Options
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="role" className="mt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-white text-base mb-3 block">Select Target Role</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? "bg-primary-200/20 border border-primary-200/50"
                          : "bg-dark-300/50 border border-dark-300/50 hover:border-dark-300"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-dark-300/80 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 18l6-6-6-6"></path>
                          <path d="M8 6l-6 6 6 6"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">{role.name}</p>
                        <p className="text-xs text-gray-400">Tailored questions for {role.name.toLowerCase()} positions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleNextTab}
                  className="bg-primary-200 hover:bg-primary-300 text-dark-100"
                >
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-0">
            <div className="space-y-6">
              <div>
                <Label className="text-white text-base mb-3 block">Experience Level</Label>
                <RadioGroup 
                  value={experienceLevel} 
                  onValueChange={setExperienceLevel}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  {experienceLevels.map((level) => (
                    <div key={level.id} className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value={level.id} 
                        id={level.id} 
                        className="border-primary-200 text-primary-200" 
                      />
                      <Label 
                        htmlFor={level.id} 
                        className={`text-sm font-medium cursor-pointer ${
                          experienceLevel === level.id ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {level.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white text-base mb-3 block">
                  Interview Duration: {interviewLength} minutes
                </Label>
                <Slider
                  value={[interviewLength]}
                  min={10}
                  max={30}
                  step={5}
                  onValueChange={(value) => setInterviewLength(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>10 min</span>
                  <span>15 min</span>
                  <span>20 min</span>
                  <span>25 min</span>
                  <span>30 min</span>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  onClick={handlePreviousTab}
                  variant="outline"
                  className="border-dark-300 text-gray-300 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextTab}
                  className="bg-primary-200 hover:bg-primary-300 text-dark-100"
                >
                  Continue
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="options" className="mt-0">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-base block">Include Technical Questions</Label>
                    <p className="text-xs text-gray-400">Code and technical knowledge questions</p>
                  </div>
                  <Switch
                    checked={includeCodeQuestions}
                    onCheckedChange={setIncludeCodeQuestions}
                    className="data-[state=checked]:bg-primary-200"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-base block">Include Behavioral Questions</Label>
                    <p className="text-xs text-gray-400">Soft skills and past experience questions</p>
                  </div>
                  <Switch
                    checked={includeBehavioral}
                    onCheckedChange={setIncludeBehavioral}
                    className="data-[state=checked]:bg-primary-200"
                  />
                </div>
              </div>

              <div className="bg-dark-300/50 rounded-lg p-4 mt-6">
                <h3 className="text-white font-medium mb-2">Interview Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white">{roles.find(r => r.id === selectedRole)?.name}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white">{experienceLevels.find(e => e.id === experienceLevel)?.name}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{interviewLength} minutes</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Question Types:</span>
                    <span className="text-white">
                      {[
                        includeCodeQuestions ? "Technical" : null,
                        includeBehavioral ? "Behavioral" : null
                      ].filter(Boolean).join(", ")}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  onClick={handlePreviousTab}
                  variant="outline"
                  className="border-dark-300 text-gray-300 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleStartInterview}
                  disabled={isLoading}
                  className="bg-primary-200 hover:bg-primary-300 text-dark-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting up...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default InterviewSetup;
