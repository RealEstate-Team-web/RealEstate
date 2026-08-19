import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Lock, Camera, Check, ShieldCheck } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || 'Abebe');
  const [lastName, setLastName] = useState(user?.lastName || 'Kebede');
  const [email, setEmail] = useState(user?.email || 'abebe.k@nesthome.com');
  const [phone, setPhone] = useState(user?.phone || '+251 911 123 456');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile({ firstName, lastName, email, phone });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
      </div>

      {/* Two Column Grid Layout matching Screenshot 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card Panel: Personal Information (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Personal Information
            </h2>

            {/* Profile Avatar & Photo Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                  alt={user?.name || 'Abebe Kebede'}
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-md"
                />
                <button className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition cursor-pointer">
                  <Camera size={14} />
                </button>
              </div>
              <button className="mt-3 px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 text-xs font-semibold rounded-lg transition cursor-pointer">
                Change Photo
              </button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-700 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-700 font-medium focus:outline-none"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <Check size={16} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-700/20 cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Right Card Panel: Security Settings (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Security Settings
            </h2>

            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Change Password</h3>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
                {/* Password Strength Progress Bar Indicator */}
                <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-3/4 transition-all duration-300"></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <ShieldCheck size={16} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-700/20 cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
