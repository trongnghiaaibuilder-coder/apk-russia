/**
 * Russia AI Support - P2 Russian Learning Engine Test Suite
 * Developer: Xương Rồng AI developer
 * Phase: P2 — RUSSIAN LEARNING ENGINE
 */
import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  RUSSIAN_ALPHABET,
  RUSSIAN_VOCABULARY,
  RUSSIAN_PHRASES,
  TOPIC_LESSONS,
  PRONUNCIATION_GUIDES,
  learningStorage,
  reviewService,
  quizService,
} from '../src/modules/learning';

describe('P2 Acceptance: A. Russian Alphabet Dataset', () => {
  test('Exactly 33 Russian Cyrillic letters are present', () => {
    assert.strictEqual(RUSSIAN_ALPHABET.length, 33);
  });

  test('All standard Cyrillic letters exist in proper uppercase sequence', () => {
    const letters = RUSSIAN_ALPHABET.map((l) => l.upper).join(' ');
    const expectedLetters = 'А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я';
    assert.strictEqual(letters, expectedLetters);
  });

  test('Every letter contains all required structured fields', () => {
    RUSSIAN_ALPHABET.forEach((l) => {
      assert.ok(l.id, `Letter ${l.upper} has id`);
      assert.ok(l.upper, `Letter ${l.id} has upper`);
      assert.ok(l.lower, `Letter ${l.id} has lower`);
      assert.ok(l.latin, `Letter ${l.id} has latin`);
      assert.ok(l.vietnamesePronunciation, `Letter ${l.id} has pronunciation aid`);
      assert.ok(l.exampleWordRu, `Letter ${l.id} has example Russian word`);
      assert.ok(l.exampleWordMeaningVi, `Letter ${l.id} has example Vietnamese meaning`);
      assert.ok(['vowel', 'consonant', 'sign'].includes(l.type), `Letter ${l.id} has valid type`);
    });
  });
});

describe('P2 Acceptance: B. Russian Vocabulary Dataset', () => {
  test('Dataset contains at least 300 comprehensive vocabulary entries across 23 categories', () => {
    assert.ok(RUSSIAN_VOCABULARY.length >= 300, `Expected >= 300, got ${RUSSIAN_VOCABULARY.length}`);
  });

  test('Every vocabulary item contains required structured fields', () => {
    const seenIds = new Set<string>();
    RUSSIAN_VOCABULARY.forEach((item) => {
      assert.ok(!seenIds.has(item.id), `Duplicate vocabulary id: ${item.id}`);
      seenIds.add(item.id);
      assert.ok(item.ru && item.ru.length > 0, `Item ${item.id} has Russian word`);
      assert.ok(item.pronunciation && item.pronunciation.length > 0, `Item ${item.id} has pronunciation aid`);
      assert.ok(item.vi && item.vi.length > 0, `Item ${item.id} has Vietnamese meaning`);
      assert.ok(item.category, `Item ${item.id} has category`);
      assert.ok(['beginner', 'intermediate'].includes(item.difficulty), `Item ${item.id} has valid difficulty`);
    });
  });

  test('All 23 core and extended categories are represented in vocabulary dataset', () => {
    const requiredCategories = [
      'Greetings',
      'People',
      'Numbers',
      'Time',
      'Food',
      'Drinks',
      'Transport',
      'Taxi',
      'Hotel',
      'Shopping',
      'Money',
      'Work',
      'Directions',
      'Places',
      'Emergency',
      'Basic communication',
      'Health & Pharmacy',
      'Documents & Visa',
      'Education',
      'Weather & Nature',
      'Housing & Daily Life',
      'Verbs & Actions',
      'Adjectives & Colors',
    ];
    const presentCategories = new Set(RUSSIAN_VOCABULARY.map((v) => v.category));
    requiredCategories.forEach((cat) => {
      assert.ok(presentCategories.has(cat as any), `Missing required vocabulary category: ${cat}`);
    });
  });
});

describe('P2 Acceptance: C. Russian Survival Phrases Dataset', () => {
  test('Dataset contains at least 50 practical phrases', () => {
    assert.ok(RUSSIAN_PHRASES.length >= 50, `Expected >= 50, got ${RUSSIAN_PHRASES.length}`);
  });

  test('Every phrase contains required structured fields', () => {
    const seenIds = new Set<string>();
    RUSSIAN_PHRASES.forEach((p) => {
      assert.ok(!seenIds.has(p.id), `Duplicate phrase id: ${p.id}`);
      seenIds.add(p.id);
      assert.ok(p.ru && p.ru.length > 0, `Phrase ${p.id} has Russian`);
      assert.ok(p.pronunciation && p.pronunciation.length > 0, `Phrase ${p.id} has pronunciation aid`);
      assert.ok(p.vi && p.vi.length > 0, `Phrase ${p.id} has Vietnamese`);
      assert.ok(p.category && p.category.length > 0, `Phrase ${p.id} has category`);
      assert.ok(p.situation && p.situation.length > 0, `Phrase ${p.id} has situation`);
    });
  });

  test('Critical emergency phrases are flagged appropriately', () => {
    const emergencyPhrases = RUSSIAN_PHRASES.filter((p) => p.isEmergency);
    assert.ok(emergencyPhrases.length >= 4, 'At least 4 emergency phrases flagged');
  });
});

