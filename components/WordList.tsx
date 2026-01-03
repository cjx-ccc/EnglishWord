
import React from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
  learnedIds: Set<string>;
  onSelectWord: (word: Word) => void;
}

const WordList: React.FC<WordListProps> = ({ words, learnedIds, onSelectWord }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
      {words.map((w) => (
        <div 
          key={w.id}
          onClick={() => onSelectWord(w)}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{w.word}</h3>
            <p className="text-sm text-slate-500">{w.pos} {w.meaning}</p>
          </div>
          {learnedIds.has(w.id) && (
            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded">
              DONE
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default WordList;
