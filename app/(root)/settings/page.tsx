import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const SettingsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>
          <p className="text-gray-400">Manage your application preferences</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-dark-300 text-gray-300 hover:text-white">
            <Link href="/profile">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Log Out
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden h-full">
            <div className="p-6 h-full">
              <nav className="space-y-2">
                <a href="#account" className="block p-3 rounded-md bg-dark-300/80 text-white font-medium border border-primary-200/30">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Account Settings
                  </div>
                </a>
                <a href="#notifications" className="block p-3 rounded-md hover:bg-dark-300/80 text-gray-300 hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    Notifications
                  </div>
                </a>
                <a href="#appearance" className="block p-3 rounded-md hover:bg-dark-300/80 text-gray-300 hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Appearance
                  </div>
                </a>
                <a href="#privacy" className="block p-3 rounded-md hover:bg-dark-300/80 text-gray-300 hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Privacy & Security
                  </div>
                </a>
                <a href="#integrations" className="block p-3 rounded-md hover:bg-dark-300/80 text-gray-300 hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      <polyline points="16 16 12 12 8 16" />
                    </svg>
                    Integrations
                  </div>
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div id="account" className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Account Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-dark-300/80 rounded-md border border-dark-300/50 text-white focus:border-primary-200 focus:outline-none"
                    value={user?.email}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <Button className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">Change Password</Button>
                </div>
                
                <div className="pt-6 mt-6 border-t border-dark-300/50">
                  <h3 className="text-lg font-medium mb-2 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Danger Zone
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div id="notifications" className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-300/40 rounded-md border border-dark-300/50 hover:border-primary-200/20 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">Receive emails about your account activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-dark-300/40 rounded-md border border-dark-300/50 hover:border-primary-200/20 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Interview Reminders</h4>
                    <p className="text-gray-400 text-sm">Get notified about upcoming interviews</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-200"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-dark-300/40 rounded-md border border-dark-300/50 hover:border-primary-200/20 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Marketing Emails</h4>
                    <p className="text-gray-400 text-sm">Receive updates about new features and promotions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-200"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-8 bg-gradient-to-br from-primary-300/40 to-primary-400/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary-300/30">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Practice?</h2>
            <p className="text-gray-300 max-w-xl">Continue practicing with our AI-powered interview platform and build the confidence you need to succeed.</p>
          </div>
          <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium whitespace-nowrap">
            <Link href="/interview">Start New Practice</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
