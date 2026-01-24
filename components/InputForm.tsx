
import React, { useState } from 'react';
import { UserInput, TravelStyle, GroupType, TravelMode, RoadVehicleType } from '../types';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

const DATA = {
  countries: [
    "India", "USA", "Japan", "France", "UK", "UAE", "Singapore", "Thailand", "Germany", "Italy", 
    "Australia", "Canada", "Brazil", "Mexico", "South Korea", "Spain", "Switzerland", "Netherlands", 
    "New Zealand", "Greece", "Turkey", "Vietnam", "Indonesia", "South Africa", "Portugal", "Norway"
  ],
  states: {
    "India": ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"],
    "USA": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    "Japan": ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"],
    "France": ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"],
    "UK": ["England", "Scotland", "Wales", "Northern Ireland"]
  }
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInput>({
    originCountry: '', originState: '', originCity: '',
    destinationCountry: '', destinationState: '', destinationCity: '',
    startDate: '', endDate: '', budget: 50000,
    style: TravelStyle.BALANCED, interests: [], groupType: GroupType.COUPLE,
    travelMode: TravelMode.FLIGHT, roadVehicleType: RoadVehicleType.PERSONAL_CAR,
    constraints: '', mustVisitPlaces: '', specialGoals: '', naturalLanguagePrompt: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderLocationGroup = (type: 'origin' | 'destination', title: string) => {
    const cKey = type === 'origin' ? 'originCountry' : 'destinationCountry';
    const sKey = type === 'origin' ? 'originState' : 'destinationState';
    const cityKey = type === 'origin' ? 'originCity' : 'destinationCity';

    return (
      <div className="bg-slate-900/95 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-8 border border-slate-800 shadow-2xl space-y-4 md:space-y-5">
        <h3 className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3">
          <span className="w-6 md:w-8 h-[1px] bg-indigo-500/30"></span>
          {title}
        </h3>
        
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1 md:mb-2 ml-1">Country</label>
            <input 
              list="countries-list"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 focus:bg-slate-800"
              placeholder="Select Country"
              value={formData[cKey]}
              onChange={e => setFormData({...formData, [cKey]: e.target.value, [sKey]: '', [cityKey]: ''})}
            />
          </div>

          {formData[cKey] && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1 md:mb-2 ml-1">State / Region</label>
              <input 
                list={`states-${type}`}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-slate-800"
                placeholder="Select State"
                value={formData[sKey]}
                onChange={e => setFormData({...formData, [sKey]: e.target.value, [cityKey]: ''})}
              />
              <datalist id={`states-${type}`}>
                {(DATA.states[formData[cKey] as keyof typeof DATA.states] || []).map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
          )}

          {formData[sKey] && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1 md:mb-2 ml-1">City</label>
              <input 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-slate-800"
                placeholder="City Name"
                value={formData[cityKey]}
                onChange={e => setFormData({...formData, [cityKey]: e.target.value})}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <datalist id="countries-list">
        {DATA.countries.map(c => <option key={c} value={c} />)}
      </datalist>

      <div className="glass rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 transition-all duration-500">
        {/* Step Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 bg-white/50 dark:bg-slate-900/50 border-b border-black/5 dark:border-white/5">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-serif text-slate-900 dark:text-white">
              {step === 1 && "Journey Details"}
              {step === 2 && "The Persona"}
              {step === 3 && "Context & Constraints"}
            </h2>
            <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Step {step} of 3 • Custom Architecture</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ease-out ${step >= i ? 'w-8 md:w-12 bg-indigo-600' : 'w-3 md:w-4 bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-8 md:space-y-10 animate-in fade-in zoom-in-95 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {renderLocationGroup('origin', 'From')}
                {renderLocationGroup('destination', 'To')}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-widest flex-shrink-0">Preferred Transit</h3>
                  <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  {[
                    { id: TravelMode.FLIGHT, icon: 'fa-plane', label: 'Air' },
                    { id: TravelMode.TRAIN, icon: 'fa-train', label: 'Rail' },
                    { id: TravelMode.ROAD, icon: 'fa-car', label: 'Road' },
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setFormData({...formData, travelMode: mode.id})}
                      className={`group p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-2 md:gap-4 ${formData.travelMode === mode.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105' : 'bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200'}`}
                    >
                      <i className={`fa-solid ${mode.icon} text-xl md:text-3xl transition-transform duration-500`}></i>
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Departure Date</label>
                  <input type="date" className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Return Date</label>
                  <input type="date" className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl px-5 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white text-sm" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <button 
                onClick={nextStep} 
                disabled={!formData.originCity || !formData.destinationCity}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-bold hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-2xl disabled:opacity-30 uppercase tracking-[0.2em] text-[10px] md:text-xs"
              >
                Configure Persona
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 md:space-y-10 animate-in slide-in-from-right-10 duration-700">
              <div className="space-y-6">
                <label className="block text-[10px] md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest text-center">Travel Archetype</label>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {['Culture', 'Food', 'Nightlife', 'Nature', 'Shopping', 'Adventure', 'History', 'Beach', 'Luxury', 'Art'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFormData(p => ({...p, interests: p.interests.includes(opt) ? p.interests.filter(i => i !== opt) : [...p.interests, opt]}))}
                      className={`px-4 md:px-8 py-2 md:py-3 rounded-full border-2 font-bold text-[9px] md:text-xs tracking-widest transition-all duration-500 ${formData.interests.includes(opt) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400'}`}
                    >
                      {opt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-3">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Budget Allocation (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-10 md:pl-12 pr-4 md:pr-6 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 transition-all outline-none font-mono dark:text-white text-base md:text-lg"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2">Energy Flux</label>
                  <select 
                    className="w-full px-5 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 dark:text-white text-sm md:text-base appearance-none cursor-pointer"
                    value={formData.style}
                    onChange={e => setFormData({...formData, style: e.target.value as TravelStyle})}
                  >
                    <option value={TravelStyle.RELAXED}>Relaxed - Slow Travel</option>
                    <option value={TravelStyle.BALANCED}>Balanced - Explorer</option>
                    <option value={TravelStyle.PACKED}>Packed - Velocity</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 pt-6">
                <button onClick={prevStep} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] md:text-xs">Back</button>
                <button onClick={nextStep} className="flex-[2] bg-slate-900 dark:bg-indigo-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-bold hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px] md:text-xs">Final Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 md:space-y-10 animate-in slide-in-from-right-10 duration-700">
              <div className="space-y-6">
                <label className="block text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Group Dynamic</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {Object.values(GroupType).map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, groupType: type})}
                      className={`py-3 md:py-5 rounded-xl md:rounded-3xl border-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${formData.groupType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl' : 'bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2 flex items-center gap-2">
                    <i className="fa-solid fa-map-pin text-indigo-500"></i> Landmarks
                  </label>
                  <textarea 
                    className="w-full px-5 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-24 md:h-32 resize-none"
                    placeholder="Specific spots..."
                    value={formData.mustVisitPlaces}
                    onChange={e => setFormData({...formData, mustVisitPlaces: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 md:ml-2 flex items-center gap-2">
                    <i className="fa-solid fa-person-running text-amber-500"></i> Restrictions
                  </label>
                  <textarea 
                    className="w-full px-5 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-24 md:h-32 resize-none"
                    placeholder="Health, diet, mobility..."
                    value={formData.constraints}
                    onChange={e => setFormData({...formData, constraints: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 pt-6">
                <button onClick={prevStep} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] md:text-xs">Back</button>
                <button 
                  onClick={() => onSubmit(formData)} 
                  disabled={isLoading}
                  className="flex-[2] bg-indigo-600 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-bold hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] md:text-xs"
                >
                  {isLoading ? 'Architecting...' : 'Build Journey'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;