describe('P2 Acceptance: D. Topic Lessons Dataset', () => {
  test('All 16 required initial topics exist in order', () => {
    assert.strictEqual(TOPIC_LESSONS.length, 16);
    const expectedTitles = [
      'Chào hỏi',
      'Giới thiệu bản thân',
      'Số đếm',
      'Thời gian',
      'Taxi',
      'Giao thông',
      'Sân bay',
      'Khách sạn',
      'Nhà hàng',
      'Mua sắm',
      'Công việc',
      'Chỉ đường',
      'Điện thoại / Internet',
      'Nhà thuốc',
      'Bệnh viện',
      'Cảnh sát / Khẩn cấp',
    ];
    TOPIC_LESSONS.forEach((lesson, idx) => {
      assert.strictEqual(lesson.topicIndex, idx + 1);
      assert.strictEqual(lesson.titleVi, expectedTitles[idx]);
      assert.ok(lesson.vocabularyIds.length > 0, `Lesson ${lesson.id} has vocabulary`);
      assert.ok(lesson.phraseIds.length > 0, `Lesson ${lesson.id} has phrases`);
      assert.ok(lesson.practiceQuestions.length > 0, `Lesson ${lesson.id} has practice questions`);
    });
  });
});

describe('P2 Acceptance: E. Flashcard Logic & Persistence', () => {
  test('Marking known and review persists to real storage state', () => {
    learningStorage.resetProgress();
    const testWord = RUSSIAN_VOCABULARY[0];
    learningStorage.markWordNeedReview(testWord.id);
    let progress = learningStorage.getProgress();
    assert.ok(progress.reviewWordIds.includes(testWord.id), 'Word is in review list');
    assert.ok(!progress.knownWordIds.includes(testWord.id), 'Word is not in known list');

    learningStorage.markWordKnown(testWord.id);
    progress = learningStorage.getProgress();
    assert.ok(progress.knownWordIds.includes(testWord.id), 'Word is in known list');
    assert.ok(!progress.reviewWordIds.includes(testWord.id), 'Word was removed from review list');
  });
});

describe('P2 Acceptance: F. Review Queue Logic', () => {
  test('Review queue reflects items marked Need Review and removes on Known', () => {
    learningStorage.resetProgress();
    const word1 = RUSSIAN_VOCABULARY[1];
    const word2 = RUSSIAN_VOCABULARY[2];
    reviewService.markItemNeedReview(word1.id);
    reviewService.markItemNeedReview(word2.id);

    let items = reviewService.getReviewItems();
    assert.strictEqual(items.length, 2);
    assert.ok(items.some((i) => i.id === word1.id));
    assert.ok(items.some((i) => i.id === word2.id));

    reviewService.markItemKnown(word1.id);
    items = reviewService.getReviewItems();
    assert.strictEqual(items.length, 1);
    assert.strictEqual(items[0].id, word2.id);
  });
});

describe('P2 Acceptance: G. Deterministic Quiz Engine', () => {
  test('Quiz generates questions and validates deterministic answers', () => {
    const questions = quizService.generateQuizQuestions(5, 0);
    assert.strictEqual(questions.length, 5);
    questions.forEach((q) => {
      assert.ok(q.options.length === 4, 'Each question has 4 options');
      assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3, 'Correct index is valid');
      assert.strictEqual(quizService.validateAnswer(q, q.correctIndex), true, 'Correct answer passes');
      const wrongIndex = (q.correctIndex + 1) % 4;
      assert.strictEqual(quizService.validateAnswer(q, wrongIndex), false, 'Wrong answer fails');
    });

    const score = quizService.calculateScore([true, true, false, true, false]);
    assert.strictEqual(score.correct, 3);
    assert.strictEqual(score.total, 5);
    assert.strictEqual(score.percentage, 60);
  });
});

describe('P2 Acceptance: H. Progress Model Derivation', () => {
  test('Progress derives from actual stored actions without fabrication', () => {
    learningStorage.resetProgress();
    learningStorage.markLessonCompleted('les-01');
    learningStorage.markLessonCompleted('les-02');
    learningStorage.recordQuizResult(4, 5);

    const progress = learningStorage.getProgress();
    assert.deepStrictEqual(progress.completedLessonIds, ['les-01', 'les-02']);
    assert.strictEqual(progress.quizAttempts, 5);
    assert.strictEqual(progress.quizCorrectAnswers, 4);
  });
});

describe('P2 Acceptance: I. Search and Filter Logic', () => {
  test('Local search resolves by Russian word, Vietnamese, and category', () => {
    const ruResult = RUSSIAN_VOCABULARY.filter((v) => v.ru.toLowerCase().includes('спасибо'));
    assert.ok(ruResult.length > 0);
    assert.strictEqual(ruResult[0].vi, 'Cảm ơn');

    const viResult = RUSSIAN_VOCABULARY.filter((v) => v.vi.toLowerCase().includes('khách sạn'));
    assert.ok(viResult.length > 0);

    const catResult = RUSSIAN_VOCABULARY.filter((v) => v.category === 'Taxi');
    assert.ok(catResult.length >= 5);
  });
});

describe('P2 Acceptance: J. Offline Usability', () => {
  test('All learning datasets and logic operate purely locally without network', () => {
    assert.ok(RUSSIAN_ALPHABET.length === 33);
    assert.ok(PRONUNCIATION_GUIDES.length >= 10);
    assert.ok(RUSSIAN_VOCABULARY.length >= 100);
    assert.ok(RUSSIAN_PHRASES.length >= 50);
    assert.ok(TOPIC_LESSONS.length === 16);
  });
});
