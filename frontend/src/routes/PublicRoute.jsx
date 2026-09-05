import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import { ROLE_DASHBOARDS } from '../utils/constants'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

// Scroll every public page to the top on navigation so a new page
// (e.g. About/Agents or a property's details) always starts at its top
// instead of keeping the previous page's scroll position.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const PublicRoute = ({ children, allowAuthenticated = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  const page = (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
      <ScrollToTop />
      <Header className="" />
      <main className="flex-1 w-full pt-[70px]">{children}</main>
      <Footer />
    </div>
  );

  // Public home renders immediately for every user — no loader flash
  if (allowAuthenticated) return page;

  // Public pages render immediately; redirect to the role dashboard
  // only once the auth check completes. No full-screen loader here so
  // reloading a public page never flashes a blank/blue overlay.
  if (isAuthenticated && !loading && user) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />;
  }

  return page;
}

export default PublicRoute