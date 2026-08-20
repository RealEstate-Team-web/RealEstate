import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import FormInput from './FormInput'
import PasswordInput from './PasswordInput'
import RoleSelector from './RoleSelector'
import { ROUTES, ROLE_DASHBOARDS } from '../../utils/constants'

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'buyer',
}

const PHONE_PATTERN = /^\+?[0-9]{7,15}$/

const RegisterForm = ({ initialRole = 'buyer' }) => {
  const navigate = useNavigate()
  const { register, isAuthenticated, user } = useAuth()

  const [form, setForm] = useState({ ...initialState, role: initialRole })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROLE_DASHBOARDS[user.role] || ROUTES.login, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!redirectTo) return
    if (redirectTo === ROUTES.completeAgentProfile && !isAuthenticated) return
    navigate(redirectTo, { replace: true })
  }, [redirectTo, isAuthenticated, navigate])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((err) => ({ ...err, [e.target.name]: '' }))
    }
  }

  const validate = () => {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required.'
    if (!form.lastName.trim()) next.lastName = 'Last name is required.'
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.phone.trim()) {
      next.phone = 'Phone is required.'
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number.'
    }
    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    } else if (!/[A-Z]/.test(form.password)) {
      next.password = 'Password must contain at least one uppercase letter.'
    } else if (!/[a-z]/.test(form.password)) {
      next.password = 'Password must contain at least one lowercase letter.'
    } else if (!/[0-9]/.test(form.password)) {
      next.password = 'Password must contain at least one number.'
    }
    if (!form.confirmPassword) {
      next.confirmPassword = 'Confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
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
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      })

      setRedirectTo(
        form.role === 'agent' ? ROUTES.completeAgentProfile : ROUTES.login,
      )
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      {serverError && (
        <p role="alert" className="rounded-[5px] border border-[#E5484D]/30 bg-[#FEF2F2] px-3 py-2 text-xs text-[#E5484D]">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
          icon={User}
          autoComplete="given-name"
        />
        <FormInput
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={errors.lastName}
          icon={User}
          autoComplete="family-name"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
        />
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={Phone}
          autoComplete="tel"
        />
      </div>

      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <RoleSelector
        value={form.role}
        onChange={(role) => setForm((f) => ({ ...f, role }))}
        error={errors.role}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-[36px] w-full rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>

      <p className="mt-1 text-center text-[13px] text-ink">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-teal hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm