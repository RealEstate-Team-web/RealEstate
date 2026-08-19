import React, { useState } from 'react';
import { Bell, Shield, Eye, Moon, Trash2, Check } from 'lucide-react';

export const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [newMatchAlerts, setNewMatchAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Configure how you receive updates about properties and visits.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Notifications</p>
                <p className="text-[11px] text-slate-500">Receive email alerts for property updates and visit schedules.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">SMS Alerts</p>
                <p className="text-[11px] text-slate-500">Get text message reminders before scheduled appointments.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Price Drop Alerts</p>
                <p className="text-[11px] text-slate-500">Instant notification when a saved favorite property drops in price.</p>
              </div>
              <input
                type="checkbox"
                checked={priceDropAlerts}
                onChange={(e) => setPriceDropAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-900">New Property Matches</p>
                <p className="text-[11px] text-slate-500">Alerts when new properties matching your search criteria are listed.</p>
              </div>
              <input
                type="checkbox"
                checked={newMatchAlerts}
                onChange={(e) => setNewMatchAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Account Management & Privacy */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Privacy & Data Controls</h2>
              <p className="text-xs text-slate-500">Manage profile visibility and account data.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            {saved && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <Check size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-700/20 cursor-pointer"
            >
              Save Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
