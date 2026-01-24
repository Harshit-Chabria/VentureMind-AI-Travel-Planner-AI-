
import React from 'react';
import { TripPlan } from '../types';

interface ArchiveViewProps {
  history: TripPlan[];
  onSelectPlan: (plan: TripPlan) => void;
  onClearHistory: () => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ history, onSelectPlan, onClearHistory }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* User Stats Card - Now full width or centered since global count is gone */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 flex flex-col justify-between group overflow-hidden relative shadow-xl">
         <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
           <i className="fa-solid fa-journal-whills text-[12rem]"></i>
         </div>
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <h3 className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your Personal Travel Ledger</h3>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="text-7xl md:text-8xl font-serif text-slate-900 dark:text-white transition-all duration-500 tabular-nums">
                {history.length}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Architectures</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest opacity-60">Currently Stored</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Every plan generated is locally cached in your browser. This vault maintains your past itineraries, allowing for seamless retrieval and re-simulation.
            </p>
         </div>
      </div>

      {/* History Grid */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8 gap-4">
           <div>
             <h2 className="text-4xl font-serif text-slate-900 dark:text-white">Previous Architectures</h2>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest font-bold opacity-60">High-fidelity trajectory records</p>
           </div>
           {history.length > 0 && (
             <button 
               onClick={onClearHistory}
               className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors self-start md:self-center bg-slate-100 dark:bg-slate-900/50 px-6 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
             >
               Purge Vault
             </button>
           )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-32 glass rounded-[3rem] border-dashed border-2 border-slate-300 dark:border-slate-800">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300 dark:text-slate-700">
              <i className="fa-solid fa-folder-open text-4xl"></i>
            </div>
            <h3 className="text-2xl font-serif text-slate-400 dark:text-slate-500">The vault is empty.</h3>
            <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs mx-auto mt-4 leading-relaxed font-medium">Generate your first architectural trip plan to begin your personal travel collection.</p>
            <button className="mt-8 text-indigo-500 font-bold uppercase tracking-widest text-[10px] hover:underline" onClick={() => window.location.reload()}>Return to Architect Home</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {history.map((plan, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectPlan(plan)}
                className="group glass p-8 rounded-[2.5rem] border border-white/10 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500 shadow-sm group-hover:shadow-indigo-500/40">
                      <i className="fa-solid fa-map-location-dot text-slate-400 dark:text-slate-500 group-hover:text-white text-xl"></i>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/10">
                      {plan.detectedStyle}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">{plan.summary.split('.')[0]}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed font-medium opacity-80">
                      {plan.summary}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Est. Capital</span>
                      <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
                        ₹{(Object.values(plan.budget) as number[]).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Timeline</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{plan.itinerary.length} Days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveView;
