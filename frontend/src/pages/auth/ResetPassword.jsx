import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import PasswordInput from '../../components/forms/PasswordInput'
import { ROUTES } from '../../utils/constants'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((err) => ({ ...err, [e.target.name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.password || form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setDone(true)
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            Reset Password
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            Choose a new password for your account.
          </p>
        </div>

        {done ? (
          <div className="text-center">
            <CheckCircle2 size={40} className="mx-auto text-teal" strokeWidth={1.5} />
            <p className="mt-3 text-[14px] text-ink">
              Your password has been reset. You can now log in.
            </p>
            <Link
              to={ROUTES.login}
              className="mt-4 inline-flex h-[38px] items-center justify-center rounded-[5px] bg-teal px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#0F828A]"
            >
              Back to Login
            </Link>
          </div>
        ) : !token ? (
          <p className="rounded-[5px] border border-[#E5484D]/30 bg-[#FEF2F2] px-3 py-2 text-xs text-[#E5484D]">
            Missing or invalid reset token.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <PasswordInput
              label="New Password"
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
            <button
              type="submit"
              className="mt-1 h-[38px] w-full rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPassword