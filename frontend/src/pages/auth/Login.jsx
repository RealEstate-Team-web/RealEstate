import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/forms/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (role) => {
    if (switchRole) {
      switchRole(role);
      if (role === 'buyer') {
        navigate('/buyer', { replace: true });
      }
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[420px] rounded-[6px] border border-[#D9E0E2] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] text-navy">
            Welcome Back
          </h1>
          <p className="mt-2 text-[14px] text-ink">
            Sign in to access your NestHome account.
          </p>
        </div>
        
        <LoginForm />

        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center mb-2.5 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-blue-600" /> Quick Dev Auth Switcher:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('buyer')}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 font-semibold transition cursor-pointer"
            >
              Buyer Role
            </button>
            <button
              onClick={() => handleQuickLogin('agent')}
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded border border-amber-200 font-semibold transition cursor-pointer"
            >
              Agent Role
            </button>
            <button
              onClick={() => handleQuickLogin('guest')}
              className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 font-semibold transition cursor-pointer"
            >
              Logged Out
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
