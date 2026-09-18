import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Mail,
  Phone,
  Camera,
  Save,
  CheckCircle,
  Building,
  ShieldCheck,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getProfile, updateProfile, uploadProfileImage } from '../../services/user.service';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLocation, setPreferredLocation] = useState('Addis Ababa, Ethiopia');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hydrate profile data from API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        if (!isMounted) return;
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setPhone(data.phone || '');
        updateUser(data);
      } catch {
        if (!isMounted) return;
        if (user) {
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setPhone(user.phone || '');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2024';

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email || 'Valued Buyer';

  const handleAvatarClick = () => {
    if (!uploadingImage) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image size cannot exceed 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      setSuccess('');
      const updated = await uploadProfileImage(file);
      updateUser(updated);
      setSuccess('Profile photo updated successfully!');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError(
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.message) ||
        'Failed to upload profile photo'
      );
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updated = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || null,
      });

      updateUser(updated);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(', ')
          : err.message) ||
        'Failed to save profile changes'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">My Profile</h1>
      </div>

      {/* Status Alerts */}
      {error && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-2.5 shadow-2xs dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300"
        >
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="alert"
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2.5 shadow-2xs animate-in fade-in duration-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300"
        >
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar Card & Account Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Header Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center flex flex-col items-center dark:bg-[#111827] dark:border-slate-800">
            <div className="relative mb-4">
              <img
                src={
                  user?.profileImageUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
                }
                alt={displayName}
                className={`w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-md dark:border-slate-700 ${
                  uploadingImage ? 'opacity-50' : ''
                }`}
              />

              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-full">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              )}

              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-md transition cursor-pointer disabled:opacity-50"
                title="Update avatar"
                aria-label="Upload profile image"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 dark:text-slate-400">{user?.email}</p>

            <span className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200/60 inline-flex items-center gap-1 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">
              <CheckCircle size={14} /> Verified Buyer
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Account Role</span>
                <span className="font-semibold text-slate-900 capitalize dark:text-white">{user?.role || 'Buyer'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Member Since</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 dark:text-white">
                  <Calendar size={13} className="text-slate-400 dark:text-slate-500" /> {memberSince}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Location</span>
                <span className="font-semibold text-slate-900 dark:text-white">Addis Ababa, ET</span>
              </div>
            </div>
          </div>

          {/* Quick Security Badge Box */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 shadow-xs dark:bg-blue-500/10 dark:border-blue-500/30">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-blue-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Security Active</h4>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                  Your account authentication and saved properties are protected with end-to-end security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Settings Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 dark:bg-[#111827] dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 dark:text-white dark:border-slate-800">
              Personal Information
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profileFirstName" className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profileFirstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading || saving}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60 dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="profileLastName" className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profileLastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading || saving}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60 dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profileEmail" className="block text-xs font-semibold text-slate-600 uppercase mb-1 flex items-center justify-between dark:text-slate-300">
                <span>Email Address</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase dark:text-slate-500">(Primary account identifier)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={16} />
                <input
                  id="profileEmail"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-500 font-medium cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profilePhone" className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={16} />
                  <input
                    id="profilePhone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 911 123 456"
                    disabled={loading || saving}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60 dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profileLocation" className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300">
                  Preferred Location
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" size={16} />
                  <input
                    id="profileLocation"
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="Bole, Addis Ababa"
                    disabled={loading || saving}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium transition disabled:opacity-60 dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3 dark:border-slate-800">
              <button
                type="submit"
                disabled={saving || loading}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-blue-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
