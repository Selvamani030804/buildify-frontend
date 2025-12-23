import React, { useState } from 'react';
import { User as UserIcon, LogOut, Shield, Bell, CreditCard, Mail, Check, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (name: string, email: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // If accessed directly without login (shouldn't happen with layout logic but good safety)
  if (!user) {
     return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fadeIn">
            <div className="p-4 bg-slate-800 rounded-full mb-4 text-slate-400">
               <UserIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Guest Mode</h2>
            <p className="text-slate-400 mb-6">Please sign in to access settings.</p>
        </div>
     );
  }

  const handleSaveProfile = () => {
    onUpdateUser(tempName, user.email);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex items-center gap-6">
         <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
           {user.name.charAt(0)}
         </div>
         <div className="flex-1 min-w-0">
            {isEditing ? (
               <div className="flex items-center gap-2 mb-1">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button onClick={handleSaveProfile} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"><Check size={16}/></button>
               </div>
            ) : (
               <h3 className="text-xl font-bold text-white truncate">{user.name}</h3>
            )}
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 truncate">
               <Mail size={14} />
               <span>{user.email}</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
               {user.plan || 'Free'} Plan
            </div>
         </div>
         <button 
           onClick={() => setIsEditing(!isEditing)}
           className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
         >
            {isEditing ? 'Cancel' : 'Edit Profile'}
         </button>
      </div>

      <div className="space-y-4">
         <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">General</h3>
         
         <div className="bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm divide-y divide-slate-800">
            {/* Notifications Toggle */}
            <div 
               className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer"
               onClick={() => setEmailNotifs(!emailNotifs)}
            >
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Bell size={20} /></div>
                  <div>
                     <div className="text-white font-medium">Email Notifications</div>
                     <div className="text-slate-500 text-xs">Receive updates about your projects</div>
                  </div>
               </div>
               <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailNotifs ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotifs ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
            </div>

            {/* Security Toggle */}
            <div 
               className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer"
               onClick={() => setTwoFactor(!twoFactor)}
            >
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Shield size={20} /></div>
                  <div>
                     <div className="text-white font-medium">Two-Factor Auth</div>
                     <div className="text-slate-500 text-xs">Secure your account</div>
                  </div>
               </div>
               <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${twoFactor ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
            </div>

            {/* Billing - Static for demo */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><CreditCard size={20} /></div>
                  <div>
                     <div className="text-white font-medium">Billing Method</div>
                     <div className="text-slate-500 text-xs">Visa ending in 4242</div>
                  </div>
               </div>
               <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Manage</span>
            </div>
         </div>
      </div>

      <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">Danger Zone</h3>
          <div className="bg-red-500/5 rounded-2xl border border-red-500/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-200">
                  <AlertCircle size={20} className="text-red-500" />
                  <span className="text-sm">Delete all project data</span>
              </div>
              <button className="text-xs font-bold text-red-500 hover:text-red-400 hover:underline">
                  Delete
              </button>
          </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full p-4 mt-8 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2 font-medium transition-colors"
      >
         <LogOut size={18} />
         Log Out
      </button>

      <div className="text-center text-xs text-slate-600 pt-4">
         Buildify v1.1.0 • buildify.ai
      </div>
    </div>
  );
};