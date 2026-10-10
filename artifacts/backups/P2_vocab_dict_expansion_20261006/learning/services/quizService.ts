/**
 * Quiz Engine Service (Deterministic local quizzes)
 * Developer: Xương Rồng AI developer
 */
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { RUSSIAN_PHRASES } from '../data/phrases';
import { QuizQuestion } from '../types';

export const quizService = {
  generateQuizQuestions(count = 10, offset = 0): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const totalVocab = RUSSIAN_VOCABULARY.length;
    const totalPhrases = RUSSIAN_PHRASES.length;

    for (let i = 0; i < count; i++) {
      const idx = (offset + i) % totalVocab;
      const isVocab = i % 2 === 0;

      if (isVocab) {
        const target = RUSSIAN_VOCABULARY[idx];
        const distractor1 = RUSSIAN_VOCABULARY[(idx + 1) % totalVocab];
        const distractor2 = RUSSIAN_VOCABULARY[(idx + 2) % totalVocab];
        const distractor3 = RUSSIAN_VOCABULARY[(idx + 3) % totalVocab];

        if (i % 4 === 0) {
          questions.push({
            id: `gen-ru-vi-${target.id}-${i}`,
            type: 'ru_to_vi',
            question: `Nghĩa tiếng Việt của từ "${target.ru}" là gì?`,
            prompt: target.ru,
            options: [target.vi, distractor1.vi, distractor2.vi, distractor3.vi],
            correctIndex: 0,
            explanationVi: `"${target.ru}" phát âm là [${target.pronunciation}], nghĩa là: ${target.vi}.`,
          });
        } else {
          questions.push({
            id: `gen-vi-ru-${target.id}-${i}`,
            type: 'vi_to_ru',
            question: `Từ tiếng Nga nào mang nghĩa "${target.vi}"?`,
            prompt: target.vi,
            options: [distractor1.ru, target.ru, distractor2.ru, distractor3.ru],
            correctIndex: 1,
            explanationVi: `"${target.vi}" trong tiếng Nga là "${target.ru}" [${target.pronunciation}].`,
          });
        }
      } else {
        const phraseIdx = (offset + i) % totalPhrases;
        const phrase = RUSSIAN_PHRASES[phraseIdx];
        const dist1 = RUSSIAN_PHRASES[(phraseIdx + 1) % totalPhrases];
        const dist2 = RUSSIAN_PHRASES[(phraseIdx + 2) % totalPhrases];
        const dist3 = RUSSIAN_PHRASES[(phraseIdx + 3) % totalPhrases];

        questions.push({
          id: `gen-phr-${phrase.id}-${i}`,
          type: 'phrase_meaning',
          question: `Câu tiếng Nga "${phrase.ru}" có nghĩa là gì?`,
          prompt: phrase.ru,
          options: [dist1.vi, dist2.vi, phrase.vi, dist3.vi],
          correctIndex: 2,
          explanationVi: `"${phrase.ru}" [${phrase.pronunciation}] nghĩa là "${phrase.vi}". Ngữ cảnh: ${phrase.situation}.`,
        });
      }
    }

    return questions;
  },

  validateAnswer(question: QuizQuestion, selectedIndex: number): boolean {
    return selectedIndex === question.correctIndex;
  },

  calculateScore(results: boolean[]): { correct: number; total: number; percentage: number } {
    const total = results.length;
    const correct = results.filter(Boolean).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  },
};
