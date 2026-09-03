import { useEffect, useRef, useState } from 'react';
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile, uploadProfileImage } from '../../services/user.service';

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

const Profile = () => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [fieldErrors, setFieldErrors] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
        });
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = {};
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();

    if (firstName.length > 100) errors.firstName = 'First name must be at most 100 characters';
    if (lastName.length > 100) errors.lastName = 'Last name must be at most 100 characters';
    if (phone && !/^\+?[0-9]{7,15}$/.test(phone)) errors.phone = 'Enter a valid phone number';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      setProfile(updated);
      updateUser(updated);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const updated = await uploadProfileImage(file);
      setProfile(updated);
      updateUser(updated);
      setSuccess('Profile image updated');
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 font-sans">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-40 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="lg:col-span-8 h-80 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Admin'
    : 'Admin';

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1D6FD3] mb-1">
          Account
        </p>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0"
          >
            <UserCircle size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">My Profile</h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          View and update your account information
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column — Avatar Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] text-center flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar
                src={profile?.profileImageUrl}
                alt={displayName}
                size={112}
                className="border-4 border-slate-100 shadow-md"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white rounded-full shadow-md transition cursor-pointer disabled:opacity-50"
                title="Update profile image"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize">
              {profile?.role || 'Administrator'}
            </p>

            <span className="mt-3 px-3 py-1 bg-[#E6F4EC] text-[#1D6FD3] text-xs font-bold rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
              <CheckCircle size={14} />
              {profile?.status === 'active' ? 'Active' : 'Suspended'}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Account Role</span>
                <span className="font-semibold text-slate-900 capitalize">{profile?.role || 'Admin'}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Member Since</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Security badge */}
          <div className="bg-[#E7F0FB] border border-blue-100 rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-[#4A9FF5] text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Account Security</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Use strong passwords and keep your account credentials up to date.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Personal Information */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] space-y-6">
          <div>
            <h3 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-slate-100">
              Personal Information
            </h3>
          </div>

          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-slate-600 uppercase mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  aria-invalid={!!fieldErrors.firstName}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
                />
                {fieldErrors.firstName && (
                  <p className="text-[11px] text-[#B23B36] mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  aria-invalid={!!fieldErrors.lastName}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
                />
                {fieldErrors.lastName && (
                  <p className="text-[11px] text-[#B23B36] mt-1">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  value={profile?.email || ''}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed from this page</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  aria-invalid={!!fieldErrors.phone}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition"
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-[11px] text-[#B23B36] mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)] disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving…' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
