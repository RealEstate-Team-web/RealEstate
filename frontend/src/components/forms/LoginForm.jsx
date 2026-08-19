import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import FormInput from './FormInput'
import PasswordInput from './PasswordInput'
import { ROLE_DASHBOARDS, ROUTES } from '../../utils/constants'

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
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
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      next.password = 'Password is required.'
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
      const { user } = await login({
        email: form.email,
        password: form.password,
      })
      if (remember) {
        localStorage.setItem('remember_email', form.email)
      } else {
        localStorage.removeItem('remember_email')
      }
      navigate(ROLE_DASHBOARDS[user.role] || '/', { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverError && (
        <p role="alert" className="rounded-[5px] border border-[#E5484D]/30 bg-[#FEF2F2] px-3 py-2 text-xs text-[#E5484D]">
          {serverError}
        </p>
      )}

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        icon={Mail}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px]">
        <label className="flex cursor-pointer items-center gap-2 text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#159FA7]"
          />
          Remember me
        </label>
        <Link to={ROUTES.forgotPassword} className="text-teal hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-[38px] w-full rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>

      <p className="mt-1 text-center text-[13px] text-ink">
        Don't have an account?{' '}
        <Link to={ROUTES.register} className="font-medium text-teal hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}

export default LoginForm