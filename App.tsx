
import React, { useState, useMemo, useEffect } from 'react';
import { VOCABULARY } from './constants';
import { Word, ViewMode } from './types';
import WordList from './components/WordList';
import Flashcard from './components/Flashcard';
import StoryGenerator from './components/StoryGenerator';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // Load persistence from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vocab-progress');
    if (saved) {
      setLearnedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleLearned = (id: string) => {
    const newSet = new Set(learnedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setLearnedIds(newSet);
    localStorage.setItem('vocab-progress', JSON.stringify(Array.from(newSet)));
  };

  const filteredWords = useMemo(() => {
    return VOCABULARY.filter(w => 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.includes(searchQuery)
    );
  }, [searchQuery]);

  const progressPercentage = Math.round((learnedIds.size / VOCABULARY.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">V</span>
              VocabFlow
            </h1>
          </div>
          
          <div className="flex-1 max-w-md w-full relative">
            <input 
              type="text" 
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-2 px-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-bold text-slate-800">{learnedIds.size} / {VOCABULARY.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative overflow-hidden">
               <div 
                className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-1000"
                style={{ height: `${progressPercentage}%` }}
               />
               <span className="relative z-10 text-[10px] font-bold text-slate-700">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {viewMode === ViewMode.LIST && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Word Library</h2>
              <div className="text-sm text-slate-500">Showing {filteredWords.length} words</div>
            </div>
            <WordList 
              words={filteredWords} 
              learnedIds={learnedIds} 
              onSelectWord={(w) => {
                setSelectedWord(w);
                setViewMode(ViewMode.FLASHCARD);
              }}
            />
          </div>
        )}

        {viewMode === ViewMode.FLASHCARD && (
          <div className="flex flex-col items-center py-12">
            <button 
              onClick={() => setViewMode(ViewMode.LIST)}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </button>
            {selectedWord ? (
              <Flashcard 
                word={selectedWord} 
                isLearned={learnedIds.has(selectedWord.id)}
                onLearned={toggleLearned}
              />
            ) : (
              <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400">Please select a word from the list first.</p>
                <button onClick={() => setViewMode(ViewMode.LIST)} className="mt-4 text-blue-600 font-bold">Go to Library</button>
              </div>
            )}
          </div>
        )}

        {viewMode === ViewMode.STORY && (
          <StoryGenerator allWords={VOCABULARY} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-4 flex justify-around items-center z-40">
        <button 
          onClick={() => setViewMode(ViewMode.LIST)}
          className={`flex flex-col items-center gap-1 ${viewMode === ViewMode.LIST ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Library</span>
        </button>

        <button 
          onClick={() => setViewMode(ViewMode.FLASHCARD)}
          className={`flex flex-col items-center gap-1 ${viewMode === ViewMode.FLASHCARD ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Study</span>
        </button>

        <button 
          onClick={() => setViewMode(ViewMode.STORY)}
          className={`flex flex-col items-center gap-1 ${viewMode === ViewMode.STORY ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Story</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
