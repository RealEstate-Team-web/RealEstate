import {
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2
} from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs">
        {/* Section 1: Notification Preferences */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500">Choose how you receive updates about saved properties and visit alerts.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                <p className="text-[11px] text-slate-500">Receive visit confirmations and agent replies via email.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500" />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">SMS / Phone Alerts</p>
                <p className="text-[11px] text-slate-500">Get instant SMS reminders 1 hour before scheduled visits.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500" />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">Price Drop Alerts</p>
                <p className="text-[11px] text-slate-500">Alert me when a saved favorite property reduces its price.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500" />
            </label>
          </div>
        </div>

        {/* Section 2: Security & Password */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
              <p className="text-xs text-slate-500">Manage your account password and security credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Regional & Currency Settings */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Regional Preferences</h3>
              <p className="text-xs text-slate-500">Configure currency display and default search area.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Display Currency</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-700">
                <option>USD ($) - United States Dollar</option>
                <option>ETB (ብር) - Ethiopian Birr</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Default City / Area</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-700">
                <option>Addis Ababa, Ethiopia</option>
                <option>Hawassa, Ethiopia</option>
                <option>Adama, Ethiopia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 size={16} />
            <span>All settings up to date</span>
          </div>

          <button className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-blue-700/20">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
