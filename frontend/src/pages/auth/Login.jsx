import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('abebe.k@nesthome.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('buyer');

  const from = location.state?.from?.pathname || '/buyer';

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      id: 'b1',
      firstName: 'Abebe',
      lastName: 'Kebede',
      name: 'Abebe Kebede',
      email: email,
      phone: '+251 911 123 456',
      role: role,
      title: role === 'buyer' ? 'Real Estate Buyer' : 'Real Estate Agent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      unreadNotifications: 7,
      unreadMessages: 3,
    });
    navigate(from, { replace: true });
  };

  const handleQuickLogin = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === 'buyer') {
      navigate('/buyer', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 text-blue-500 rounded-xl mb-3">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NestHome Real Estate</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                placeholder="abebe.k@nesthome.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Role Selection</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-500 transition capitalize"
            >
              <option value="buyer">Buyer / Tenant</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            <span>Sign In to Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <p className="text-xs text-slate-400 text-center mb-3 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-blue-400" /> Quick Dev Auth Switcher:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('buyer')}
              className="py-2 px-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded border border-blue-500/30 font-medium transition cursor-pointer"
            >
              Buyer Role
            </button>
            <button
              onClick={() => handleQuickLogin('agent')}
              className="py-2 px-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded border border-amber-500/30 font-medium transition cursor-pointer"
            >
              Agent Role
            </button>
            <button
              onClick={() => handleQuickLogin('guest')}
              className="py-2 px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded border border-rose-500/30 font-medium transition cursor-pointer"
            >
              Logged Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
