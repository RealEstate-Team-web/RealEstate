import { Navigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import { ROLE_DASHBOARDS } from '../utils/constants'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import Loader from '../components/common/Loader'
const PublicRoute = ({ children, allowAuthenticated = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  const page = (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
      <Header className="" />
      <main className="flex-1 w-full pt-[70px]">{children}</main>
      <Footer />
    </div>
  );

  // Public home renders immediately for every user — no loader flash
  if (allowAuthenticated) return page;

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />;
  }

  return page;
}

export default PublicRoute