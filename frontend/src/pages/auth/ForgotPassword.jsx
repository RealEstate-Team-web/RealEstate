import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../../hooks/layouts/AuthLayout'
import FormInput from '../../components/forms/FormInput'
import { ROUTES } from '../../utils/constants'
import authService from '../../services/auth.service'

const ForgotPassword = () => {
  const { t } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError(t('forgot_email_required'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('forgot_email_invalid'))
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message || t('forgot_generic_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            {t('forgot_title')}
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            {t('forgot_subtitle')}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="rounded-[5px] border border-teal/30 bg-teal/5 px-3 py-3 text-[13px] text-teal">
              {t('forgot_sent', { email })}
            </p>
            <Link
              to={ROUTES.login}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-teal hover:underline"
            >
              <ArrowLeft size={14} /> {t('forgot_back_to_login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              label={t('email_label')}
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
              disabled={loading}
              className="mt-1 inline-flex h-[38px] w-full items-center justify-center gap-1.5 rounded-[5px] bg-teal text-[15px] font-semibold text-white transition-all duration-150 hover:bg-[#0F828A] hover:shadow-md disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {t('forgot_send_link')}
            </button>
            <p className="mt-1 text-center text-[13px] text-ink">
              {t('forgot_remembered')}{' '}
              <Link to={ROUTES.login} className="font-medium text-teal hover:underline">
                {t('login_link')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword