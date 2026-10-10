/**
 * Russia AI Support - P2 Russian Dictionary Foundation Test Suite
 * Developer: Xương Rồng AI developer
 * Phase: P2 Foundation Expansion - Russian Dictionary Foundation
 * Principles: WIDE DATA + OFFLINE-FIRST + MORPHOLOGY-AWARE + SOURCE-TRACEABLE
 */
import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  DICTIONARY_DATASET,
  validateDictionaryEntry,
  dictionaryService,
  morphologyService,
  dictionarySourceService,
  searchDictionary,
  normalizeRussian,
  normalizeVietnamese,
  removeVietnameseDiacritics,
  isCyrillic,
  COMMON_ASPECTUAL_PAIRS,
  RUSSIAN_CASES,
  CONJUGATION_PATTERNS,
  PRACTICAL_PHRASES,
  PRACTICAL_EXAMPLES,
} from '../src/data/dictionary';

describe('P2 Dictionary Foundation: 1. Schema Validation & Data Integrity', () => {
  test('DICTIONARY_DATASET contains at least 300 comprehensive Vietnamese-Russian entries', () => {
    assert.ok(DICTIONARY_DATASET.length >= 300, `Expected at least 300 entries, got ${DICTIONARY_DATASET.length}`);
  });

  test('dictionaryService.browse returns entries when query is empty with topic and POS filters', () => {
    const allBrowse = dictionaryService.browse({ limit: 50 });
    assert.strictEqual(allBrowse.matches.length, 50);
    assert.ok(allBrowse.totalMatches >= 300);

    const eduBrowse = dictionaryService.browse({ topic: 'education' });
    assert.ok(eduBrowse.matches.length > 0);
    assert.ok(eduBrowse.matches.every((m) => m.entry.topics?.includes('education')));
  });

  test('All entries pass strict schema validation with zero errors', () => {
    for (const entry of DICTIONARY_DATASET) {
      const result = validateDictionaryEntry(entry);
      assert.strictEqual(
        result.valid,
        true,
        `Validation failed for entry ${entry.id} (${entry.lemma}): ${result.errors.join(', ')}`
      );
    }
  });

  test('Every entry has Russian Cyrillic lemma and valid part of speech', () => {
    const validPOS = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'particle', 'numeral', 'interjection', 'other'];
    for (const entry of DICTIONARY_DATASET) {
      assert.ok(isCyrillic(entry.lemma), `Entry lemma "${entry.lemma}" must contain Cyrillic characters`);
      assert.ok(validPOS.includes(entry.partOfSpeech), `Invalid POS "${entry.partOfSpeech}" for entry ${entry.id}`);
      assert.strictEqual(entry.language, 'ru');
      assert.ok(entry.dataVersion, `Entry ${entry.id} missing dataVersion`);
    }
  });

  test('Every entry contains accurate Vietnamese meanings', () => {
    for (const entry of DICTIONARY_DATASET) {
      assert.ok(entry.meanings.length > 0, `Entry ${entry.id} has no meanings`);
      for (const m of entry.meanings) {
        assert.ok(m.vi && m.vi.trim().length > 0, `Meaning ${m.id} in entry ${entry.id} missing Vietnamese translation`);
      }
    }
  });
});

describe('P2 Dictionary Foundation: 2. Source Attribution & 100% Offline Compliance', () => {
  test('All sources defined in manifest are 100% offline compliant', () => {
    const manifests = dictionarySourceService.getAllManifests();
    assert.ok(manifests.length >= 3, `Expected at least 3 source manifests, got ${manifests.length}`);
    assert.strictEqual(dictionarySourceService.isFullyOfflineCompliant(), true);
  });

  test('Every dictionary entry sourceRef points to an authorized manifest source', () => {
    for (const entry of DICTIONARY_DATASET) {
      const check = dictionarySourceService.verifyEntrySources(entry);
      assert.strictEqual(
        check.compliant,
        true,
        `Entry ${entry.id} contains unregistered sources: ${check.missingRefs.join(', ')}`
      );
    }
  });

  test('Attribution summary provides complete transparency without external network call', () => {
    const summary = dictionarySourceService.getAttributionSummary();
    assert.ok(summary.length >= 3);
    for (const item of summary) {
      assert.ok(item.sourceName);
      assert.ok(item.license);
      assert.ok(item.attribution);
    }
  });
});

