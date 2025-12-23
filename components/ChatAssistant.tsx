import React, { useState, useEffect, useRef } from 'react';
import { createChat } from '../services/geminiService';
import { Project, Message } from '../types';
import { GenerateContentResponse } from '@google/genai';
import TextType from './TextType';

interface Props {
  project: Project;
}

export const ChatAssistant: React.FC<Props> = ({ project }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session with context
  useEffect(() => {
    try {
      const context = `Project Name: ${project.name}. Idea: ${project.data.idea}. Industry: ${project.data.industry}. Description: ${project.data.description}`;
      chatRef.current = createChat(context);
      setMessages([{
        role: 'model',
        text: `Hi! I'm your AI assistant for "${project.name || 'your project'}". How can I help you build your business today?`
      }]);
    } catch (e: any) {
      setMessages([{ role: 'model', text: `Error initializing chat: ${e.message}. Please check your API key.` }]);
    }
  }, [project.id]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMsg.text });
      setMessages(prev => [...prev, { role: 'model', text: result.text || "I couldn't generate a response." }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
      <div className="bg-indigo-900/20 p-4 border-b border-indigo-500/20 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
            <span className="text-xl text-white">🤖</span>
        </div>
        <div>
          <h3 className="font-bold text-white">Project Assistant</h3>
          <p className="text-xs text-indigo-300">Context: {project.name || 'Untitled'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] p-4 rounded-2xl shadow-md text-sm whitespace-pre-wrap leading-relaxed ${
               msg.role === 'user' 
                 ? 'bg-indigo-600 text-white rounded-tr-sm' 
                 : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
             }`}>
               {msg.role === 'model' && idx === messages.length - 1 ? (
                 <TextType 
                    text={msg.text} 
                    loop={false} 
                    typingSpeed={15} 
                    cursorCharacter="|"
                    hideCursorWhileTyping={false}
                  />
               ) : (
                 msg.text
               )}
             </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-4 rounded-2xl border border-slate-700 rounded-tl-none">
               <div className="flex space-x-1.5">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
               </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
         <div className="flex gap-3">
           <input
             type="text"
             className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
             placeholder="Ask about marketing, copy, strategy..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             disabled={loading}
           />
           <button 
             onClick={handleSend}
             disabled={loading || !input.trim()}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-900/20"
           >
             Send
           </button>
         </div>
      </div>
    </div>
  );
};