import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { IdeaGenerator } from './components/IdeaGenerator';
import { BrandBuilder } from './components/BrandBuilder';
import { CreativeStudio } from './components/CreativeStudio';
import { VoiceConsultant } from './components/VoiceConsultant';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Subscription } from './components/Subscription';
import { ProjectOverview } from './components/ProjectOverview';
import { UISuggestion } from './components/UISuggestion';
import { Settings } from './components/Settings';
import { AppRoute, Project, BusinessData, User } from './types';
import BlurText from './components/BlurText';
import SpotlightCard from './components/SpotlightCard';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  
  // User Authentication State
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email, plan: 'Free' });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentRoute(AppRoute.HOME);
  };

  const handleUpdateUser = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, name, email });
    }
  };

  const handleUpgradePlan = (planId: string) => {
    if (user) {
      setUser({ ...user, plan: planId });
    } else {
      // If no user is logged in, create a temporary one or prompt login
      // For this demo, we'll create a temp user context if they try to upgrade
      setUser({ name: 'Guest User', email: 'guest@example.com', plan: planId });
    }
  };
  
  // State: List of projects
  const [projects, setProjects] = useState<Project[]>(() => {
    // Initial demo project
    return [{
      id: 'demo-1',
      name: 'Demo Project',
      lastModified: Date.now(),
      data: {
        idea: '',
        name: '',
        tagline: '',
        industry: '',
        targetAudience: '',
        description: ''
      }
    }];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>('demo-1');

  // Helper to get active project object
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Helper to update active project data
  const updateData = (newData: Partial<BusinessData>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        // Also update project name if business name is set and project is untitled/demo
        let updatedName = p.name;
        if (newData.name && (p.name === 'New Project' || p.name === 'Demo Project')) {
            updatedName = newData.name;
        }
        return { 
          ...p, 
          lastModified: Date.now(),
          name: updatedName,
          data: { ...p.data, ...newData } 
        };
      }
      return p;
    }));
  };

  const createNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name: 'New Project',
      lastModified: Date.now(),
      data: {
        idea: '',
        name: '',
        tagline: '',
        industry: '',
        targetAudience: '',
        description: ''
      }
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newId);
    setCurrentRoute(AppRoute.IDEA);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
       setActiveProjectId(projects[0]?.id || '');
    }
  };

  const renderContent = () => {
    // If no project exists and we try to access specific tools, force create or show dashboard
    if (!activeProject && currentRoute !== AppRoute.HOME && currentRoute !== AppRoute.PROJECTS && currentRoute !== AppRoute.SUBSCRIPTION && currentRoute !== AppRoute.SETTINGS) {
       return (
         <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-4 text-white">No Active Project</h2>
            <button onClick={createNewProject} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500">Create Project</button>
         </div>
       );
    }

    switch (currentRoute) {
      case AppRoute.HOME:
        return (
          <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pt-10 px-4">
            <div className="text-center py-12 flex flex-col items-center">
               <div className="mb-6">
                 <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-widest">
                   Next Gen Business Builder
                 </span>
               </div>
               
               <div className="mb-8 flex flex-col items-center w-full">
                 <BlurText
                    text="Build your business,"
                    delay={50}
                    stepDuration={0.2}
                    animateBy="words"
                    direction="top"
                    className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight justify-center whitespace-nowrap mb-2"
                 />
                 
                 {/* 
                     Updated H1 structure with explicit fade-in class defined in index.html to ensure visibility 
                 */}
                 <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight py-2 opacity-0 animate-fadeIn" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        beautifully.
                     </span>
                 </h1>
               </div>
               
               <BlurText 
                  text="From idea to launch in minutes. Use AI to generate your business plan, brand identity, logo, and marketing videos in one magical place."
                  delay={300} // Faster
                  stepDuration={0.1}
                  animateBy="words"
                  direction="top"
                  className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light justify-center text-center"
                  threshold={0.2}
               />

              <div className="flex justify-center gap-4 mt-8">
                 <button 
                  onClick={() => createNewProject()}
                  className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
                 >
                  Start New Project
                 </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pb-12">
               <SpotlightCard 
                  className="p-8 h-full bg-slate-900/40 border-slate-800" 
                  spotlightColor="rgba(99, 102, 241, 0.4)" // Indigo
                  onClick={() => createNewProject()}
               >
                  <div className="text-4xl mb-6 p-4 bg-indigo-500/20 w-fit rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">💡</div>
                  <h3 className="font-bold text-2xl mb-3 text-white">Validate Ideas</h3>
                  <p className="text-slate-400 leading-relaxed">Advanced market research powered by Gemini 2.5 and real-time Google Search to find your perfect niche.</p>
               </SpotlightCard>

               <SpotlightCard 
                  className="p-8 h-full bg-slate-900/40 border-slate-800" 
                  spotlightColor="rgba(168, 85, 247, 0.4)" // Purple
                  onClick={() => createNewProject()}
               >
                  <div className="text-4xl mb-6 p-4 bg-purple-500/20 w-fit rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">🎨</div>
                  <h3 className="font-bold text-2xl mb-3 text-white">Create Assets</h3>
                  <p className="text-slate-400 leading-relaxed">Generate professional logos, edit product images, and create cinematic Veo videos instantly.</p>
               </SpotlightCard>

               <SpotlightCard 
                  className="p-8 h-full bg-slate-900/40 border-slate-800" 
                  spotlightColor="rgba(59, 130, 246, 0.4)" // Blue
                  onClick={() => createNewProject()}
               >
                  <div className="text-4xl mb-6 p-4 bg-blue-500/20 w-fit rounded-2xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">💎</div>
                  <h3 className="font-bold text-2xl mb-3 text-white">UI Design</h3>
                  <p className="text-slate-400 leading-relaxed">Get AI-suggested modern color palettes, typography, and website layouts tailored to your brand.</p>
               </SpotlightCard>
            </div>
          </div>
        );
      case AppRoute.PROJECTS:
        return (
          <ProjectsDashboard 
            projects={projects} 
            activeProjectId={activeProjectId} 
            setActiveProjectId={setActiveProjectId}
            createNewProject={createNewProject}
            deleteProject={deleteProject}
            setRoute={setCurrentRoute}
          />
        );
      case AppRoute.OVERVIEW:
        return <ProjectOverview project={activeProject} setRoute={setCurrentRoute} />;
      case AppRoute.IDEA:
        return <IdeaGenerator data={activeProject.data} updateData={updateData} onNext={() => setCurrentRoute(AppRoute.IDENTITY)} />;
      case AppRoute.IDENTITY:
        return <BrandBuilder data={activeProject.data} updateData={updateData} onNext={() => setCurrentRoute(AppRoute.STUDIO)} />;
      case AppRoute.STUDIO:
        return <CreativeStudio data={activeProject.data} updateData={updateData} onNext={() => setCurrentRoute(AppRoute.UI_SUGGESTION)} />;
      case AppRoute.UI_SUGGESTION:
        return <UISuggestion data={activeProject.data} updateData={updateData} onNext={() => setCurrentRoute(AppRoute.OVERVIEW)} />;
      case AppRoute.CHAT:
        return <ChatAssistant project={activeProject} />;
      case AppRoute.CONSULTANT:
        return <VoiceConsultant />;
      case AppRoute.SUBSCRIPTION:
        return <Subscription currentPlan={user?.plan || 'Free'} onUpgrade={handleUpgradePlan} />;
      case AppRoute.SETTINGS:
        return (
          <Settings 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <HashRouter>
      <Layout 
        currentRoute={currentRoute} 
        setRoute={setCurrentRoute}
        user={user}
        onLogin={handleLogin}
      >
        {renderContent()}
      </Layout>
    </HashRouter>
  );
};

export default App;