import React, { useState, useEffect } from 'react';
import { generateUISuggestion } from '../services/geminiService';
import { BusinessData } from '../types';

interface Props {
  data: BusinessData;
  updateData: (data: Partial<BusinessData>) => void;
  onNext: () => void;
}

export const UISuggestion: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uiPlan, setUiPlan] = useState<BusinessData['uiDesign'] | null>(data.uiDesign || null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateUISuggestion(data);
      setUiPlan(result);
      updateData({ uiDesign: result });
    } catch (e: any) {
      setError(e.message || "Failed to generate UI suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
        <h2 className="text-3xl font-bold mb-2">UI/UX Designer</h2>
        <p className="opacity-90 max-w-lg">Let AI suggest the perfect look and feel for your website.</p>
        <div className="mt-8">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-75 disabled:scale-100 border border-white/20"
          >
            {loading ? 'Designing...' : uiPlan ? '✨ Regenerate Design' : '✨ Generate Design System'}
          </button>
        </div>
        {error && (
           <div className="mt-4 bg-red-900/50 border border-red-500/50 p-3 rounded-lg text-sm text-red-200">
             {error}
           </div>
        )}
      </div>

      {uiPlan && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Color Palette */}
          <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
            <h3 className="font-bold text-lg text-white mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 gap-4">
              {uiPlan.colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-800">
                  <div 
                    className="w-10 h-10 rounded-lg shadow-sm ring-1 ring-slate-700" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{color.name}</div>
                    <div className="text-xs text-slate-500 font-mono uppercase">{color.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
            <h3 className="font-bold text-lg text-white mb-4">Typography</h3>
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Headings</span>
                <p className="text-3xl font-bold text-slate-100 mt-2">{uiPlan.fonts.heading}</p>
                <p className="text-sm text-slate-500 mt-1">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div className="border-t border-slate-800 pt-6">
                <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Body</span>
                <p className="text-xl text-slate-300 mt-2">{uiPlan.fonts.body}</p>
                <p className="text-sm text-slate-500 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
              </div>
            </div>
          </div>

          {/* Layout Preview */}
          <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
            <h3 className="font-bold text-lg text-white mb-4">Website Structure Preview</h3>
            
            <div className="border border-slate-700 rounded-xl overflow-hidden flex flex-col min-h-[400px] shadow-2xl">
              {/* Fake Navbar */}
              <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-200"></div>
                  <div className="w-24 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="flex gap-3">
                   <div className="w-16 h-3 bg-slate-200 rounded"></div>
                   <div className="w-16 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
              
              {/* Hero Section */}
              <div 
                className="p-16 text-center flex flex-col items-center justify-center gap-6 flex-1 transition-colors duration-500"
                style={{ backgroundColor: uiPlan.colors[3]?.hex || '#f8fafc' }}
              >
                <h1 
                  className="text-4xl md:text-5xl font-extrabold max-w-3xl leading-tight"
                  style={{ color: uiPlan.colors[0]?.hex || '#0f172a', fontFamily: 'serif' }} 
                >
                  {uiPlan.heroCopy}
                </h1>
                <p className="text-lg max-w-xl opacity-80" style={{color: '#475569'}}>{data.tagline}</p>
                <button 
                  className="px-8 py-3 rounded-lg font-bold text-white shadow-lg mt-4 transform hover:scale-105 transition-transform"
                  style={{ backgroundColor: uiPlan.colors[2]?.hex || '#4f46e5' }}
                >
                  Get Started
                </button>
              </div>

              {/* Layout Description */}
              <div className="p-4 bg-slate-800 text-sm text-slate-300 border-t border-slate-700">
                <strong className="text-indigo-400">AI Layout Strategy:</strong> {uiPlan.layout}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
        >
          Finish & Review Project →
        </button>
      </div>
    </div>
  );
};