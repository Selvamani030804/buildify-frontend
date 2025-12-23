import React from 'react';
import { Project, AppRoute } from '../types';

interface Props {
  project: Project;
  setRoute: (route: AppRoute) => void;
}

const Section = ({ title, onEdit, children }: { title: string, onEdit: () => void, children?: React.ReactNode }) => (
  <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 mb-6 relative group backdrop-blur-sm">
    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        {title}
      </h3>
      <button 
        onClick={onEdit}
        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-500/20"
      >
        Edit
      </button>
    </div>
    {children}
  </div>
);

export const ProjectOverview: React.FC<Props> = ({ project, setRoute }) => {
  const { data } = project;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">{project.name || "Untitled Project"}</h1>
          <p className="text-slate-400">Project Overview & Assets</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setRoute(AppRoute.PROJECTS)} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Back to List</button>
           <button onClick={() => setRoute(AppRoute.IDEA)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 transition-colors">Continue Editing</button>
        </div>
      </div>

      <Section title="Strategy & Market" onEdit={() => setRoute(AppRoute.IDEA)}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1 tracking-wider">Business Idea</h4>
            <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{data.idea || "Not defined"}</p>
          </div>
          <div>
             <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1 tracking-wider">Industry</h4>
             <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{data.industry || "Not defined"}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800">
           <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Strategic Analysis</h4>
           <p className="text-sm text-slate-400 line-clamp-4 leading-relaxed">{data.description || "No analysis generated yet."}</p>
        </div>
      </Section>

      <Section title="Brand Identity" onEdit={() => setRoute(AppRoute.IDENTITY)}>
         <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-indigo-900/20 p-6 rounded-xl text-center border border-indigo-500/20">
               <h4 className="text-xs font-semibold uppercase text-indigo-400 mb-3 tracking-wider">Business Name</h4>
               <div className="text-2xl font-bold text-indigo-100">{data.name || "Pending..."}</div>
            </div>
            <div className="bg-purple-900/20 p-6 rounded-xl text-center border border-purple-500/20">
               <h4 className="text-xs font-semibold uppercase text-purple-400 mb-3 tracking-wider">Tagline</h4>
               <div className="text-xl font-medium text-purple-200 italic">"{data.tagline || "Pending..."}"</div>
            </div>
         </div>
      </Section>

      <Section title="UI/UX Design" onEdit={() => setRoute(AppRoute.UI_SUGGESTION)}>
        {data.uiDesign ? (
          <div className="grid md:grid-cols-2 gap-6">
             <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3 tracking-wider">Palette</h4>
                <div className="flex gap-3">
                   {data.uiDesign.colors.map((c, i) => (
                      <div key={i} title={c.name} className="w-10 h-10 rounded-full border border-slate-600 shadow-sm" style={{background: c.hex}}></div>
                   ))}
                </div>
             </div>
             <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-3 tracking-wider">Typography</h4>
                <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <span className="font-bold text-white block mb-1">{data.uiDesign.fonts.heading}</span> 
                  <span className="text-slate-400">{data.uiDesign.fonts.body}</span>
                </div>
             </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No design system generated yet.</p>
        )}
      </Section>

      <Section title="Creative Assets" onEdit={() => setRoute(AppRoute.STUDIO)}>
         <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Logo</h4>
               <div className="aspect-square bg-slate-800/50 rounded-xl border border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                  {data.logo ? (
                    <img src={data.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="text-slate-600 text-sm">No logo generated</span>
                  )}
               </div>
            </div>
            <div className="space-y-2">
               <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Promotional Video</h4>
               <div className="aspect-video bg-black rounded-xl flex items-center justify-center overflow-hidden relative border border-slate-800">
                  {data.video ? (
                    <video src={data.video} controls className="w-full h-full" />
                  ) : (
                    <span className="text-slate-600 text-sm">No video generated</span>
                  )}
               </div>
            </div>
         </div>
      </Section>
    </div>
  );
};