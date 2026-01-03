
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { generateMnemonicStory } from '../services/gemini';

interface StoryGeneratorProps {
  allWords: Word[];
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ allWords }) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleWordSelection = (word: Word) => {
    if (selectedWords.find(w => w.id === word.id)) {
      setSelectedWords(selectedWords.filter(w => w.id !== word.id));
    } else if (selectedWords.length < 5) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleGenerate = async () => {
    if (selectedWords.length !== 5) return;
    setLoading(true);
    setStory(null);
    const result = await generateMnemonicStory(selectedWords);
    setStory(result);
    setLoading(false);
  };

  const autoSelectFive = () => {
    const randoms = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSelectedWords(randoms);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">AI Mnemonic Story Generator</h2>
        <p className="text-blue-100 opacity-90">Pick exactly 5 words to generate a memorable story.</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedWords.length > 0 ? selectedWords.map(w => (
            <span key={w.id} className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              {w.word}
              <button onClick={() => toggleWordSelection(w)} className="hover:text-red-300">×</button>
            </span>
          )) : (
            <span className="text-sm italic opacity-60">No words selected...</span>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            disabled={selectedWords.length !== 5 || loading}
            onClick={handleGenerate}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              selectedWords.length === 5 && !loading 
                ? 'bg-white text-blue-600 hover:bg-blue-50' 
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            {loading ? 'AI Thinking...' : 'Generate Story'}
          </button>
          <button 
            onClick={autoSelectFive}
            className="px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10"
          >
            Random 5
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Weaving your story together...</p>
        </div>
      )}

      {story && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
          <div className="prose prose-slate max-w-none">
            <div className="text-blue-600 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-bold tracking-wide uppercase text-xs">Generated Memory Aid</span>
            </div>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
              {story}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Select Words</h3>
        <div className="flex flex-wrap gap-2">
          {allWords.map(w => {
            const isSelected = selectedWords.find(sw => sw.id === w.id);
            return (
              <button
                key={w.id}
                onClick={() => toggleWordSelection(w)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
