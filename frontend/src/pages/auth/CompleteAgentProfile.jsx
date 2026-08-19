import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, BadgeCheck, Briefcase, MapPin } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import AuthLayout from '../../layouts/AuthLayout'
import FormInput from '../../components/forms/FormInput'
import FormTextarea from '../../components/forms/FormTextarea'
import ProfilePhotoUpload from '../../components/forms/ProfilePhotoUpload'
import { ROLE_DASHBOARDS } from '../../utils/constants'

const initialState = {
  agencyName: '',
  licenseNumber: '',
  experience: '',
  officeAddress: '',
  bio: '',
}

const CompleteAgentProfile = () => {
  const navigate = useNavigate()
  const { user, completeAgentProfile } = useAuth()

  const [form, setForm] = useState(initialState)
  const [photo, setPhoto] = useState({ file: null, error: null })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((err) => ({ ...err, [e.target.name]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    if (!form.agencyName.trim()) next.agencyName = 'Agency name is required.'
    if (!form.licenseNumber.trim()) {
      next.licenseNumber = 'License number is required.'
    } else if (form.licenseNumber.trim().length > 50) {
      next.licenseNumber = 'License number must be at most 50 characters.'
    }
    if (form.experience === '' || Number.isNaN(Number(form.experience)) || Number(form.experience) < 0) {
      next.experience = 'Experience must be a valid number.'
    }
    if (!form.officeAddress.trim()) next.officeAddress = 'Office address is required.'
    if (form.bio.trim() && form.bio.trim().length < 20) {
      next.bio = 'Bio must be at least 20 characters.'
    } else if (form.bio.trim().length > 500) {
      next.bio = 'Bio must be at most 500 characters.'
    }
    if (photo.error) {
      next.photo = photo.error
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      await completeAgentProfile({
        agencyName: form.agencyName.trim(),
        licenseNumber: form.licenseNumber.trim(),
        experience: form.experience,
        officeAddress: form.officeAddress.trim(),
        bio: form.bio.trim(),
        profilePhoto: photo.file,
      })
      navigate(ROLE_DASHBOARDS.agent, { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate(ROLE_DASHBOARDS.agent, { replace: true })
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D7E0E3] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-[29px] font-bold leading-[1.1] text-navy">
            Complete Agent Profile
          </h1>
          <p className="mx-auto mt-2 max-w-[340px] text-[12px] leading-[1.3] text-ink">
            Welcome, {user?.firstName} {user?.lastName}! Provide additional
            details to activate your agent account. This step is mandatory to
            list properties.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
          {serverError && (
            <p role="alert" className="rounded-[5px] border border-[#E5484D]/30 bg-[#FEF2F2] px-3 py-2 text-xs text-[#E5484D]">
              {serverError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput
              label="Agency Name"
              name="agencyName"
              value={form.agencyName}
              onChange={handleChange}
              error={errors.agencyName}
              icon={Building2}
            />
            <FormInput
              label="License Number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              error={errors.licenseNumber}
              icon={BadgeCheck}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput
              label="Experience"
              name="experience"
              type="number"
              min="0"
              placeholder="e.g. 5"
              value={form.experience}
              onChange={handleChange}
              error={errors.experience}
              icon={Briefcase}
            />
            <FormInput
              label="Office Address"
              name="officeAddress"
              placeholder="Office address"
              value={form.officeAddress}
              onChange={handleChange}
              error={errors.officeAddress}
              icon={MapPin}
            />
          </div>

          <FormTextarea
            label="Bio (optional)"
            name="bio"
            placeholder="Describe your real estate expertise and philosophy..."
            value={form.bio}
            onChange={handleChange}
            error={errors.bio}
            maxLength={500}
          />

          <ProfilePhotoUpload
            value={photo.file}
            onChange={setPhoto}
            error={photo.error || errors.photo}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 h-[36px] w-full rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Activating...' : 'Activate Agent Profile'}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="mx-auto text-[11px] text-navy transition-colors hover:text-teal"
          >
            Skip for now (Your account will be restricted until completed)
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-[12px] text-muted transition-colors hover:text-teal">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default CompleteAgentProfile