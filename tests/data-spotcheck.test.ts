import { test, describe } from 'node:test';
import assert from 'node:assert';
import { RUSSIAN_ALPHABET } from '../src/modules/learning/data/alphabet';
import { RUSSIAN_VOCABULARY } from '../src/modules/learning/data/vocabulary';
import { RUSSIAN_PHRASES } from '../src/modules/learning/data/phrases';
import { TOPIC_LESSONS } from '../src/modules/learning/data/lessons';
import { PRONUNCIATION_GUIDES } from '../src/modules/learning/data/pronunciation';

describe('Data Quality Spot Check: 10 Alphabet Entries', () => {
  test('Inspect first 10 Cyrillic alphabet entries', () => {
    const sample = RUSSIAN_ALPHABET.slice(0, 10);
    assert.strictEqual(sample.length, 10);
    sample.forEach((item) => {
      assert.ok(item.upper.length > 0, 'Upper not empty');
      assert.ok(item.lower.length > 0, 'Lower not empty');
      assert.ok(item.latin.length > 0, 'Latin not empty');
      assert.ok(item.vietnamesePronunciation.length > 5, 'Pronunciation explanation substantive');
      assert.ok(item.exampleWordRu.length > 0, 'Example Russian not empty');
      assert.ok(item.exampleWordMeaningVi.length > 0, 'Example Vietnamese not empty');
      assert.doesNotMatch(item.exampleWordMeaningVi, /lorem|ipsum|placeholder/i);
    });
  });
});

describe('Data Quality Spot Check: 20 Vocabulary Entries', () => {
  test('Inspect 20 random/distributed vocabulary entries across categories', () => {
    const indices = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];
    indices.forEach((idx) => {
      const item = RUSSIAN_VOCABULARY[idx];
      assert.ok(item, `Item exists at index ${idx}`);
      assert.ok(item.ru.length > 0, `${item.id}: Russian word not empty`);
      assert.ok(item.pronunciation.length > 0, `${item.id}: Pronunciation aid not empty`);
      assert.ok(item.vi.length > 0, `${item.id}: Vietnamese meaning not empty`);
      assert.doesNotMatch(item.vi, /lorem|ipsum|placeholder|test/i);
      assert.doesNotMatch(item.ru, /lorem|ipsum|placeholder|test/i);
    });
  });
});

describe('Data Quality Spot Check: 15 Phrases', () => {
  test('Inspect 15 phrases across different situations', () => {
    const indices = [0, 3, 7, 10, 14, 18, 22, 26, 30, 35, 39, 43, 46, 49, 52];
    indices.forEach((idx) => {
      const phrase = RUSSIAN_PHRASES[idx];
      assert.ok(phrase, `Phrase exists at index ${idx}`);
      assert.ok(phrase.ru.length > 0, `${phrase.id}: Russian not empty`);
      assert.ok(phrase.pronunciation.length > 0, `${phrase.id}: Pronunciation not empty`);
      assert.ok(phrase.vi.length > 0, `${phrase.id}: Vietnamese not empty`);
      assert.ok(phrase.situation.length > 0, `${phrase.id}: Situation context not empty`);
      assert.doesNotMatch(phrase.vi, /lorem|ipsum|placeholder/i);
    });
  });
});

describe('Data Quality Spot Check: 5 Lessons', () => {
  test('Inspect 5 lessons for comprehensive structure', () => {
    const sampleLessons = [TOPIC_LESSONS[0], TOPIC_LESSONS[4], TOPIC_LESSONS[7], TOPIC_LESSONS[11], TOPIC_LESSONS[15]];
    sampleLessons.forEach((lesson) => {
      assert.ok(lesson.titleVi.length > 0, `${lesson.id}: Vietnamese title not empty`);
      assert.ok(lesson.titleRu.length > 0, `${lesson.id}: Russian title not empty`);
      assert.ok(lesson.descriptionVi.length > 10, `${lesson.id}: Description substantive`);
      assert.ok(lesson.vocabularyIds.length >= 3, `${lesson.id}: Has at least 3 vocabulary IDs`);
      assert.ok(lesson.phraseIds.length >= 2, `${lesson.id}: Has at least 2 phrase IDs`);
      assert.ok(lesson.practiceQuestions.length >= 1, `${lesson.id}: Has practice questions`);
      assert.doesNotMatch(lesson.descriptionVi, /lorem|ipsum|placeholder/i);
    });
  });
});
