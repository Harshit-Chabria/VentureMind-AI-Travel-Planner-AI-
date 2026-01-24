
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import ArchiveView from './components/ArchiveView';
import AuthView from './components/AuthView';
import BrowserExtensionPreview from './components/BrowserExtensionPreview';
import { UserInput, TripPlan, User } from './types';
import { generateTripPlan, replanTrip } from './services/geminiService';

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [replanLoading, setReplanLoading] = useState(false);
  const [replanInput, setReplanInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' } | null>(null);
  const [view, setView] = useState<'home' | 'archive' | 'plan' | 'auth'>('home');
  const [tripHistory, setTripHistory] = useState<TripPlan[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load history & user from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('venturemind_history');
    if (savedHistory) {
      try {
        setTripHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const savedUser = localStorage.getItem('venturemind_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to load user", e);
      }
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const saveToHistory = (plan: TripPlan) => {
    const newHistory = [plan, ...tripHistory.filter(p => p.summary !== plan.summary)].slice(0, 20);
    setTripHistory(newHistory);
    localStorage.setItem('venturemind_history', JSON.stringify(newHistory));
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('venturemind_user', JSON.stringify(userData));
    setToast({ message: `Welcome, ${userData.name}. Identity authenticated.`, type: 'success' });
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('venturemind_user');
    setToast({ message: "Identity cleared. Protocol reset.", type: 'info' });
    setView('home');
  };

  const handleFormSubmit = async (input: UserInput) => {
    setLoading(true);
    try {
      const plan = await generateTripPlan(input, user);
      setCurrentPlan(plan);
      saveToHistory(plan);
      setView('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("Failed to architect your trip. Please ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplanning = async () => {
    if (!currentPlan || !replanInput.trim()) return;
    setReplanLoading(true);
    try {
      const updatedPlan = await replanTrip(currentPlan, replanInput, user);
      setCurrentPlan(updatedPlan);
      saveToHistory(updatedPlan);
      setReplanInput('');
      setToast({ message: "Trajectory re-architected successfully.", type: 'success' });
    } catch (error) {
      console.error("Failed to replan:", error);
    } finally {
      setReplanLoading(false);
    }
  };

  const handleNewPlan = () => {
    setCurrentPlan(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArchiveClick = () => {
    if (user) {
      setView('archive');
    } else {
      setToast({ message: "Authentication required to access the Archive.", type: 'info' });
      setView('auth');
    }
  };

  const openFromArchive = (plan: TripPlan) => {
    setCurrentPlan(plan);
    setView('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFeatureNotice = (feature: string) => {
    setToast({ message: `${feature} module is currently in development.`, type: 'info' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 ${isDarkMode ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white/90 border-black/5 text-slate-900'}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check text-emerald-500' : 'fa-circle-info text-indigo-500'}`}></i>
            {toast.message}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`border-b transition-all duration-500 sticky top-0 z-[100] ${isDarkMode ? 'bg-slate-950/70 border-white/5 backdrop-blur-xl' : 'bg-white/70 border-black/5 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={handleNewPlan}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all shadow-xl shadow-indigo-500/20">
              <i className="fa-solid fa-compass text-white text-xs md:text-sm"></i>
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-lg md:text-2xl font-bold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>VentureMind AI</span>
              <span className="hidden md:block text-[8px] uppercase tracking-[0.4em] text-indigo-500 font-bold">Architecture First</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-500 ${isDarkMode ? 'bg-slate-800/50 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-indigo-100'}`}
              title="Toggle Appearance"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-sm' : 'fa-moon text-sm'}`}></i>
            </button>
            <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest">
              <button 
                onClick={handleArchiveClick}
                className={`transition-colors duration-500 ${view === 'archive' ? 'text-indigo-500' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Archive
              </button>
              <button 
                onClick={() => showFeatureNotice('Browser Extension')}
                className={`transition-colors duration-500 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Extension
              </button>
              
              {user ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 group cursor-pointer" onClick={() => showFeatureNotice('Profile Settings')}>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView('auth')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-12 md:pt-24 pb-32 md:pb-40 px-4 md:px-6">
        {view === 'auth' && (
          <AuthView 
            isDarkMode={isDarkMode} 
            onAuthSuccess={handleAuthSuccess} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'home' && (
          <div className="space-y-20 md:space-y-32">
            <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-top-10 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                <i className="fa-solid fa-sparkles"></i> {user ? `The Future of Travel for ${user.name}` : 'The Future of Travel Design'}
              </div>
              <h1 className={`text-4xl md:text-8xl font-serif leading-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Plan with <span className="text-indigo-600 italic">Intent.</span> <br className="hidden md:block"/>
                Explore with <span className="text-emerald-500">Flow.</span>
              </h1>
              <p className={`text-base md:text-2xl leading-relaxed max-w-2xl mx-auto transition-colors duration-500 opacity-80 px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                An intelligent travel architect that balances human energy, logical clustering, and dynamic trade-offs.
              </p>
              <div className="flex justify-center gap-6 md:gap-12 pt-6 md:pt-10">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-2xl md:text-4xl font-serif text-indigo-500">10k+</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-50">Unique Routes</span>
                </div>
                <div className="w-[1px] h-8 md:h-12 bg-slate-500/20"></div>
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-2xl md:text-4xl font-serif text-emerald-500">98%</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-50">Energy Match</span>
                </div>
              </div>
            </div>
            
            <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-12">
              {[
                { icon: 'fa-bolt-lightning', color: 'text-amber-500', title: 'Energy Profiling', desc: 'Every day is architected around your specific pace tolerance and fatigue curves.' },
                { icon: 'fa-layer-group', color: 'text-indigo-500', title: 'Spatial Clustering', desc: 'Activities are logically grouped by distance to maximize your actual experience time.' },
                { icon: 'fa-cloud-moon', color: 'text-blue-500', title: 'Dynamic Pivot', desc: 'Mid-trip changes? Rain? Unexpected fatigue? We re-architect your trajectory in real-time.' }
              ].map((feature, idx) => (
                <div key={idx} className={`group p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border transition-all duration-700 space-y-4 md:space-y-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${isDarkMode ? 'bg-slate-900/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-black/5 hover:border-indigo-600/30'}`}>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                    <i className={`fa-solid ${feature.icon} ${feature.color} text-xl md:text-2xl`}></i>
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'archive' && user && (
          <ArchiveView 
            history={tripHistory} 
            onSelectPlan={openFromArchive} 
            onClearHistory={() => {
              if(window.confirm("Delete all archived journeys?")) {
                setTripHistory([]);
                localStorage.removeItem('venturemind_history');
              }
            }}
          />
        )}

        {view === 'plan' && currentPlan && (
          <div className="space-y-12 md:space-y-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Context Header */}
            <div className={`flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-indigo-50/50 border-indigo-100 backdrop-blur-md'}`}>
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                <button 
                  onClick={() => setView('archive')}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-500 shadow-xl flex-shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="flex flex-col">
                  <span className={`text-lg md:text-2xl font-serif transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Architectural Plan: {currentPlan.summary.split('.')[0]}
                  </span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-indigo-500">Live Simulation Active</span>
                </div>
              </div>
              <div className="flex gap-2 md:gap-4 w-full md:w-auto">
                <button 
                  onClick={() => showFeatureNotice('Export')}
                  className={`flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Export
                </button>
                <button 
                  onClick={() => showFeatureNotice('Collaboration')}
                  className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-indigo-600 rounded-xl md:rounded-2xl text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 transition-all"
                >
                  Share Access
                </button>
              </div>
            </div>

            <ItineraryDisplay plan={currentPlan} />

            {/* AI Replanning Hub */}
            <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 z-[200]">
              <div className={`rounded-2xl md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border transition-all duration-700 p-2 md:p-3 flex items-center gap-2 md:gap-4 ${isDarkMode ? 'bg-slate-900/95 border-white/10 backdrop-blur-2xl' : 'bg-white/95 border-slate-200 backdrop-blur-2xl'}`}>
                <div className="pl-3 md:pl-6 text-indigo-500 text-lg md:text-xl animate-pulse-slow">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <input 
                  type="text"
                  placeholder="It's raining today..."
                  className={`flex-1 py-3 md:py-4 outline-none bg-transparent transition-all duration-500 text-xs md:text-sm font-medium ${isDarkMode ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400'}`}
                  value={replanInput}
                  onChange={e => setReplanInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReplanning()}
                />
                <button 
                  onClick={handleReplanning}
                  disabled={replanLoading}
                  className="bg-indigo-600 text-white px-4 md:px-10 py-3 md:py-4 rounded-xl md:rounded-[1.8rem] font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-2xl shadow-indigo-500/40"
                >
                  {replanLoading ? 'Wait...' : 'Pivot'}
                </button>
              </div>
            </div>

            <BrowserExtensionPreview />
          </div>
        )}
      </main>

      <footer className={`border-t py-12 md:py-24 transition-colors duration-700 ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-compass text-white text-[10px]"></i>
              </div>
              <span className={`font-serif text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>VentureMind AI</span>
            </div>
            <p className="text-sm opacity-50 max-w-md leading-relaxed">
              VentureMind is a high-fidelity travel planning assistant that prioritizes human energy and logical trade-offs. We build journeys that respect your physical and mental bandwidth.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Legal</h4>
            <ul className="text-xs space-y-3 font-bold uppercase tracking-widest opacity-30">
              <li className="cursor-pointer" onClick={() => showFeatureNotice('Privacy Protocol')}>Privacy Protocol</li>
              <li className="cursor-pointer" onClick={() => showFeatureNotice('Terms of Travel')}>Terms of Travel</li>
              <li className="cursor-pointer" onClick={() => showFeatureNotice('AI Ethical Guide')}>AI Ethical Guide</li>
            </ul>
          </div>
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Social</h4>
            <ul className="text-xs space-y-3 font-bold uppercase tracking-widest opacity-30">
              <li className="cursor-pointer" onClick={() => showFeatureNotice('Instagram')}>Instagram</li>
              <li className="cursor-pointer" onClick={() => showFeatureNotice('Twitter / X')}>Twitter / X</li>
              <li className="cursor-pointer" onClick={() => showFeatureNotice('LinkedIn')}>LinkedIn</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
