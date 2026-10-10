/**
 * Morphology Index
 * Fast in-memory inverted index: inflected form -> lemma ID + grammatical features
 * Enables:
 *   аптеке -> аптека
 *   работает -> работать
 */
import { DictionaryEntry } from '../types';
import { normalizeRussian } from './normalize';

export interface FormLookupMatch {
  form: string;
  lemmaId: string;
  lemma: string;
  entry: DictionaryEntry;
  grammaticalFeatures?: any;
}

class MorphologyIndex {
  private formToEntries = new Map<string, FormLookupMatch[]>();
  private initialized = false;

  public buildIndex(entries: DictionaryEntry[]): void {
    this.formToEntries.clear();

    for (const entry of entries) {
      // 1. Index the lemma itself
      const normLemma = normalizeRussian(entry.lemma);
      if (normLemma) {
        this.addFormMapping(normLemma, {
          form: entry.lemma,
          lemmaId: entry.id,
          lemma: entry.lemma,
          entry,
          grammaticalFeatures: { case: 'nominative' },
        });
      }

      // 2. Index all declared inflected forms
      if (entry.forms && Array.isArray(entry.forms)) {
        for (const f of entry.forms) {
          const normForm = normalizeRussian(f.form);
          if (normForm) {
            this.addFormMapping(normForm, {
              form: f.form,
              lemmaId: entry.id,
              lemma: entry.lemma,
              entry,
              grammaticalFeatures: f.grammaticalFeatures,
            });
          }
        }
      }
    }
    this.initialized = true;
  }

  private addFormMapping(key: string, match: FormLookupMatch) {
    const list = this.formToEntries.get(key) || [];
    // avoid exact duplicates
    if (!list.some((m) => m.lemmaId === match.lemmaId && JSON.stringify(m.grammaticalFeatures) === JSON.stringify(match.grammaticalFeatures))) {
      list.push(match);
    }
    this.formToEntries.set(key, list);
  }

  public lookupForm(rawForm: string): FormLookupMatch[] {
    const norm = normalizeRussian(rawForm);
    if (!norm) return [];
    return this.formToEntries.get(norm) || [];
  }

  public getFormCount(): number {
    return this.formToEntries.size;
  }
}

export const morphologyIndex = new MorphologyIndex();
