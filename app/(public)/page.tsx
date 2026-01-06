import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      {/* Add padding to account for fixed navbar */}
      <div className="pt-24"></div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-orange-100/20 to-blue-100/10 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-gradient-to-l from-blue-100/10 to-orange-100/5 blur-3xl rounded-full -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-orange-200/20 backdrop-blur-sm rounded-full border border-orange-100/30">
                <span className="text-orange-100 font-semibold text-sm">AI-Powered Interview Practice</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Master Your <span className="text-gradient bg-gradient-to-r from-orange-100 to-blue-100">Interview Skills</span> with Confidence
              </h1>
              
              <p className="text-gray-100 text-lg md:text-xl max-w-xl leading-relaxed">
                Practice unlimited job interviews with our AI interviewer. Get instant feedback, 
                track your progress, and land your dream job with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sign-up" className="bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-100 text-white font-medium rounded-lg px-8 py-4 text-center transition-all shadow-lg hover:shadow-orange-100/20 hover:shadow-xl">
                  Start Practicing Free
                </Link>
                <Link href="#how-it-works" className="bg-dark-200/80 hover:bg-dark-300/80 text-white border border-dark-300/50 font-medium rounded-lg px-8 py-4 text-center transition-all flex items-center justify-center group">
                  <span>See How It Works</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-dark-100 flex items-center justify-center bg-gradient-to-br ${i % 2 === 0 ? 'from-orange-100/80 to-orange-200/80' : 'from-blue-100/80 to-blue-200/80'}`}>
                      <span className="text-xs font-bold text-white">{i === 1 ? 'JD' : i === 2 ? 'MK' : i === 3 ? 'AR' : 'TW'}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-300 text-sm">4.9/5 from 2,300+ users</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-200 to-primary-300 rounded-2xl blur opacity-20 animate-pulse"></div>
              <div className="relative bg-dark-200/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-dark-300/50 shadow-xl">
                <div className="p-1">
                  <div className="bg-dark-300/80 rounded-t-xl p-3 flex items-center space-x-2 border-b border-dark-300/50">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-gray-400 flex-1 text-center">SkillSage Interview Session</div>
                  </div>
                  <div className="p-6 h-[400px] relative">
                    <div className="absolute top-6 left-6 right-6 bottom-6 bg-dark-100/80 rounded-lg p-4 overflow-hidden">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary-200/30 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                          </svg>
                        </div>
                        <div className="bg-dark-200/80 rounded-lg rounded-tl-none p-3 text-gray-300 text-sm flex-1">
                          <p className="font-medium text-white mb-1">AI Interviewer</p>
                          <p>Tell me about a challenging project you worked on and how you overcame obstacles during its implementation.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 mb-6 justify-end">
                        <div className="bg-primary-200/20 rounded-lg rounded-tr-none p-3 text-gray-300 text-sm max-w-[80%]">
                          <p className="font-medium text-white mb-1">You</p>
                          <p>In my previous role, I led the migration of our legacy system to a microservices architecture...</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">JD</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary-200/30 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                          </svg>
                        </div>
                        <div className="bg-dark-200/90 rounded-lg rounded-tl-none p-3 text-gray-100 text-sm flex-1 border border-dark-300/50">
                          <p className="font-medium text-white mb-1">AI Interviewer</p>
                          <p>That sounds interesting. What specific challenges did you face during the migration process?</p>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-dark-300/80 rounded-lg p-2 flex items-center">
                          <input type="text" className="bg-transparent border-none outline-none text-white text-sm flex-1 px-2" placeholder="Type your response..." />
                          <button className="bg-primary-200 hover:bg-primary-300 text-dark-100 rounded-md p-2 flex-shrink-0 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-dark-200/50 -z-10"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-300/50 to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-200/10 backdrop-blur-sm rounded-full border border-primary-200/20 mb-4">
              <span className="text-primary-200 font-medium text-sm">Why Choose SkillSage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Everything You Need to Ace Your Interviews</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to prepare for your next interview,
              from realistic practice to detailed feedback and analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all hover:border-primary-200/30 group">
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-100 transition-colors">Realistic AI Interviews</h3>
              <p className="text-gray-300 leading-relaxed">
                Practice with our advanced SkillSage interviewer that adapts questions based on your responses, 
                creating a realistic interview experience. Choose from different roles, industries, and difficulty levels.
              </p>
              <div className="mt-6 pt-6 border-t border-dark-300/30">
                <Link href="/sign-up" className="text-primary-200 hover:text-primary-100 font-medium flex items-center transition-colors">
                  <span>Try an interview</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all hover:border-primary-200/30 group">
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-100 transition-colors">Detailed Feedback & Analysis</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive comprehensive feedback on your answers, including communication skills, technical accuracy, 
                and specific areas for improvement. Our AI provides actionable insights to help you improve.
              </p>
              <div className="mt-6 pt-6 border-t border-dark-300/30">
                <Link href="/sign-up" className="text-primary-200 hover:text-primary-100 font-medium flex items-center transition-colors">
                  <span>See sample feedback</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all hover:border-primary-200/30 group">
              <div className="bg-gradient-to-br from-primary-200 to-primary-300 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-100 transition-colors">Progress Tracking & Analytics</h3>
              <p className="text-gray-100 leading-relaxed">
                Monitor your improvement over time with detailed analytics and performance metrics. Track your progress across 
                different interview types and skills to focus your preparation where it matters most.
              </p>
              <div className="mt-6 pt-6 border-t border-dark-300/30">
                <Link href="/sign-up" className="text-primary-200 hover:text-primary-100 font-medium flex items-center transition-colors">
                  <span>View analytics demo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-dark-200/40 backdrop-blur-sm rounded-xl border border-dark-300/30 p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <p className="text-gray-400">Interview Questions</p>
            </div>
            <div className="bg-dark-200/40 backdrop-blur-sm rounded-xl border border-dark-300/30 p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <p className="text-gray-400">Job Roles Covered</p>
            </div>
            <div className="bg-dark-200/40 backdrop-blur-sm rounded-xl border border-dark-300/30 p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <p className="text-gray-400">User Satisfaction</p>
            </div>
            <div className="bg-dark-200/40 backdrop-blur-sm rounded-xl border border-dark-300/30 p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <p className="text-gray-400">Practice Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-light-300 text-lg max-w-3xl mx-auto">
              Start improving your interview skills in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary-200 text-white text-xl font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Choose Your Interview</h3>
              <p className="text-light-400">
                Select from a variety of interview types, including technical, behavioral, 
                role-specific, and company-specific interviews.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative p-6">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary-200 text-white text-xl font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Practice with AI</h3>
              <p className="text-light-400">
                Engage in a realistic interview with our AI interviewer. Answer questions 
                just like you would in a real interview.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative p-6">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary-200 text-white text-xl font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Get Feedback & Improve</h3>
              <p className="text-light-400">
                Receive detailed feedback on your performance, and use our tools to track 
                your progress and improve your weaknesses.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/10 to-primary-300/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-lg font-bold text-dark-100">SJ</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Sarah Johnson</h4>
                  <p className="text-gray-200 text-sm">Software Engineer at Google</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-100 leading-relaxed mb-6">
                "SkillSage was a game-changer for my job search. After practicing with the AI interviewer for just two weeks, I felt so much more confident in my actual interviews. The detailed feedback helped me identify and fix weaknesses in my responses that I wasn't even aware of."
              </p>
              
              <div className="text-primary-100 text-sm font-medium">
                Landed job after 4 weeks of practice
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/10 to-primary-300/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-lg font-bold text-white">MT</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Michael Thompson</h4>
                  <p className="text-gray-400 text-sm">Product Manager at Microsoft</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                "I was always nervous during interviews, but after practicing with SkillSage, I gained the confidence I needed. The realistic AI interviews helped me prepare for tough questions and now I actually enjoy the interview process!"
              </p>
              
              <div className="text-primary-100 text-sm font-medium">
                Received 3 job offers after using SkillSage
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/10 to-primary-300/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center mr-4 shadow-md">
                  <span className="text-lg font-bold text-white">JR</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Jessica Rodriguez</h4>
                  <p className="text-gray-400 text-sm">Data Scientist at Amazon</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                "The technical interview practice on SkillSage was invaluable. Being able to verbally explain my thought process while solving problems helped me tremendously during actual interviews. The AI's feedback on my communication clarity was spot on."
              </p>
              
              <div className="text-primary-100 text-sm font-medium">
                Improved interview performance by 40%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-dark-100/20 -z-10"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-300/50 to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-200/10 backdrop-blur-sm rounded-full border border-primary-200/20 mb-4">
              <span className="text-primary-100 font-medium text-sm">Simple Credit-Based Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Plans for Every Stage of Your Career</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Choose the plan that fits your needs. <span className="text-primary-200 font-medium">1 credit = 5 minutes</span> of interview time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <div className="flex items-end mb-2">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2 mb-1">/month</span>
              </div>
              <div className="mb-6">
                <span className="inline-block bg-dark-300/80 text-primary-200 text-sm font-medium px-3 py-1 rounded-full">1 credit (5 mins)</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">1 AI interview session per month</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Basic feedback</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Limited question types</span>
                </li>
                <li className="flex items-start opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">Advanced analytics</span>
                </li>
              </ul>
              
              <Link href="/sign-up" className="block text-center bg-dark-300/80 hover:bg-dark-300 text-white border border-dark-300/50 font-medium rounded-lg px-6 py-3 transition-all">
                Get Started Free
              </Link>
            </div>
            
            {/* Standard Plan */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/10 to-primary-300/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
              <div className="flex items-end mb-2">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-gray-400 ml-2 mb-1">/month</span>
              </div>
              <div className="mb-6">
                <span className="inline-block bg-primary-200/20 text-primary-200 text-sm font-medium px-3 py-1 rounded-full">5 credits (25 mins)</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">5 AI interview sessions per month</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Detailed feedback</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">All question types</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Interview history</span>
                </li>
              </ul>
              
              <Link href="/sign-up" className="block text-center bg-dark-300/80 hover:bg-dark-300 text-white border border-dark-300/50 font-medium rounded-lg px-6 py-3 transition-all">
                Get Started
              </Link>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-primary-200/30 p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group transform scale-105 z-10">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-primary-300/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="absolute top-0 right-0 bg-primary-200 text-dark-100 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                BEST VALUE
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <div className="flex items-end mb-2">
                <span className="text-4xl font-bold text-white">$19.99</span>
                <span className="text-gray-400 ml-2 mb-1">/month</span>
              </div>
              <div className="mb-6">
                <span className="inline-block bg-primary-200/30 text-primary-100 text-sm font-medium px-3 py-1 rounded-full">15 credits (75 mins)</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">15 AI interview sessions per month</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Detailed feedback & analytics</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Custom interview scenarios</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-100 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Priority support</span>
                </li>
              </ul>
              
              <Link href="/sign-up" className="block text-center bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-200 text-dark-100 font-medium rounded-lg px-6 py-3 transition-all shadow-lg hover:shadow-primary-200/20 hover:shadow-xl">
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Credit explanation */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-dark-200/60 backdrop-blur-sm rounded-full px-6 py-3 border border-dark-300/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-200 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300 text-sm"><span className="text-primary-200 font-medium">1 credit = 5 minutes</span> of interview time. Credits reset monthly.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/10 to-primary-200/5 -z-10"></div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-200/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="bg-dark-200/80 backdrop-blur-md rounded-2xl p-12 border border-dark-300/50 shadow-xl relative overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl p-0.5 -z-10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-200/20 via-primary-300/20 to-primary-200/20 animate-gradient-x"></div>
            </div>
            
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-blue-100/10 backdrop-blur-sm rounded-full border border-orange-100/20 mb-6">
                <span className="text-orange-100 font-medium text-sm">Start Your Journey Today</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Ace Your Next Interview?</h2>
              
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their interview skills with SkillSage. 
                Start practicing with our AI interviewer today and get one step closer to landing your dream job.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/sign-up" className="bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-100 text-white font-medium rounded-lg px-8 py-4 text-center transition-all shadow-lg hover:shadow-orange-100/20 hover:shadow-xl flex items-center justify-center">
                  <span>Get Started for Free</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
                
                <Link href="#how-it-works" className="bg-dark-300/80 hover:bg-dark-300 text-white border border-dark-300/50 font-medium rounded-lg px-8 py-4 text-center transition-all flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  <span>Watch Demo</span>
                </Link>
              </div>
              
              <div className="mt-12 pt-8 border-t border-dark-300/30 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-100 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-300 text-sm">Secure & Private</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-100 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300 text-sm">Cancel Anytime</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-100 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-gray-300 text-sm">No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
