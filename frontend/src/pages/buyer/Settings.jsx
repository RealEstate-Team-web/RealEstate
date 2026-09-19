import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';
import authService from '../../services/auth.service';

const SETTINGS_STORAGE_KEY = 'buyer_account_preferences';

const getSavedPreferences = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const Settings = () => {
  const { t } = useTranslation('buyer');
  const initialPrefs = getSavedPreferences();

  // Preference states
  const [emailNotifications, setEmailNotifications] = useState(
    typeof initialPrefs.emailNotifications === 'boolean' ? initialPrefs.emailNotifications : true
  );
  const [smsAlerts, setSmsAlerts] = useState(
    typeof initialPrefs.smsAlerts === 'boolean' ? initialPrefs.smsAlerts : true
  );
  const [priceDropAlerts, setPriceDropAlerts] = useState(
    typeof initialPrefs.priceDropAlerts === 'boolean' ? initialPrefs.priceDropAlerts : true
  );
  const [currency, setCurrency] = useState(initialPrefs.currency || 'USD');
  const [defaultArea, setDefaultArea] = useState(initialPrefs.defaultArea || 'Addis Ababa, Ethiopia');
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSavePreferences = () => {
    try {
      const prefs = {
        emailNotifications,
        smsAlerts,
        priceDropAlerts,
        currency,
        defaultArea,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(prefs));
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 4000);
    } catch {
      // Handle storage quota issues gracefully
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError(t('password_current_required'));
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordError(t('password_min_length'));
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(t('password_upper'));
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError(t('password_lower'));
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError(t('password_number'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('password_mismatch'));
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(t('password_updated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update password:', err);
      setPasswordError(
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.message) ||
        t('password_update_failed')
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('settings_title')}</h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs">
        {/* Section 1: Notification Preferences */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('settings_notif_title')}</h3>
              <p className="text-xs text-slate-500">{t('settings_notif_subtitle')}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">{t('settings_email_notif')}</p>
                <p className="text-[11px] text-slate-500">{t('settings_email_notif_desc')}</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">{t('settings_sms_alerts')}</p>
                <p className="text-[11px] text-slate-500">{t('settings_sms_alerts_desc')}</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition">
              <div>
                <p className="text-xs font-bold text-slate-800">{t('settings_price_drop')}</p>
                <p className="text-[11px] text-slate-500">{t('settings_price_drop_desc')}</p>
              </div>
              <input
                type="checkbox"
                checked={priceDropAlerts}
                onChange={(e) => setPriceDropAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-700 rounded focus:ring-blue-500 cursor-pointer"
              />
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
              <h3 className="text-sm font-bold text-slate-900">{t('settings_security_title')}</h3>
              <p className="text-xs text-slate-500">{t('settings_security_subtitle')}</p>
            </div>
          </div>

          {passwordError && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2"
            >
              <AlertCircle size={15} className="shrink-0 text-rose-500" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div
              role="alert"
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2"
            >
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="settingsCurrentPassword" className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  {t('settings_current_password')}
                </label>
                <input
                  id="settingsCurrentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="settingsNewPassword" className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  {t('settings_new_password')}
                </label>
                <input
                  id="settingsNewPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="settingsConfirmPassword" className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  {t('settings_confirm_password')}
                </label>
                <input
                  id="settingsConfirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {t('settings_password_requirements')}
              </span>

              <button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{t('settings_updating')}</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={13} />
                    <span>{t('settings_update_password')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Regional & Currency Settings */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('settings_regional_title')}</h3>
              <p className="text-xs text-slate-500">{t('settings_regional_subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="settingsCurrency" className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                {t('settings_display_currency')}
              </label>
              <select
                id="settingsCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-700"
              >
                <option value="USD">{t('settings_currency_usd')}</option>
                <option value="ETB">{t('settings_currency_etb')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="settingsArea" className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                {t('settings_default_area')}
              </label>
              <select
                id="settingsArea"
                value={defaultArea}
                onChange={(e) => setDefaultArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-700"
              >
                <option value="Addis Ababa, Ethiopia">{t('settings_city_addis')}</option>
                <option value="Hawassa, Ethiopia">{t('settings_city_hawassa')}</option>
                <option value="Adama, Ethiopia">{t('settings_city_adama')}</option>
                <option value="Bahir Dar, Ethiopia">{t('settings_city_bahirdar')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
            {prefsSaved ? (
              <>
                <CheckCircle2 size={16} />
                <span>{t('settings_prefs_saved')}</span>
              </>
            ) : (
              <span className="text-slate-400 font-normal">{t('settings_prefs_local')}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-blue-700/20"
          >
            <Save size={16} />
            <span>{t('settings_save_prefs')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
