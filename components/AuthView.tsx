
import React, { useState } from 'react';
import { User } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack, isDarkMode }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onAuthSuccess({
      name: name || (mode === 'login' ? email.split('@')[0] : 'Traveler'),
      email
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <button 
          onClick={onBack}
          className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Return Home
        </button>

        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-serif text-slate-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join the Collective'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' 
              ? 'Access your private travel architectures' 
              : 'Start your journey with VentureMind AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Display Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                placeholder="How shall we address you?"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Identity</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              placeholder="name@nexus.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Pass-Key</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 uppercase tracking-[0.2em] text-xs"
          >
            {mode === 'login' ? 'Authenticate' : 'Establish Protocol'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an identity yet? Register" 
              : "Already part of the collective? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
