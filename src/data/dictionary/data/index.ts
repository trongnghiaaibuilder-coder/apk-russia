/**
 * Russian Dictionary Data Aggregator (Unified Vietnamese - Russian Lexicon)
 * Combines Foundation Morphological Entries, Expanded Morphological Entries,
 * and the full Russian Vocabulary Dataset into a single 100% offline-compliant dictionary.
 */
import { FOUNDATION_ENTRIES } from './words';
import { EXPANDED_DICTIONARY_ENTRIES } from './expandedWords';
import { RUSSIAN_VOCABULARY } from '../../../modules/learning/data/vocabulary';
import { VocabularyCategory, VocabularyItem } from '../../../modules/learning/types';
import { DictionaryEntry, DictionaryTopic, PartOfSpeech } from '../types';
import { normalizeRussian } from '../index/normalize';

const CATEGORY_TO_TOPICS: Record<VocabularyCategory, DictionaryTopic[]> = {
  'Greetings': ['greetings', 'communication', 'daily-life'],
  'Basic communication': ['communication', 'daily-life', 'social'],
  'People': ['social', 'daily-life', 'culture'],
  'Numbers': ['numbers', 'shopping', 'daily-life'],
  'Time': ['time', 'daily-life'],
  'Food': ['food', 'restaurant', 'shopping'],
  'Drinks': ['food', 'restaurant', 'daily-life'],
  'Transport': ['transport', 'metro', 'travel'],
  'Taxi': ['taxi', 'transport', 'travel'],
  'Hotel': ['hotel', 'housing', 'travel'],
  'Shopping': ['shopping', 'money', 'daily-life'],
  'Money': ['money', 'banking', 'shopping'],
  'Work': ['work', 'documents', 'daily-life'],
  'Directions': ['directions', 'transport', 'travel'],
  'Places': ['travel', 'directions', 'daily-life'],
  'Emergency': ['emergency', 'hospital', 'health'],
  'Health & Pharmacy': ['pharmacy', 'hospital', 'health'],
  'Documents & Visa': ['documents', 'migration', 'work'],
  'Education': ['education', 'daily-life', 'culture'],
  'Weather & Nature': ['weather', 'daily-life'],
  'Housing & Daily Life': ['housing', 'daily-life'],
  'Verbs & Actions': ['daily-life', 'communication'],
  'Adjectives & Colors': ['daily-life', 'shopping'],
};

function inferPartOfSpeech(item: VocabularyItem): PartOfSpeech {
  if (item.partOfSpeech) {
    const pos = item.partOfSpeech.toLowerCase();
    if (pos.includes('danh từ')) return 'noun';
    if (pos.includes('động từ')) return 'verb';
    if (pos.includes('tính từ')) return 'adjective';
    if (pos.includes('trạng từ')) return 'adverb';
    if (pos.includes('đại từ')) return 'pronoun';
    if (pos.includes('số từ')) return 'numeral';
    if (pos.includes('giới từ')) return 'preposition';
    if (pos.includes('cụm từ')) return 'interjection';
  }
  if (item.category === 'Numbers') return 'numeral';
  if (item.category === 'Greetings' || item.category === 'Basic communication') return 'interjection';
  if (item.category === 'Verbs & Actions') return 'verb';
  if (item.category === 'Adjectives & Colors') return 'adjective';
  if (item.category === 'Directions') return 'adverb';
  const ruLower = item.ru.toLowerCase().trim();
  if (ruLower.endsWith('ть') || ruLower.endsWith('ться')) return 'verb';
  if (ruLower.endsWith('ый') || ruLower.endsWith('ий') || ruLower.endsWith('ой')) return 'adjective';
  return 'noun';
}

function buildUnifiedDataset(): DictionaryEntry[] {
  const baseEntries: DictionaryEntry[] = [...FOUNDATION_ENTRIES, ...EXPANDED_DICTIONARY_ENTRIES];
  const seenLemmas = new Set<string>();
  const seenIds = new Set<string>();

  for (const entry of baseEntries) {
    seenLemmas.add(normalizeRussian(entry.lemma));
    seenIds.add(entry.id);
  }

  const synthesizedEntries: DictionaryEntry[] = [];

  for (const voc of RUSSIAN_VOCABULARY) {
    // Extract primary Russian lemma (if slash-separated like "Мать / Мама", use primary form and add secondary to forms)
    const parts = voc.ru.split('/').map((s) => s.trim()).filter(Boolean);
    const primaryLemma = (parts[0] || voc.ru).replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
    const normLemma = normalizeRussian(primaryLemma);

    if (!normLemma || seenLemmas.has(normLemma)) {
      continue;
    }

    const entryId = `dict-${voc.id}`;
    if (seenIds.has(entryId)) {
      continue;
    }

    seenLemmas.add(normLemma);
    seenIds.add(entryId);

    const pos = inferPartOfSpeech(voc);
    const topics = CATEGORY_TO_TOPICS[voc.category] || ['daily-life'];
    const forms = parts.map((p) => ({
      form: p.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase(),
      lemmaId: entryId,
    }));

    synthesizedEntries.push({
      id: entryId,
      lemma: primaryLemma,
      language: 'ru',
      partOfSpeech: pos,
      pronunciation: {
        phonetic: voc.pronunciation.toLowerCase(),
        stress: parts[0] || voc.ru,
      },
      gender: voc.gender,
      meanings: [
        {
          id: `${entryId}-m1`,
          vi: voc.vi,
          context: voc.category,
          register: 'neutral',
        },
      ],
      forms,
      examples: voc.examplePhraseRu && voc.examplePhraseVi
        ? [
            {
              id: `ex-${voc.id}`,
              ru: voc.examplePhraseRu,
              vi: voc.examplePhraseVi,
              topics,
              sourceRefs: ['project-authored'],
            },
          ]
        : [],
      topics,
      difficulty: voc.difficulty === 'beginner' ? 'A1' : 'A2',
      frequency: 2500,
      sourceRefs: ['wiktionary-kaikki', 'opencorpora-morphology', 'project-authored'],
      dataVersion: '1.0.0',
      requiresAttribution: true,
    });
  }

  return [...baseEntries, ...synthesizedEntries];
}

export const DICTIONARY_DATASET: DictionaryEntry[] = buildUnifiedDataset();

export function getAllEntries(): DictionaryEntry[] {
  return DICTIONARY_DATASET;
}

export function getEntryById(id: string): DictionaryEntry | undefined {
  return DICTIONARY_DATASET.find((e) => e.id === id);
}
