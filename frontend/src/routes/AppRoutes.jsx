import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import RegisterAgent from '../pages/auth/RegisterAgent'
import CompleteAgentProfile from '../pages/auth/CompleteAgentProfile'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import RolePlaceholder from '../components/RolePlaceholder'
import { ROUTES } from '../utils/constants'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.login}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path={ROUTES.register} element={<Register />} />
      <Route path={ROUTES.registerAgent} element={<RegisterAgent />} />
      <Route
        path={ROUTES.completeAgentProfile}
        element={
          <PrivateRoute>
            <RoleRoute roles="agent">
              <CompleteAgentProfile />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.forgotPassword}
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.resetPassword}
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.buyer}
        element={
          <PrivateRoute>
            <RoleRoute roles="buyer">
              <RolePlaceholder />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.agent}
        element={
          <PrivateRoute>
            <RoleRoute roles="agent">
              <RolePlaceholder />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.admin}
        element={
          <PrivateRoute>
            <RoleRoute roles="admin">
              <RolePlaceholder />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  )
}

export default AppRoutes