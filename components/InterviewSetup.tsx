"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InterviewSetupProps {
  userName: string;
  userId: string;
  profileImage?: string;
}

const experienceLevels = [
  { id: "entry", name: "Entry Level", description: "0-1 years" },
  { id: "junior", name: "Junior", description: "1-3 years" },
  { id: "mid", name: "Mid-Level", description: "3-5 years" },
  { id: "senior", name: "Senior", description: "5-10 years" },
  { id: "lead", name: "Lead/Principal", description: "10+ years" },
];

const InterviewSetup = ({ userName, userId }: InterviewSetupProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form fields - all free-form, user enters whatever they want
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [questionCount, setQuestionCount] = useState(5);
  const [includeTechnical, setIncludeTechnical] = useState(true);
  const [includeBehavioral, setIncludeBehavioral] = useState(true);

  const getInterviewType = () => {
    if (includeTechnical && includeBehavioral) return "mixed";
    if (includeTechnical) return "technical";
    if (includeBehavioral) return "behavioral";
    return "mixed";
  };

  const handleStartInterview = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const type = getInterviewType();
      const skillsFormatted = skills.trim() || "General professional skills";
      
      // Build a comprehensive role description for the AI
      const roleDescription = [
        jobTitle.trim(),
        company.trim() ? `at ${company.trim()}` : "",
        industry.trim() ? `in the ${industry.trim()} industry` : "",
      ].filter(Boolean).join(" ");

      console.log('Creating interview with params:', {
        userId,
        role: roleDescription,
        level: experienceLevel,
        type,
        skills: skillsFormatted,
        jobDescription: jobDescription.trim(),
        amount: questionCount
      });

      const response = await fetch(`/api/vapi/generate?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userName: userName,
          role: roleDescription,
          level: experienceLevel,
          type: type,
          techstack: skillsFormatted,
          jobDescription: jobDescription.trim(),
          amount: String(questionCount)
        }),
      });

      const data = await response.json();
      console.log('Interview creation response:', data);
      
      if (data.success && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        setError(data.error || 'Failed to create interview. Please try again.');
      }
    } catch (err) {
      console.error("Error creating interview:", err);
      setError('An error occurred while creating the interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-dark-300/50">
        <h2 className="text-xl font-semibold text-white">Create Your Interview</h2>
        <p className="text-gray-400 text-sm mt-1">
          Tell us about the position you&apos;re preparing for
        </p>
      </div>

      {/* Progress indicator */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep >= step
                    ? "bg-primary-200 text-dark-100"
                    : "bg-dark-300/50 text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                    currentStep > step ? "bg-primary-200" : "bg-dark-300/50"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>Position</span>
          <span>Details</span>
          <span>Preferences</span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="p-6">
        {/* Step 1: Basic Position Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <Label className="text-white text-sm mb-2 block">
                Job Title <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., Software Engineer, Nurse, Financial Analyst, Teacher..."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="bg-dark-300/50 border-dark-300 text-white placeholder:text-gray-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter any job title - we&apos;ll generate relevant questions
              </p>
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">
                Company (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g., Google, Local Hospital, Startup..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-dark-300/50 border-dark-300 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">
                Industry (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g., Technology, Healthcare, Finance, Education..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-dark-300/50 border-dark-300 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={!jobTitle.trim()}
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Skills and Job Description */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="text-white text-sm mb-2 block">
                Key Skills & Technologies
              </Label>
              <Input
                type="text"
                placeholder="e.g., Python, Patient Care, Excel, Project Management..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-dark-300/50 border-dark-300 text-white placeholder:text-gray-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">
                Job Description (Optional)
              </Label>
              <Textarea
                placeholder="Paste the job description here for more targeted questions..."
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                className="bg-dark-300/50 border-dark-300 text-white placeholder:text-gray-500 min-h-[120px]"
              />
              <p className="text-gray-500 text-xs mt-1">
                Adding a job description helps generate more specific questions
              </p>
            </div>

            <div>
              <Label className="text-white text-sm mb-3 block">Experience Level</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {experienceLevels.map((level) => (
                  <div
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all text-center ${
                      experienceLevel === level.id
                        ? "bg-primary-200/20 border border-primary-200/50"
                        : "bg-dark-300/50 border border-dark-300/50 hover:border-dark-300"
                    }`}
                  >
                    <p className={`font-medium text-sm ${
                      experienceLevel === level.id ? "text-white" : "text-gray-300"
                    }`}>
                      {level.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-dark-300 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="bg-primary-200 hover:bg-primary-300 text-dark-100"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Interview Preferences */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <Label className="text-white text-sm mb-3 block">
                Number of Questions: {questionCount}
              </Label>
              <Slider
                value={[questionCount]}
                min={3}
                max={15}
                step={1}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>3 (Quick)</span>
                <span>15 (Comprehensive)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white text-sm block">Question Types</Label>
              
              <div className="flex items-center justify-between p-3 bg-dark-300/30 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Technical / Role-Specific</p>
                  <p className="text-xs text-gray-400">Knowledge and skills for the role</p>
                </div>
                <Switch
                  checked={includeTechnical}
                  onCheckedChange={setIncludeTechnical}
                  className="data-[state=checked]:bg-primary-200"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-300/30 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">Behavioral</p>
                  <p className="text-xs text-gray-400">Past experiences and soft skills</p>
                </div>
                <Switch
                  checked={includeBehavioral}
                  onCheckedChange={setIncludeBehavioral}
                  className="data-[state=checked]:bg-primary-200"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-primary-300/20 to-primary-400/10 rounded-lg p-4 border border-primary-300/30">
              <h3 className="text-white font-semibold mb-3 text-sm">Interview Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">
                    {jobTitle || "Not specified"}
                  </span>
                </div>
                {company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span className="text-white">{company}</span>
                  </div>
                )}
                {industry && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Industry:</span>
                    <span className="text-white">{industry}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">
                    {experienceLevels.find(l => l.id === experienceLevel)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Questions:</span>
                  <span className="text-white">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Focus:</span>
                  <span className="text-white">
                    {[
                      includeTechnical ? "Technical" : null,
                      includeBehavioral ? "Behavioral" : null
                    ].filter(Boolean).join(" + ") || "General"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-dark-300 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleStartInterview}
                disabled={isLoading || (!includeTechnical && !includeBehavioral)}
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Create Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSetup;
