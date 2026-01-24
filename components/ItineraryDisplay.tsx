
import React from 'react';
import { TripPlan, ItineraryDay } from '../types';

interface ItineraryDisplayProps {
  plan: TripPlan;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan }) => {
  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-40">
      {/* Editorial Header */}
      <div className="glass rounded-3xl md:rounded-[3.5rem] p-6 md:p-16 mb-8 md:mb-16 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-700">
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] rotate-12 pointer-events-none hidden md:block">
          <i className="fa-solid fa-map text-[15rem] md:text-[20rem]"></i>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 relative z-10">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 md:w-12 h-[1px] bg-indigo-500"></span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-indigo-500">Architecture Insight</span>
            </div>
            <h1 className="text-3xl md:text-7xl font-serif text-slate-900 dark:text-white leading-tight md:leading-[1.1]">The Curator's <br className="hidden md:block"/>Masterplan</h1>
            <p className="text-sm md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium opacity-80">{plan.summary}</p>
            <div className="flex flex-wrap gap-3 md:gap-6">
              <div className="bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-3xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 md:gap-3 shadow-xl">
                <i className="fa-solid fa-bolt-lightning"></i>
                {plan.detectedStyle}
              </div>
              <div className="bg-emerald-500 text-white px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-3xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 md:gap-3 shadow-xl">
                <i className="fa-solid fa-chart-line"></i>
                Optimized
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-80 bg-slate-900/5 dark:bg-slate-50/5 backdrop-blur-sm p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-4 md:space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-[10px] uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-microchip text-indigo-500"></i> Logic Model
            </h3>
            <ul className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 space-y-3">
              {plan.keyAssumptions.map((ass, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                  <span className="leading-relaxed opacity-80">{ass}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Timeline Itinerary */}
        <div className="lg:col-span-8 space-y-12 md:space-y-20">
          {plan.itinerary.map((day: ItineraryDay, dayIdx) => (
            <div 
              key={day.dayNumber} 
              className="relative pl-12 md:pl-24 animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${dayIdx * 150}ms` }}
            >
              {/* Responsive Timeline Track */}
              <div className="absolute left-[1.125rem] md:left-[2.125rem] top-0 bottom-[-3rem] md:bottom-[-5rem] w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="absolute left-0 top-0 w-9 h-9 md:w-16 md:h-16 bg-slate-950 dark:bg-white rounded-xl md:rounded-[2rem] flex items-center justify-center text-white dark:text-slate-950 text-sm md:text-xl font-bold shadow-2xl z-20">
                {day.dayNumber}
              </div>

              <div className="space-y-8 md:space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                  <div className="space-y-1">
                    <span className="text-[8px] md:text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Day Trajectory</span>
                    <h3 className="text-xl md:text-5xl font-serif text-slate-900 dark:text-white leading-tight">{day.theme}</h3>
                  </div>
                  <div className={`self-start md:self-auto px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest border ${
                    day.energyLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 
                    day.energyLevel === 'Medium' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    {day.energyLevel} Intensity
                  </div>
                </div>

                <div className="grid gap-4 md:gap-8">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="group flex gap-4 md:gap-8 relative">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white/50 dark:bg-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.08] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-black/[0.03] dark:border-white/[0.03] transition-all duration-500 shadow-sm hover:shadow-xl flex-1">
                        <div className="md:w-32 flex-shrink-0">
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{act.time}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <h4 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">{act.title}</h4>
                            <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                              <i className="fa-solid fa-location-dot"></i>
                              {act.location}
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium opacity-80">{act.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insight Panel */}
                <div className="bg-slate-900 dark:bg-slate-900/40 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute bottom-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                    <i className="fa-solid fa-brain text-6xl md:text-8xl"></i>
                  </div>
                  <div className="relative z-10 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest">The "Why"</span>
                      <div className="flex-1 h-[1px] bg-white/10"></div>
                    </div>
                    <p className="text-xs md:text-base text-slate-300 italic font-serif leading-relaxed">"{day.reasoning}"</p>
                    <div className="pt-2 flex items-center gap-3 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <i className="fa-solid fa-route text-indigo-400"></i> 
                      Logic: {day.travelLogic}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Sidebar Metrics */}
        <div className="lg:col-span-4 space-y-8 md:space-y-12">
          <div className="sticky top-24 md:top-32 space-y-8 md:space-y-12 h-fit">
            {/* Financial Card */}
            <div className="glass rounded-2xl md:rounded-[3rem] p-6 md:p-10 border border-white/10 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-serif text-slate-900 dark:text-white mb-6 md:mb-8 flex items-center gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-vault text-emerald-500 text-xs md:text-sm"></i>
                </div>
                Budget Model
              </h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { label: 'Stay', val: plan.budget.stay, icon: 'fa-house-chimney' },
                  { label: 'Transit', val: plan.budget.transport, icon: 'fa-compass' },
                  { label: 'Food', val: plan.budget.food, icon: 'fa-utensils' },
                  { label: 'Entry', val: plan.budget.activities, icon: 'fa-mask' },
                  { label: 'Buffer', val: plan.budget.buffer, icon: 'fa-shield-halved' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <i className={`fa-solid ${item.icon} w-3 md:w-4 text-indigo-500/50`}></i>
                      {item.label}
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs md:text-sm">₹{item.val.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-6 md:pt-8 border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-1 md:gap-2">
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Estimated Capital</span>
                  <span className="text-2xl md:text-4xl font-serif text-indigo-600 dark:text-indigo-400">
                    ₹{(Object.values(plan.budget) as number[]).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Tips */}
            <div className="bg-indigo-600 rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-xl text-white relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 flex items-center gap-4">Insights</h3>
              <ul className="space-y-4 md:space-y-6 text-xs md:text-sm text-indigo-100/80 leading-relaxed font-medium">
                {plan.smartTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 md:gap-4">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-[7px] md:text-[8px]"></i>
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pivots */}
            <div className="glass rounded-2xl md:rounded-[3rem] p-6 md:p-10 border border-white/10 space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-2xl font-serif text-slate-900 dark:text-white flex items-center gap-4">
                <i className="fa-solid fa-shuffle text-purple-500 text-sm"></i> Adaptations
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1 md:space-y-2">
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Stasis Mode</span>
                  <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 font-medium italic">"{plan.alternatives.lazyDay}"</p>
                </div>
                <div className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1 md:space-y-2">
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rain Pivot</span>
                  <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 font-medium italic">"{plan.alternatives.rainyDay}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
