import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  Clock,
  Building2,
  MapPin,
  Award,
  Briefcase,
  XCircle,
} from "lucide-react";
import Avatar from "../../components/common/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import {
  getAgentProfile,
  updateAgentProfile,
} from "../../services/agent.service";
import { uploadProfileImage } from "../../services/user.service";

const STATUS_META = {
  incomplete: {
    label: "Incomplete",
    className: "bg-[#F7EFDD] text-[#8A6A2F] border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    icon: AlertCircle,
    helper:
      "Complete your agent profile to activate your account and list properties.",
  },
  pending: {
    label: "Pending Approval",
    className: "bg-[#FBF3DD] text-[#8A6A2F] border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    icon: Clock,
    helper: "Your profile is under review by an administrator.",
  },
  approved: {
    label: "Approved",
    className: "bg-[#E6F4EC] text-[#2F7A55] border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    icon: CheckCircle,
    helper: "Your agent account is active and you can list properties.",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#FBEAE9] text-[#B23B36] border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
    icon: XCircle,
    helper:
      "Your profile was rejected. Update your details and contact support for next steps.",
  },
};

const DEFAULT_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  agencyName: "",
  specialization: "",
  city: "",
  officeAddress: "",
  bio: "",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    getAgentProfile()
      .then((data) => {
        if (!active || !data) return;
        setProfile(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          agencyName: data.agency || "",
          specialization: data.specialization || "",
          city: data.city || "",
          officeAddress: data.officeAddress || "",
          bio: data.bio || "",
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setError(null);
    setSuccess(null);
  };

  const validate = () => {
    const errors = {};
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const agencyName = form.agencyName.trim();

    if (!firstName) errors.firstName = "First name is required";
    else if (firstName.length > 100)
      errors.firstName = "First name must be at most 100 characters";
    if (!lastName) errors.lastName = "Last name is required";
    else if (lastName.length > 100)
      errors.lastName = "Last name must be at most 100 characters";
    if (phone && !/^\+?[0-9]{7,15}$/.test(phone))
      errors.phone = "Enter a valid phone number";
    if (form.agencyName.length > 150)
      errors.agencyName = "Agency name must be at most 150 characters";
    if (form.specialization.length > 100)
      errors.specialization = "Specialization must be at most 100 characters";
    if (form.city.length > 100)
      errors.city = "City must be at most 100 characters";
    if (form.officeAddress.length > 255)
      errors.officeAddress = "Office address must be at most 255 characters";
    if (form.bio.length > 1000)
      errors.bio = "Bio must be at most 1000 characters";

    if (profile && profile.verificationStatus === "approved" && !agencyName)
      errors.agencyName = "Agency name cannot be empty once approved";

    return errors;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSaving(true);
    try {
      const updated = await updateAgentProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        agencyName: form.agencyName,
        specialization: form.specialization,
        city: form.city,
        officeAddress: form.officeAddress,
        bio: form.bio,
      });
      if (!updated) {
        throw new Error("Profile update returned an empty response");
      }
      setProfile(updated);
      updateUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        profileImageUrl: updated.profileImageUrl,
        agentProfileStatus: updated.verificationStatus,
      });
      setSuccess("Profile updated");
    } catch (err) {
      setError(err.message || "Failed to save changes");
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
      setProfile((prev) =>
        prev ? { ...prev, profileImageUrl: updated.profileImageUrl } : prev,
      );
      updateUser({ profileImageUrl: updated.profileImageUrl });
      setSuccess("Profile image updated");
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 font-sans">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-24 bg-slate-200 rounded dark:bg-slate-700" />
          <div className="h-8 w-40 bg-slate-200 rounded dark:bg-slate-700" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-64 bg-slate-200 rounded-2xl animate-pulse dark:bg-slate-700" />
          <div className="lg:col-span-8 h-80 bg-slate-200 rounded-2xl animate-pulse dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      "Agent"
    : "Agent";

  const verificationKey = profile?.verificationStatus || "incomplete";
  const status = STATUS_META[verificationKey] || STATUS_META.incomplete;
  const StatusIcon = status.icon;

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
            className="w-10 h-10 rounded-xl bg-[#E7F0FB] text-[#4A9FF5] flex items-center justify-center shrink-0 dark:bg-blue-500/10"
          >
            <UserCircle size={20} />
          </span>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight dark:text-white">
            My Profile
          </h1>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1 dark:text-slate-400">
          Manage your agent profile and account information
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div role="status" className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] px-4 py-2.5 rounded-xl dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div role="status" className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column — Identity card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] text-center flex flex-col items-center dark:bg-[#111827] dark:border-slate-800">
            <div className="relative mb-4">
              <Avatar
                src={profile?.profileImageUrl || user?.profileImageUrl}
                alt={displayName}
                size={112}
                className="border-4 border-slate-100 shadow-md dark:border-slate-800"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white rounded-full shadow-md transition cursor-pointer disabled:opacity-50"
                title="Update profile image"
                aria-label="Update profile image"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize dark:text-slate-400">
              {profile?.role || user?.role || "Agent"}
            </p>

            <span
              className={`mt-3 px-3 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1 ${status.className}`}
            >
              <StatusIcon size={14} />
              {status.label}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                  Email
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px] dark:text-white">
                  {profile?.email || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-slate-400 dark:text-slate-500" />
                  Account Role
                </span>
                <span className="font-semibold text-slate-900 capitalize dark:text-white">
                  {profile?.role || "Agent"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                  Member Since
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(profile?.memberSince)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#E7F0FB] border border-blue-100 rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] dark:bg-blue-500/10 dark:border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-[#4A9FF5] text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Account Security
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 dark:text-slate-400">
                  Your profile is private. Update your details below and
                  contact support to change your password or email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Profile details + verification */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] dark:bg-[#111827] dark:border-slate-800">
            <h3 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-slate-100 dark:text-white dark:border-slate-800">
              Verification Status
            </h3>
            <p className="text-[13px] text-[#6B7280] mt-4 dark:text-slate-400">{status.helper}</p>

            {profile?.licenseNumber && (
              <p className="text-[12px] text-slate-500 mt-3 dark:text-slate-400">
                License:{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {profile.licenseNumber}
                </span>
              </p>
            )}
            {profile?.experienceYears !== undefined &&
              profile?.experienceYears !== null && (
                <p className="text-[12px] text-slate-500 mt-1 dark:text-slate-400">
                  Experience:{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {profile.experienceYears} years
                  </span>
                </p>
              )}

            {verificationKey === "incomplete" && (
              <Link
                to={ROUTES.completeAgentProfile}
                className="mt-4 inline-flex items-center gap-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)]"
              >
                <ShieldCheck size={16} />
                Complete Agent Profile
              </Link>
            )}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)] space-y-6 dark:bg-[#111827] dark:border-slate-800">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-slate-100 dark:text-white dark:border-slate-800">
                Personal Information
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? "firstNameError" : undefined}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                  {fieldErrors.firstName && (
                    <p id="firstNameError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? "lastNameError" : undefined}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                  {fieldErrors.lastName && (
                    <p id="lastNameError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                    size={16}
                  />
                  <input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    readOnly
                    aria-readonly="true"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-500 font-medium cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 dark:text-slate-500">
                  Email cannot be changed from this page
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                    size={16}
                  />
                  <input
                    id="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? "phoneError" : undefined}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                {fieldErrors.phone && (
                  <p id="phoneError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label
                    htmlFor="agencyName"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    Agency Name
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                      size={16}
                    />
                    <input
                      id="agencyName"
                      type="text"
                      value={form.agencyName}
                      onChange={handleChange("agencyName")}
                      aria-invalid={!!fieldErrors.agencyName}
                      aria-describedby={fieldErrors.agencyName ? "agencyNameError" : undefined}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                  {fieldErrors.agencyName && (
                    <p id="agencyNameError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.agencyName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    Specialization
                  </label>
                  <div className="relative">
                    <Award
                      className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                      size={16}
                    />
                    <input
                      id="specialization"
                      type="text"
                      value={form.specialization}
                      onChange={handleChange("specialization")}
                      aria-invalid={!!fieldErrors.specialization}
                      aria-describedby={fieldErrors.specialization ? "specializationError" : undefined}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                  {fieldErrors.specialization && (
                    <p id="specializationError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    City
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500"
                      size={16}
                    />
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange("city")}
                      aria-invalid={!!fieldErrors.city}
                      aria-describedby={fieldErrors.city ? "cityError" : undefined}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                  {fieldErrors.city && (
                    <p id="cityError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="officeAddress"
                    className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                  >
                    Office Address
                  </label>
                  <input
                    id="officeAddress"
                    type="text"
                    value={form.officeAddress}
                    onChange={handleChange("officeAddress")}
                    aria-invalid={!!fieldErrors.officeAddress}
                    aria-describedby={fieldErrors.officeAddress ? "officeAddressError" : undefined}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                  {fieldErrors.officeAddress && (
                    <p id="officeAddressError" className="text-[11px] text-[#B23B36] mt-1 dark:text-rose-400">
                      {fieldErrors.officeAddress}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-xs font-semibold text-slate-600 uppercase mb-1 dark:text-slate-300"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={handleChange("bio")}
                  aria-invalid={!!fieldErrors.bio}
                  aria-describedby={fieldErrors.bio ? "bioError" : undefined}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#4A9FF5] font-medium transition resize-none dark:bg-[#1E293B] dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Tell buyers about your experience, focus areas, and approach."
                />
                <div className="flex items-center justify-between mt-1">
                  {fieldErrors.bio ? (
                    <p id="bioError" className="text-[11px] text-[#B23B36] dark:text-rose-400">
                      {fieldErrors.bio}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {form.bio.length}/1000
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-[#4A9FF5] hover:bg-[#3A8FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_4px_12px_rgba(74,159,245,0.25)] disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving…" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
