/**
 * Russia AI Support - Dictionary Foundation Types
 * Developer: Xương Rồng AI developer
 * Phase: P2 Expansion - Russian Dictionary Foundation
 * Principles: WIDE DATA + OFFLINE-FIRST + MORPHOLOGY-AWARE + SOURCE-TRACEABLE
 */

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'particle'
  | 'numeral'
  | 'interjection'
  | 'other';

export type WordGender = 'masculine' | 'feminine' | 'neuter' | 'common';

export type MeaningRegister =
  | 'neutral'
  | 'formal'
  | 'informal'
  | 'colloquial'
  | 'slang'
  | 'technical';

export type CEFRDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type DictionaryTopic =
  | 'daily-life'
  | 'greetings'
  | 'numbers'
  | 'time'
  | 'transport'
  | 'taxi'
  | 'metro'
  | 'directions'
  | 'travel'
  | 'hotel'
  | 'shopping'
  | 'money'
  | 'food'
  | 'restaurant'
  | 'pharmacy'
  | 'hospital'
  | 'health'
  | 'work'
  | 'documents'
  | 'migration'
  | 'banking'
  | 'housing'
  | 'communication'
  | 'emergency'
  | 'weather'
  | 'education'
  | 'technology'
  | 'social'
  | 'culture';

export interface DictionaryMeaning {
  id: string;
  vi: string;
  context?: string;
  usage?: string;
  register?: MeaningRegister;
}

export interface GrammaticalFeatures {
  case?: 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional';
  number?: 'singular' | 'plural';
  gender?: WordGender;
  tense?: 'present' | 'past' | 'future';
  person?: '1st' | '2nd' | '3rd';
  aspect?: 'imperfective' | 'perfective';
  mood?: 'indicative' | 'imperative' | 'conditional';
}

export interface DictionaryForm {
  form: string;
  lemmaId: string;
  grammaticalFeatures?: GrammaticalFeatures;
}

export interface DictionaryExample {
  id: string;
  ru: string;
  vi: string;
  grammarTags?: string[];
  topics?: DictionaryTopic[];
  sourceRefs: string[];
}

export interface DictionaryEntry {
  id: string;
  lemma: string;
  language: 'ru';
  partOfSpeech: PartOfSpeech;
  pronunciation?: {
    ipa?: string;
    phonetic?: string;
    stress?: string;
  };
  gender?: WordGender;
  meanings: DictionaryMeaning[];
  forms?: DictionaryForm[];
  examples?: DictionaryExample[];
  synonyms?: string[];
  antonyms?: string[];
  relatedWords?: string[];
  phrases?: string[];
  topics?: DictionaryTopic[];
  difficulty?: CEFRDifficulty;
  frequency?: number;
  sourceRefs: string[];
  dataVersion: string;
  requiresAttribution: boolean;
}

export interface DictionarySourceManifest {
  sourceId: string;
  sourceName: string;
  license: string;
  sourceUrl: string;
  retrievedAt: string;
  version: string;
  modified: boolean;
  attribution: string;
  offlineCompliant: boolean;
}

export interface SearchMatch {
  entry: DictionaryEntry;
  matchType:
    | 'exact_lemma'
    | 'exact_form'
    | 'vietnamese_meaning'
    | 'phrase'
    | 'prefix'
    | 'related_word'
    | 'topic';
  matchedTerm: string;
  matchedFormFeatures?: GrammaticalFeatures;
  score: number;
}

export interface SearchResult {
  query: string;
  matches: SearchMatch[];
  totalMatches: number;
  lookupTimeMs: number;
}

export interface SearchOptions {
  limit?: number;
  topic?: DictionaryTopic;
  partOfSpeech?: PartOfSpeech;
  difficulty?: CEFRDifficulty;
}
