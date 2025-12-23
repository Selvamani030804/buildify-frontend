import React from 'react';
import { Project, AppRoute } from '../types';

interface Props {
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  createNewProject: () => void;
  deleteProject: (id: string) => void;
  setRoute: (route: AppRoute) => void;
}

export const ProjectsDashboard: React.FC<Props> = ({ 
  projects, 
  activeProjectId, 
  setActiveProjectId, 
  createNewProject, 
  deleteProject,
  setRoute 
}) => {
  const handleSelect = (id: string) => {
    setActiveProjectId(id);
    setRoute(AppRoute.OVERVIEW);
  };

  const calculateProgress = (project: Project) => {
     let score = 0;
     const total = 7;
     if (project.data.idea) score++;
     if (project.data.industry) score++;
     if (project.data.name) score++;
     if (project.data.tagline) score++;
     if (project.data.description) score++;
     if (project.data.logo) score++;
     if (project.data.video) score++;
     return Math.round((score / total) * 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-white">My Projects</h2>
           <p className="text-slate-400">Manage your business ideas.</p>
        </div>
        <button 
          onClick={createNewProject}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-900/40 transition-colors flex items-center gap-2"
        >
          <span>+</span> New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const progress = calculateProgress(project);
          
          return (
            <div 
              key={project.id}
              onClick={() => handleSelect(project.id)}
              className={`group bg-slate-900/50 rounded-2xl border p-6 transition-all shadow-lg hover:shadow-xl relative cursor-pointer backdrop-blur-sm ${
                activeProjectId === project.id 
                  ? 'border-indigo-500 ring-1 ring-indigo-500/50' 
                  : 'border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl border border-slate-700">
                   🚀
                 </div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                  title="Delete Project"
                 >
                   ✕
                 </button>
              </div>
              
              <h3 className="font-bold text-xl text-white mb-2 truncate group-hover:text-indigo-300 transition-colors">
                {project.name || "Untitled Project"}
              </h3>
              <p className="text-sm text-slate-400 mb-6 h-10 overflow-hidden text-ellipsis line-clamp-2">
                {project.data.description || project.data.idea || "No description yet."}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Progress</span>
                  <span className="text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                   <div 
                     className="bg-indigo-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                 <span className="text-xs text-slate-500 font-mono">
                   {new Date(project.lastModified).toLocaleDateString()}
                 </span>
                 <button 
                   className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                 >
                   Open <span className="text-lg">→</span>
                 </button>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
             <p className="mb-2 text-lg">No projects yet.</p>
             <button onClick={createNewProject} className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline">Create your first one</button>
          </div>
        )}
      </div>
    </div>
  );
};