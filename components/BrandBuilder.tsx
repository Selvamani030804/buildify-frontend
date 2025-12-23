import React, { useState } from 'react';
import { generateBrandIdentity } from '../services/geminiService';
import { BusinessData } from '../types';

interface Props {
  data: BusinessData;
  updateData: (data: Partial<BusinessData>) => void;
  onNext: () => void;
}

export const BrandBuilder: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ names: string[]; taglines: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!data.description && !data.idea) {
      alert("Please enter a business idea first in the Strategy tab.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const context = data.description || data.idea;
      const res = await generateBrandIdentity(context);
      setOptions(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error generating brand assets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
       <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl font-bold mb-2">Identity Forge</h2>
          <p className="opacity-80 max-w-lg">Let's find the perfect name and voice for your business.</p>
          <div className="mt-8">
             <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-75 disabled:scale-100 border border-white/20"
              >
                {loading ? 'Forging...' : '✨ Generate Brand Identity'}
              </button>
          </div>
          {error && (
             <div className="mt-4 bg-red-900/50 border border-red-500/50 p-3 rounded-lg text-sm text-red-200">
               {error}
             </div>
          )}
       </div>

       {options && (
         <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
               <h3 className="font-bold text-lg text-white mb-4">Suggested Names</h3>
               <div className="space-y-2">
                 {options.names.map((name, i) => (
                   <button 
                    key={i}
                    onClick={() => updateData({ name })}
                    className={`w-full text-left px-5 py-3 rounded-xl border transition-all ${
                      data.name === name 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500' 
                        : 'border-slate-700 hover:border-indigo-400 text-slate-300 hover:bg-slate-800'
                    }`}
                   >
                     {name}
                   </button>
                 ))}
               </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
               <h3 className="font-bold text-lg text-white mb-4">Suggested Taglines</h3>
               <div className="space-y-2">
                 {options.taglines.map((tag, i) => (
                   <button 
                    key={i}
                    onClick={() => updateData({ tagline: tag })}
                    className={`w-full text-left px-5 py-3 rounded-xl border transition-all ${
                      data.tagline === tag 
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-1 ring-purple-500' 
                        : 'border-slate-700 hover:border-purple-400 text-slate-300 hover:bg-slate-800'
                    }`}
                   >
                     "{tag}"
                   </button>
                 ))}
               </div>
            </div>
         </div>
       )}

       <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Finalize Brand Identity</h3>
              <p className="text-xs text-slate-500">Select a suggestion above or type your own.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Business Name</label>
                <input 
                    type="text"
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full p-4 border border-slate-700 bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold text-indigo-400 placeholder:font-normal placeholder:text-slate-600"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Tagline</label>
                <input 
                    type="text"
                    value={data.tagline}
                    onChange={(e) => updateData({ tagline: e.target.value })}
                    placeholder="e.g. Innovation for everyone"
                    className="w-full p-4 border border-slate-700 bg-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg italic text-slate-300 placeholder:font-normal placeholder:text-slate-600 placeholder:not-italic"
                />
            </div>
          </div>
       </div>

       {/* Navigation Footer */}
       <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
        >
          Next: Creative Studio →
        </button>
      </div>
    </div>
  );
};