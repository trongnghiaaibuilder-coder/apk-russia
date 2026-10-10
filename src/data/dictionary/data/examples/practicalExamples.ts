/**
 * Practical Grounded Examples for Russian Lexicon
 * Source: Curated situational examples with authentic context
 * License: Project Curated
 */
import { DictionaryExample } from '../../types';

export const PRACTICAL_EXAMPLES: DictionaryExample[] = [
  {
    id: 'ex-001',
    ru: 'В Москве метро работает очень быстро.',
    vi: 'Ở Moskva, tàu điện ngầm chạy rất nhanh chóng.',
    grammarTags: ['prepositional_case', 'adverb', 'adjective_neuter'],
    topics: ['metro', 'transport'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-002',
    ru: 'Врач выписал мне рецепт на антибиотики.',
    vi: 'Bác sĩ đã kê cho tôi đơn thuốc kháng sinh.',
    grammarTags: ['past_tense', 'dative_case', 'accusative_case'],
    topics: ['hospital', 'pharmacy', 'health'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-003',
    ru: 'Пожалуйста, покажите ваш паспорт и миграционную карту.',
    vi: 'Xin vui lòng cho xem hộ chiếu và thẻ di trú.',
    grammarTags: ['imperative', 'accusative_case'],
    topics: ['documents', 'migration'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-004',
    ru: 'Я работаю на складе каждый день.',
    vi: 'Tôi làm việc ở kho hàng mỗi ngày.',
    grammarTags: ['present_tense_1st', 'prepositional_case'],
    topics: ['work', 'daily-life'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-005',
    ru: 'Сколько рублей стоит эта шапка?',
    vi: 'Chiếc mũ này giá bao nhiêu rúp?',
    grammarTags: ['genitive_plural', 'nominative_singular'],
    topics: ['shopping', 'food', 'banking'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-006',
    ru: 'Вы говорите по-русски или по-вьетнамски?',
    vi: 'Bạn nói tiếng Nga hay tiếng Việt?',
    grammarTags: ['present_tense_2nd_pl', 'adverbs_language'],
    topics: ['communication', 'social'],
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ex-007',
    ru: 'Мы живём в общежитии около станции метро.',
    vi: 'Chúng tôi sống trong ký túc xá gần ga tàu điện ngầm.',
    grammarTags: ['present_tense_1st_pl', 'prepositional_case', 'genitive_case'],
    topics: ['housing', 'metro'],
    sourceRefs: ['project-authored'],
  },
];