describe('P2 Dictionary Foundation: 3. Normalization & Cyrillic/Vietnamese Support', () => {
  test('normalizeRussian strips accents, normalizes ё -> е, and handles case', () => {
    assert.strictEqual(normalizeRussian('Апте́ка'), 'аптека');
    assert.strictEqual(normalizeRussian('ЁЛКА'), 'елка');
    assert.strictEqual(normalizeRussian('  Здравствуйте!  '), 'здравствуйте');
    assert.strictEqual(normalizeRussian('по-русски'), 'по русски');
  });

  test('normalizeVietnamese and removeVietnameseDiacritics handle tone marks', () => {
    assert.strictEqual(removeVietnameseDiacritics('hiệu thuốc'), 'hieu thuoc');
    assert.strictEqual(removeVietnameseDiacritics('đường phố'), 'duong pho');
    assert.strictEqual(normalizeVietnamese('Nhà Thuốc, Bệnh Viện!', true), 'nha thuoc benh vien');
  });

  test('isCyrillic accurately differentiates Russian from Vietnamese/English text', () => {
    assert.strictEqual(isCyrillic('Привет'), true);
    assert.strictEqual(isCyrillic('метро'), true);
    assert.strictEqual(isCyrillic('Xin chào'), false);
    assert.strictEqual(isCyrillic('Hello world'), false);
  });
});

