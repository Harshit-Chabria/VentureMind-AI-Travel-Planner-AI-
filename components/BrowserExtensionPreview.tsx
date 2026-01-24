
import React from 'react';

const BrowserExtensionPreview: React.FC = () => {
  return (
    <div className="bg-slate-900 p-8 rounded-3xl text-white mt-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <i className="fa-solid fa-puzzle-piece text-9xl"></i>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-compass text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-serif">Browser Extension Mode</h2>
            <p className="text-indigo-300 text-sm">Real-time intelligence on booking sites</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span className="font-bold text-sm uppercase">Smart Conflict Warning</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              "You're looking at a hotel in Shinjuku, but your planned activities are mostly in Asakusa. This would add 90 mins of daily transit time."
            </p>
            <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300">
              Show me better locations →
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <i className="fa-solid fa-sparkles"></i>
              <span className="font-bold text-sm uppercase">Itinerary Sync</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              "This museum is currently 20% off for these dates. Would you like to swap your afternoon park visit on Day 3?"
            </p>
            <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300">
              Apply Dynamic Update →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserExtensionPreview;
