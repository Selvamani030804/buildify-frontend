import React, { useState } from 'react';
import { generateBusinessPlan } from '../services/geminiService';
import { BusinessData } from '../types';

interface Props {
  data: BusinessData;
  updateData: (data: Partial<BusinessData>) => void;
  onNext: () => void;
}

export const IdeaGenerator: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ text: string; sources?: any[] } | null>(null);

  const handleGenerate = async () => {
    if (!data.idea || !data.industry) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateBusinessPlan(data.idea, data.industry);
      setResult(res);
      updateData({ description: res.text.slice(0, 200) + "..." }); // Save a summary
    } catch (e: any) {
      setError(e.message || "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-slate-900/50 p-8 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Market Strategy & Validation</h2>
        <p className="text-slate-400 mb-8">Describe your business concept. We'll use Gemini 2.5 and Google Search to validate it.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Business Idea</label>
            <textarea 
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 text-white placeholder-slate-500 transition-all"
              placeholder="e.g. A subscription service for rare coffee beans..."
              value={data.idea}
              onChange={(e) => updateData({ idea: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Industry / Niche</label>
                <input 
                type="text"
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                placeholder="e.g. Food & Beverage"
                value={data.industry}
                onChange={(e) => updateData({ industry: e.target.value })}
                />
            </div>
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !data.idea}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Researching...
                  </>
                ) : (
                  <>🚀 Validate Idea</>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-start gap-2">
             <span>⚠️</span>
             <div>
                <span className="font-bold">Error:</span> {error}
             </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-slate-900/50 p-8 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">★</span> Strategic Analysis
          </h3>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
            {result.text}
          </div>
          
          {result.sources && result.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Sources (Google Search)</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 px-3 py-2 rounded-full transition-colors"
                  >
                    🔗 {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
        >
          Next: Brand Identity →
        </button>
      </div>
    </div>
  );
};