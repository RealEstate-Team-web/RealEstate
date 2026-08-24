import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import AuthLayout from '../../hooks/layouts/AuthLayout'
import FormInput from '../../components/forms/FormInput'
import { ROUTES } from '../../utils/constants'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            Forgot Password
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="rounded-[5px] border border-teal/30 bg-teal/5 px-3 py-3 text-[13px] text-teal">
              If an account exists for <strong>{email}</strong>, a reset link
              has been sent.
            </p>
            <Link
              to={ROUTES.login}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal hover:underline"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              error={error}
              icon={Mail}
              autoComplete="email"
            />
            <button
              type="submit"
              className="mt-1 h-[38px] w-full rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md"
            >
              Send Reset Link
            </button>
            <p className="mt-1 text-center text-[13px] text-ink">
              Remembered it?{' '}
              <Link to={ROUTES.login} className="font-medium text-teal hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword