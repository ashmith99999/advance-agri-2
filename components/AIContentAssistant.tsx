import React, { useState } from 'react';
import { Machinery, TrainingModule } from '../types';
import { Sparkles, Tractor, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize the GoogleGenAI client according to coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define schemas for structured JSON output from the model.
const machinerySchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['Tractor', 'Harvester', 'Cultivator', 'Sprayer', 'Seeder'] },
    power: { type: Type.STRING, description: "e.g., '75 HP'" },
    price: { type: Type.NUMBER, description: "Price per day" },
    image: { type: Type.STRING, description: "A single emoji representing the machinery. e.g., '🚜' for Tractor, '🌾' for Harvester." },
    location: { type: Type.STRING },
    suitable: { type: Type.ARRAY, items: { type: Type.STRING } },
    demand: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
    soilSuitability: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['name', 'type', 'power', 'price', 'image', 'location', 'suitable', 'demand', 'soilSuitability']
};

const trainingSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['Video', 'Manual', 'Quick Tip'] },
    machineryType: { type: Type.ARRAY, items: { type: Type.STRING } },
    difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    duration: { type: Type.NUMBER, description: "Duration in minutes" },
    icon: { type: Type.STRING, description: "A single emoji representing the training type. e.g., '📖' for Manual, '📹' for Video." },
    description: { type: Type.STRING },
    content: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ['checklist', 'video', 'text'] },
        items: { type: Type.ARRAY, items: { type: Type.STRING } },
        links: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                },
                required: ['title', 'url']
            },
            description: "Only include if content type is 'video'."
        }
      },
      required: ['type', 'items']
    },
  },
  required: ['title', 'type', 'machineryType', 'difficulty', 'duration', 'icon', 'description', 'content']
};

interface AIContentAssistantProps {
  onAddMachinery: (machine: Omit<Machinery, 'id' | 'rating' | 'distance' | 'owner' | 'phone' | 'address'>) => void;
  onAddTraining: (module: Omit<TrainingModule, 'id'>) => void;
}

const AIContentAssistant: React.FC<AIContentAssistantProps> = ({ onAddMachinery, onAddTraining }) => {
  const [task, setTask] = useState<'machinery' | 'training'>('machinery');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
        setError('Prompt cannot be empty.');
        return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedContent(null);
    try {
        // FIX: Replaced mock function with a real Gemini API call for content generation.
        const model = 'gemini-2.5-flash';
        const schema = task === 'machinery' ? machinerySchema : trainingSchema;
        const systemInstruction = task === 'machinery' 
            ? 'You are an agricultural machinery database assistant. Based on the user prompt, generate the data for a new piece of machinery in JSON format according to the provided schema. The `image` property must be a single emoji.'
            : 'You are a training content creator for an agricultural platform. Based on the user prompt, generate the data for a new training module in JSON format according to the provided schema. The `icon` property must be a single emoji.';

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                systemInstruction: systemInstruction,
            }
        });

        const jsonString = response.text.trim();
        const generatedData = JSON.parse(jsonString);
        setGeneratedContent(generatedData);
    } catch (e) {
        console.error(e);
        setError('Failed to generate content. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (!generatedContent) return;
    if (task === 'machinery') {
        onAddMachinery(generatedContent);
    } else {
        onAddTraining(generatedContent);
    }
    setGeneratedContent(null);
    setPrompt('');
  }

  return (
    <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
      <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4 flex items-center gap-2">
        <Sparkles className="text-yellow-500" /> AI Content Assistant
      </h3>
      
      <div className="flex gap-2 mb-4 bg-gray-500/10 p-2 rounded-xl">
        <button 
            onClick={() => setTask('machinery')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${task === 'machinery' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
            <Tractor size={18} /> Add Machinery
        </button>
        <button 
            onClick={() => setTask('training')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${task === 'training' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
            <BookOpen size={18} /> Create Training
        </button>
      </div>

      <div className="space-y-4">
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {task === 'machinery' ? 'Describe the new machinery:' : 'Enter the title for the new training module:'}
            </label>
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={task === 'machinery' ? "e.g., A powerful 90 HP tractor for sugarcane" : "e.g., Advanced Plowing Techniques"}
                className="w-full h-24 p-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
            />
        </div>
        <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[var(--app-primary)] to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {isLoading ? <><div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Generating...</> : <><Sparkles size={20} /> Generate with AI</>}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-500/10 text-red-700 rounded-lg flex items-center gap-2 text-sm"><AlertCircle size={18} /> {error}</div>}
      
      {generatedContent && (
        <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-200/50 animate-fade-in-up">
            <h4 className="text-lg font-bold text-blue-800 mb-2">Generated Content (Review & Approve)</h4>
            <pre className="bg-white/50 p-3 rounded-lg text-xs text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {JSON.stringify(generatedContent, null, 2)}
            </pre>
            <button
                onClick={handleApprove}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
                <CheckCircle size={20} /> Approve & Add to System
            </button>
        </div>
      )}

    </div>
  );
};

export default AIContentAssistant;