describe('P2 Dictionary Foundation: 4. Morphology Index & Word Inflection Analysis', () => {
  test('Morphology analysis recognizes base lemma from inflected noun cases', () => {
    const resDative = morphologyService.analyzeWord('аптеке');
    assert.strictEqual(resDative.isRecognized, true);
    assert.ok(resDative.matches.some((m) => m.lemma === 'аптека'));

    const resAcc = morphologyService.analyzeWord('аптеку');
    assert.strictEqual(resAcc.isRecognized, true);
    assert.ok(resAcc.matches.some((m) => m.lemma === 'аптека' && m.grammaticalFeatures?.case === 'accusative'));
  });

  test('Morphology analysis recognizes inflected verb conjugation forms', () => {
    const resPresent = morphologyService.analyzeWord('работаю');
    assert.strictEqual(resPresent.isRecognized, true);
    assert.ok(resPresent.matches.some((m) => m.lemma === 'работать'));

    const res3rd = morphologyService.analyzeWord('работает');
    assert.strictEqual(res3rd.isRecognized, true);
    assert.ok(res3rd.matches.some((m) => m.lemma === 'работать'));
  });

  test('Common aspectual pairs resolve correctly for imperfective and perfective verbs', () => {
    assert.ok(COMMON_ASPECTUAL_PAIRS.length >= 10);
    const pair1 = morphologyService.getAspectPair('делать');
    assert.ok(pair1);
    assert.strictEqual(pair1?.perfective, 'сделать');

    const pair2 = morphologyService.getAspectPair('сказать');
    assert.ok(pair2);
    assert.strictEqual(pair2?.imperfective, 'говорить');
  });

  test('All 6 Russian grammatical cases are documented with questions and Vietnamese descriptions', () => {
    const cases = morphologyService.getAllCases();
    assert.strictEqual(cases.length, 6);
    const caseNames = cases.map((c) => c.caseName);
    assert.deepStrictEqual(caseNames, ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional']);
    for (const c of cases) {
      assert.ok(c.russianName);
      assert.ok(c.vietnameseName);
      assert.ok(c.questionRu);
      assert.ok(c.questionVi);
      assert.ok(c.primaryUsage);
    }
  });

  test('Verb conjugation patterns (1st, 2nd, irregular) are properly structured', () => {
    const patterns = morphologyService.getConjugationPatterns();
    assert.strictEqual(patterns.length, 3);
    const typeNames = patterns.map((p) => p.conjugationType);
    assert.ok(typeNames.includes('1st'));
    assert.ok(typeNames.includes('2nd'));
    assert.ok(typeNames.includes('irregular'));
  });
});

describe('P2 Dictionary Foundation: 5. Search Engine & Multi-Stage Scoring', () => {
  test('Exact Russian lemma search returns score 100 as top match', () => {
    const res = searchDictionary('аптека');
    assert.ok(res.matches.length > 0);
    assert.strictEqual(res.matches[0].entry.lemma, 'аптека');
    assert.strictEqual(res.matches[0].matchType, 'exact_lemma');
    assert.strictEqual(res.matches[0].score, 100);
  });

  test('Inflected form search finds base entry with score 90', () => {
    const res = searchDictionary('аптеке');
    assert.ok(res.matches.length > 0);
    assert.strictEqual(res.matches[0].entry.lemma, 'аптека');
    assert.strictEqual(res.matches[0].matchType, 'exact_form');
    assert.strictEqual(res.matches[0].score, 90);
  });

  test('Vietnamese meaning search finds Russian word accurately', () => {
    const res = searchDictionary('nhà thuốc');
    assert.ok(res.matches.length > 0);
    assert.strictEqual(res.matches[0].entry.lemma, 'аптека');
    assert.strictEqual(res.matches[0].matchType, 'vietnamese_meaning');
  });

  test('Accent-free Vietnamese search works seamlessly', () => {
    const res = searchDictionary('ho chieu');
    assert.ok(res.matches.length > 0);
    assert.strictEqual(res.matches[0].entry.lemma, 'паспорт');
  });

  test('Topic filtering limits results to requested category', () => {
    const pharmacyEntries = dictionaryService.getByTopic('pharmacy');
    assert.ok(pharmacyEntries.length > 0);
    assert.ok(pharmacyEntries.every((e) => e.topics && e.topics.includes('pharmacy')));
  });

  test('Part of speech filtering isolates nouns, verbs, and adjectives', () => {
    const nouns = dictionaryService.getByPartOfSpeech('noun');
    const verbs = dictionaryService.getByPartOfSpeech('verb');
    const adjectives = dictionaryService.getByPartOfSpeech('adjective');
    assert.ok(nouns.length > 0);
    assert.ok(verbs.length > 0);
    assert.ok(adjectives.length > 0);
    assert.ok(nouns.every((e) => e.partOfSpeech === 'noun'));
    assert.ok(verbs.every((e) => e.partOfSpeech === 'verb'));
  });

  test('Lookup benchmark executes in < 30ms offline', () => {
    const start = performance.now();
    for (let i = 0; i < 50; i++) {
      searchDictionary('аптека');
      searchDictionary('bilet');
      searchDictionary('паспорт');
    }
    const duration = performance.now() - start;
    assert.ok(duration < 500, `Expected 150 lookups in < 500ms, took ${duration.toFixed(2)}ms`);
  });
});

describe('P2 Dictionary Foundation: 6. Practical Phrases & Example Sentences', () => {
  test('PRACTICAL_PHRASES contains essential survival & travel phrases', () => {
    assert.ok(PRACTICAL_PHRASES.length >= 10);
    for (const ph of PRACTICAL_PHRASES) {
      assert.ok(ph.id);
      assert.ok(ph.ru);
      assert.ok(ph.vi);
      assert.ok(ph.phonetic);
      assert.ok(ph.topics.length > 0);
    }
  });

  test('PRACTICAL_EXAMPLES contains grounded bilingual examples with grammar tags', () => {
    assert.ok(PRACTICAL_EXAMPLES.length >= 5);
    for (const ex of PRACTICAL_EXAMPLES) {
      assert.ok(ex.id);
      assert.ok(ex.ru);
      assert.ok(ex.vi);
      assert.ok(ex.grammarTags && ex.grammarTags.length > 0);
    }
  });
});

describe('P2 Dictionary Foundation: 7. Integration Bridges for P3, P4 & P6', () => {
  test('P3 Translation Bridge enriches token stream with base lemmas & definitions', () => {
    const tokens = ['Где', 'ближайшая', 'аптека', '?'];
    const enriched = dictionaryService.enrichTranslationTokens(tokens);
    assert.strictEqual(enriched.length, 4);
    const aptekaToken = enriched.find((t) => t.token === 'аптека');
    assert.ok(aptekaToken);
    assert.strictEqual(aptekaToken?.lemma, 'аптека');
    assert.ok(aptekaToken?.vi);
  });

  test('P4 Voice Bridge resolves inflected spoken words to lemmas on demand', () => {
    const lookup = dictionaryService.lookupTranscriptWord('аптеку');
    assert.ok(lookup);
    assert.strictEqual(lookup?.lemma, 'аптека');
    assert.strictEqual(lookup?.grammaticalFeatures?.case, 'accusative');
    assert.ok(lookup?.meanings.length > 0);
  });

  test('P6 Assistant Bridge retrieves keywords for living domains', () => {
    const metroKeywords = dictionaryService.getAssistantKeywords('metro');
    assert.ok(metroKeywords.length > 0);
    assert.ok(metroKeywords.includes('метро'));
  });

  test('Statistics summary reflects wide data metrics and full offline status', () => {
    const stats = dictionaryService.getStatistics();
    assert.ok(stats.totalEntries >= 10);
    assert.ok(stats.totalForms >= 30);
    assert.ok(stats.totalPhrases >= 10);
    assert.ok(stats.totalExamples >= 5);
    assert.ok(stats.topicsCovered.length >= 5);
    assert.strictEqual(stats.isOfflineCompliant, true);
  });
});
