import { useAuth } from '../../hooks/useAuth';
import {
  Mail,
  Phone,
  Camera,
  Save,
  CheckCircle,
  Building,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar Card & Account Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Header Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                alt={user?.name || 'User Avatar'}
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-md"
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-md transition cursor-pointer"
                title="Update avatar"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900">{user?.name || 'Abebe Kebede'}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.title || 'Real Estate Buyer'}</p>

            <span className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
              <CheckCircle size={14} /> Verified Buyer
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Account Role</span>
                <span className="font-semibold text-slate-900 capitalize">{user?.role || 'Buyer'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Member Since</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" /> Jan 2024
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Location</span>
                <span className="font-semibold text-slate-900">Addis Ababa, ET</span>
              </div>
            </div>
          </div>

          {/* Quick Security Badge Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-blue-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Two-Factor Security Active</h4>
                <p className="text-xs text-slate-500 mt-1">Your account authentication and saved properties are protected with end-to-end security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Settings Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Personal Information
            </h3>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  defaultValue={user?.firstName || 'Abebe'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  defaultValue={user?.lastName || 'Kebede'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  defaultValue={user?.email || 'abebe.k@nesthome.com'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    defaultValue={user?.phone || '+251 911 123 456'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Preferred Location</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    defaultValue="Bole, Addis Ababa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-blue-700/20"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
