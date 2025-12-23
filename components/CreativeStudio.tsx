import React, { useState, useRef, useEffect } from 'react';
import { generateLogo, editImageWithPrompt, generateVeoVideo } from '../services/geminiService';
import { AIStudioWindow, BusinessData } from '../types';

interface Props {
  data: BusinessData;
  updateData: (data: Partial<BusinessData>) => void;
  onNext: () => void;
}

export const CreativeStudio: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'edit' | 'video'>('logo');
  
  // Logo State
  const [logoPrompt, setLogoPrompt] = useState(data.name ? `${data.name} logo, ${data.industry}` : '');
  const [logoStyle, setLogoStyle] = useState('Minimalist');
  const [generatedImage, setGeneratedImage] = useState<string | null>(data.logo || null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Edit State
  const [editPrompt, setEditPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editImage, setEditImage] = useState<string | null>(data.logo || null); // Default to existing logo if available
  const [isEditing, setIsEditing] = useState(false);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(data.video || null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Update internal state if props change (e.g. switching projects)
  useEffect(() => {
    if (data.logo) {
       setGeneratedImage(data.logo);
       if (!editImage) setEditImage(data.logo);
    }
    if (data.video) setGeneratedVideo(data.video);
  }, [data.id]);

  // --- Handlers ---

  const handleLogoGen = async () => {
    if(!logoPrompt) return;
    setIsGenerating(true);
    try {
      const img = await generateLogo(logoPrompt, logoStyle);
      setGeneratedImage(img);
      setEditImage(img); // Also set as source for editing
      updateData({ logo: img }); // Persist to project
    } catch (e) {
      alert("Logo generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
        setGeneratedImage(null); // Clear generated if uploading new
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditGen = async () => {
    if (!editImage || !editPrompt) return;
    setIsEditing(true);
    try {
      const newImg = await editImageWithPrompt(editImage, editPrompt);
      setEditImage(newImg); // Update current image to the edited one
    } catch (e) {
      alert("Editing failed. Ensure text prompt describes change.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleVeoGen = async () => {
    // API Key Check for Veo
    const win = window as unknown as AIStudioWindow;
    if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            try {
                await win.aistudio.openSelectKey();
            } catch (e) {
                alert("API Key selection failed or cancelled.");
                return;
            }
        }
    }

    const file = videoInputRef.current?.files?.[0];
    let imageToUse: File | null = file || null;

    if (!imageToUse && editImage) {
        // Convert Base64 to File
        const res = await fetch(editImage);
        const blob = await res.blob();
        imageToUse = new File([blob], "source_image.png", { type: "image/png" });
    }

    if (!imageToUse) {
        alert("Please upload an image or generate one first.");
        return;
    }

    setIsVideoLoading(true);
    try {
        const videoUrl = await generateVeoVideo(imageToUse, videoPrompt);
        setGeneratedVideo(videoUrl);
        updateData({ video: videoUrl }); // Persist to project
    } catch (e) {
        console.error(e);
        alert("Video generation failed. Ensure you have a paid project selected.");
    } finally {
        setIsVideoLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button onClick={() => setActiveTab('logo')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logo' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>New Logo</button>
        <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Edit Image</button>
        <button onClick={() => setActiveTab('video')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Animate (Veo)</button>
      </div>

      <div className="bg-slate-900/50 p-8 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm min-h-[400px]">
        {/* LOGO GENERATOR */}
        {activeTab === 'logo' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Create Asset</h3>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500" 
                placeholder="Description (e.g., A fox holding a coffee cup)"
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
              />
              <select 
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white cursor-pointer"
                value={logoStyle}
                onChange={(e) => setLogoStyle(e.target.value)}
              >
                <option>Minimalist</option>
                <option>3D Render</option>
                <option>Vintage/Retro</option>
                <option>Abstract</option>
                <option>Mascot</option>
              </select>
              <button 
                onClick={handleLogoGen} 
                disabled={isGenerating}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-900/20"
              >
                {isGenerating ? 'Generating...' : 'Create Logo'}
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-800/50 rounded-xl border border-dashed border-slate-700 min-h-[300px]">
              {generatedImage ? (
                <img src={generatedImage} alt="Generated" className="max-h-[300px] object-contain" />
              ) : (
                <span className="text-slate-500">Preview will appear here</span>
              )}
            </div>
          </div>
        )}

        {/* IMAGE EDITOR */}
        {activeTab === 'edit' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-xl font-bold text-white">Smart Editor (Nano Banana)</h3>
               <p className="text-sm text-slate-400">Upload a photo or use the generated logo, then type a command.</p>
               
               <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-800 hover:border-indigo-500 transition-colors" onClick={() => fileInputRef.current?.click()}>
                 <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                 <span className="text-indigo-400 font-medium">Click to upload source image</span>
               </div>

               <div className="relative">
                 <input 
                    type="text" 
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500" 
                    placeholder='e.g., "Add a retro filter" or "Make it night time"'
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                 />
               </div>
               
               <button 
                onClick={handleEditGen} 
                disabled={isEditing || !editImage}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-500 disabled:opacity-50 shadow-lg shadow-purple-900/20"
              >
                {isEditing ? 'Editing...' : 'Apply Edit'}
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700 min-h-[300px] overflow-hidden relative">
               {editImage ? (
                 <img src={editImage} alt="To Edit" className="max-h-[300px] object-contain" />
               ) : (
                 <span className="text-slate-500">No image selected</span>
               )}
               {isEditing && (
                 <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                    <span className="text-white px-4 py-2 animate-pulse">Processing...</span>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* VEO VIDEO */}
        {activeTab === 'video' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-xl font-bold text-white">Veo Motion Studio</h3>
               <div className="p-3 bg-indigo-900/30 text-indigo-300 text-xs rounded-lg border border-indigo-500/30">
                  Note: Requires a paid Google Cloud Project API key selection.
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-300">1. Source Image</label>
                 <input type="file" ref={videoInputRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700"/>
                 <p className="text-xs text-slate-500">Or leave empty to use image from Editor tab.</p>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-300">2. Motion Prompt</label>
                 <textarea 
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500" 
                    placeholder="e.g. Cinematic pan, sparks flying"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                 />
               </div>

               <button 
                onClick={handleVeoGen} 
                disabled={isVideoLoading}
                className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50"
              >
                {isVideoLoading ? 'Generating Video (this takes time)...' : 'Generate Video'}
              </button>
            </div>
            <div className="flex items-center justify-center bg-black rounded-xl border border-slate-800 min-h-[300px]">
               {generatedVideo ? (
                 <video src={generatedVideo} controls className="max-h-[300px] w-full" />
               ) : (
                 <div className="text-center">
                    <span className="text-slate-600 block">Video Output</span>
                    {isVideoLoading && <span className="text-xs text-slate-500 animate-pulse">Veo is dreaming...</span>}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

       {/* Navigation Footer */}
       <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
        >
          Next: UI/UX Suggestion →
        </button>
      </div>
    </div>
  );
};