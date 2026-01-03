import { BusinessData } from "../types";

// 1. Get the Backend URL automatically from your environment file
const API_URL = import.meta.env.VITE_API_URL || "https://buildify-backend.onrender.com";

// --- Helper Function: Call Your Backend ---
async function callBackend(endpoint: string, data: any) {
  const fullUrl = `${API_URL}/api${endpoint}`;
  
  try {
    console.log(`📡 Connecting to Backend: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ API Error:", error);
    throw error;
  }
}

// --- 1. Business Plan (Uses '/chat' route) ---
export const generateBusinessPlan = async (idea: string, industry: string): Promise<{ text: string; sources?: any[] }> => {
  const data = await callBackend('/ai/chat', {
    message: `Write a concise executive summary (max 200 words) and list 3 key competitors for a startup idea: "${idea}" in the "${industry}" industry.`,
    context: "Senior Business Consultant"
  });
  
  return { 
    text: data.reply || "No response generated.", 
    sources: [] // Backend simple chat doesn't return sources yet, which is fine
  };
};

// --- 2. Brand Identity (Uses '/generate-names' & '/generate-slogans') ---
export const generateBrandIdentity = async (description: string): Promise<{ names: string[], taglines: string[] }> => {
  // We run both requests in parallel to be fast
  const [namesData, slogansData] = await Promise.all([
    callBackend('/ai/generate-names', { description }),
    callBackend('/ai/generate-slogans', { description })
  ]);

  return { 
    names: namesData.names || [], 
    taglines: slogansData.slogans || [] 
  };
};

// --- 3. UI Suggestions (Uses '/generate-ui') ---
export const generateUISuggestion = async (data: BusinessData) => {
  const result = await callBackend('/ai/generate-ui', { description: data.description });
  return result.design; // The backend returns the JSON inside 'design'
};

// --- 4. Chat Assistant (Uses '/chat') ---
export const createChat = (context: string) => {
  // We return an object that LOOKS like the Google SDK chat object
  // so your frontend code doesn't break.
  return {
    sendMessage: async (message: string) => {
      const data = await callBackend('/ai/chat', { 
        message, 
        context: `The user is working on a project with this context: ${context}.` 
      });
      
      // Mock the response structure the UI expects
      return {
        response: {
          text: () => data.reply
        }
      };
    }
  };
};

// --- 5. Logo Generation (FIXED) ---
export const generateLogo = async (description: string, style: string): Promise<string> => {
  // FIXED: Endpoint changed from '/logo/generate' to '/logo/generate-logo'
  const data = await callBackend('/logo/generate-logo', { description, style });
  
  // FIXED: Changed 'imageUrl' to 'image' to match your backend response
  return data.image; 
};

// --- 6. Image Editing (Connects to '/studio' route) ---
export const editImageWithPrompt = async (base64Image: string, instruction: string): Promise<string> => {
  const data = await callBackend('/studio/edit-image', { image: base64Image, prompt: instruction });
  return data.editedImage; 
};

// --- 7. Video Generation (Connects to '/studio' route) ---
export const generateVeoVideo = async (imageFile: File, prompt: string): Promise<string> => {
  // Convert File to Base64 first
  const arrayBuffer = await imageFile.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const data = await callBackend('/studio/generate-video', { 
    image: base64String, 
    prompt 
  });
  return data.videoUrl;
};

// --- 8. Live API (Placeholder) ---
export const connectToLiveAPI = async (
  // @ts-ignore
  onAudioData: (buffer: AudioBuffer) => void,
  onClose: () => void
): Promise<{ sendAudio: (data: Float32Array) => void; close: () => void }> => {
  console.warn("Live API is currently disabled while moving to Backend.");
  return {
    sendAudio: () => {},
    close: () => onClose()
  };
};