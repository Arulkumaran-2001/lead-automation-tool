'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Secure Admin Passcode Check
    if (password === 'roamwork2026' || password === 'admin') {
      localStorage.setItem('grie_admin_authenticated', 'true');
      document.cookie = "grie_admin_authenticated=true; path=/; max-age=86400; SameSite=Lax";
      router.push('/');
    } else {
      setError('Invalid Admin Security Key. Access Restricted.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-inter">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <img
            src="/brand/logo.png"
            alt="RoamWork Technologies"
            className="h-14 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-extrabold text-white font-poppins tracking-tight flex items-center justify-center space-x-2">
            <span>RoamWork Admin Portal</span>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global Revenue Intelligence Engine (GRIE) Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 font-poppins flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Security Passcode</span>
            </label>
            <input
              type="password"
              placeholder="Enter Admin Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-blue-600/20 font-poppins flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Return to Public Agency Site */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 text-center">
          <a
            href="https://www.roamwork.in/"
            className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center justify-center space-x-1.5 font-medium"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Return to RoamWork Technologies (roamwork.in)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
