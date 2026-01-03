
export interface Word {
  id: string;
  word: string;
  pos: string;
  meaning: string;
  category: string;
}

export interface Story {
  content: string;
  words: string[];
}

export enum ViewMode {
  LIST = 'LIST',
  FLASHCARD = 'FLASHCARD',
  STORY = 'STORY'
}

export interface AppState {
  learnedWords: string[];
  currentWordIndex: number;
}
