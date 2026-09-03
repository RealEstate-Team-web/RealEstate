import { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import authService from '../../services/auth.service';

const PREFS_KEY = 'adminNotificationPrefs';
const DEFAULT_PREFS = { emailNotifications: true, smsAlerts: true, agentApprovals: true };

const readPrefs = () => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
};

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const initialPrefs = readPrefs();
  const [emailNotifications, setEmailNotifications] = useState(initialPrefs.emailNotifications);
  const [smsAlerts, setSmsAlerts] = useState(initialPrefs.smsAlerts);
  const [agentApprovals, setAgentApprovals] = useState(initialPrefs.agentApprovals);
  const [storageStatus, setStorageStatus] = useState('saved');

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({ emailNotifications, smsAlerts, agentApprovals })
      );
      setStorageStatus('saved');
    } catch {
      // Storage may be unavailable or full; keep in-memory preference state.
      setStorageStatus('error');
    }
  }, [emailNotifications, smsAlerts, agentApprovals]);

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('New password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('New password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('New password must contain at least one number');
      return;
    }

    setPasswordSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          Settings
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <SettingsIcon size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Account Settings</h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          Manage your security preferences and notifications
        </p>
      </div>

      {/* Security & Password */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-[#E6F4EC] text-[#1D6FD3] rounded-xl flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
              <p className="text-xs text-slate-500">Update your account password.</p>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl">
              <AlertCircle size={16} /> {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl">
              <CheckCircle size={16} /> {passwordSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
              />
            </div>
            <div />
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); setPasswordSuccess(null); }}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handlePasswordChange}
              disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center space-x-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)] disabled:opacity-50"
            >
              <Save size={16} />
              <span>{passwordSaving ? 'Updating…' : 'Update Password'}</span>
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-[#F5F0EB] text-[#E7B85A] rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500">Manage how you receive platform notifications.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                <p className="text-[11px] text-slate-500">Receive admin alerts and system updates via email.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">SMS / Phone Alerts</p>
                <p className="text-[11px] text-slate-500">Get instant SMS alerts for critical platform events.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">Agent Approval Alerts</p>
                <p className="text-[11px] text-slate-500">Receive alerts when agents submit registration requests.</p>
              </div>
              <input
                type="checkbox"
                checked={agentApprovals}
                onChange={(e) => setAgentApprovals(e.target.checked)}
                className="w-4 h-4 text-[#4A9FF5] rounded focus:ring-[#4A9FF5]"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
            {storageStatus === 'saved' ? (
              <>
                <CheckCircle size={16} />
                <span>Notification preferences saved locally</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>Preferences active, but couldn't save to this browser</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
