import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

const RolePlaceholder = () => {
  const { user, logout } = useAuth()
  const agentIncomplete =
    user?.role === 'agent' && user?.agentProfileStatus === 'incomplete'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <h1 className="font-display text-[26px] font-bold text-navy">
        Welcome{user ? `, ${user.firstName}` : ''}
      </h1>
      <p className="text-sm text-muted">
        Your {user?.role} dashboard is being built. This placeholder will be
        replaced by your dashboard soon.
      </p>

      {agentIncomplete && (
        <div className="max-w-md rounded-[6px] border border-[#D8B878] bg-[#F7EFDD] px-4 py-3 text-[12px] text-[#8A6A2F]">
          Your agent profile is incomplete. Complete it to activate your
          account and list properties.{' '}
          <Link
            to={ROUTES.completeAgentProfile}
            className="font-semibold text-teal hover:underline"
          >
            Complete Agent Profile
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={logout}
        className="mt-2 h-[34px] rounded-[5px] border border-teal px-5 text-[13px] font-medium text-teal transition-colors hover:bg-teal hover:text-white"
      >
        Logout
      </button>
    </div>
  )
}

export default RolePlaceholder