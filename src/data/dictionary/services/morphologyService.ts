/**
 * Russian Morphology Analysis & Paradigm Service
 * Provides lemmatization, case detection, aspect pairs, and declension/conjugation tables.
 */
import { morphologyIndex, FormLookupMatch } from '../index/morphologyIndex';
import { normalizeRussian } from '../index/normalize';
import { COMMON_ASPECTUAL_PAIRS, AspectualPairRule, RUSSIAN_CASES, CaseRule, CONJUGATION_PATTERNS, ConjugationPattern } from '../data/grammar';
import { DICTIONARY_DATASET } from '../data';
import { GrammaticalFeatures } from '../types';

export interface MorphologyAnalysisResult {
  term: string;
  isRecognized: boolean;
  matches: Array<{
    lemma: string;
    lemmaId: string;
    form: string;
    partOfSpeech: string;
    grammaticalFeatures?: GrammaticalFeatures;
    meanings: string[];
  }>;
  aspectPair?: AspectualPairRule;
}

export class MorphologyService {
  /**
   * Analyzes an inflected Russian word to uncover base lemma and grammar features
   */
  public analyzeWord(rawWord: string): MorphologyAnalysisResult {
    const norm = normalizeRussian(rawWord);
    const hits: FormLookupMatch[] = morphologyIndex.lookupForm(norm);

    const matches = hits.map((hit) => ({
      lemma: hit.lemma,
      lemmaId: hit.lemmaId,
      form: hit.form,
      partOfSpeech: hit.entry.partOfSpeech,
      grammaticalFeatures: hit.grammaticalFeatures,
      meanings: hit.entry.meanings.map((m) => m.vi),
    }));

    // Find aspect pair if it's a verb
    let aspectPair: AspectualPairRule | undefined;
    if (matches.length > 0) {
      const primaryLemma = matches[0].lemma;
      aspectPair = this.getAspectPair(primaryLemma);
    } else {
      aspectPair = this.getAspectPair(norm);
    }

    return {
      term: rawWord,
      isRecognized: matches.length > 0,
      matches,
      aspectPair,
    };
  }

  /**
   * Gets aspectual pair (imperfective <-> perfective) for a Russian verb
   */
  public getAspectPair(verbLemma: string): AspectualPairRule | undefined {
    const norm = normalizeRussian(verbLemma);
    return COMMON_ASPECTUAL_PAIRS.find(
      (pair) => normalizeRussian(pair.imperfective) === norm || normalizeRussian(pair.perfective) === norm
    );
  }

  /**
   * Returns grammatical rule and question for a case
   */
  public getCaseInfo(caseName: CaseRule['caseName']): CaseRule | undefined {
    return RUSSIAN_CASES.find((c) => c.caseName === caseName);
  }

  /**
   * Returns all Russian grammatical cases
   */
  public getAllCases(): CaseRule[] {
    return RUSSIAN_CASES;
  }

  /**
   * Returns verb conjugation patterns
   */
  public getConjugationPatterns(): ConjugationPattern[] {
    return CONJUGATION_PATTERNS;
  }

  /**
   * Extracts all declared inflected forms of an entry
   */
  public getParadigmForms(lemmaOrId: string): Array<{ form: string; features?: GrammaticalFeatures }> {
    const norm = normalizeRussian(lemmaOrId);
    const entry = DICTIONARY_DATASET.find(
      (e) => e.id === lemmaOrId || normalizeRussian(e.lemma) === norm
    );
    if (!entry || !entry.forms) return [];
    return entry.forms.map((f) => ({
      form: f.form,
      features: f.grammaticalFeatures,
    }));
  }
}

export const morphologyService = new MorphologyService();
