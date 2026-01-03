
import React, { useState } from 'react';
import { Word } from '../types';

interface FlashcardProps {
  word: Word;
  onLearned?: (id: string) => void;
  isLearned?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onLearned, isLearned }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
      <div 
        className="w-full aspect-[4/5] perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-2xl flex flex-col items-center justify-center p-8 border border-slate-200">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
              {word.category} Group
            </span>
            <h2 className="text-5xl font-bold tracking-tight text-slate-800 mb-2">{word.word}</h2>
            <p className="text-lg text-slate-400 font-medium italic">{word.pos}</p>
            <p className="mt-12 text-sm text-slate-400">Tap to see meaning</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-blue-600 rounded-2xl flex flex-col items-center justify-center p-8 text-white rotate-y-180">
            <h3 className="text-4xl font-bold mb-4">{word.meaning}</h3>
            <div className="h-px w-20 bg-blue-400 mb-6"></div>
            <p className="text-center text-blue-100 italic">
              "Every achievement begins with the decision to try."
            </p>
            <p className="mt-12 text-sm text-blue-200">Tap to flip back</p>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onLearned?.(word.id);
        }}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all shadow-md ${
          isLearned 
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {isLearned ? '✓ Learned' : 'Mark as Learned'}
      </button>
    </div>
  );
};

export default Flashcard;
