/**
 * Practical Russian-Vietnamese Phrases for Living, Transit & Emergency
 * Source: Curated authentic daily communication by Xương Rồng AI developer
 * License: Project Curated / CC BY-SA 4.0
 */
import { DictionaryTopic, CEFRDifficulty } from '../../types';
import { RUSSIAN_PHRASES } from '../../../../modules/learning/data/phrases';

export interface PracticalPhrase {
  id: string;
  ru: string;
  phonetic: string;
  vi: string;
  literalMeaningVi?: string;
  context: string;
  topics: DictionaryTopic[];
  difficulty: CEFRDifficulty;
  sourceRefs: string[];
}

export const PRACTICAL_PHRASES: PracticalPhrase[] = [
  {
    id: 'ph-001',
    ru: 'Здравствуйте!',
    phonetic: 'Zdrav-stvuy-tye',
    vi: 'Xin chào! (trang trọng)',
    literalMeaningVi: 'Chúc sức khỏe!',
    context: 'Lời chào trang trọng gặp người lạ, người lớn tuổi, nhân viên, bác sĩ',
    topics: ['greetings', 'daily-life'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-002',
    ru: 'Привет!',
    phonetic: 'Pri-vyet',
    vi: 'Chào bạn! (thân mật)',
    literalMeaningVi: 'Lời chào thân mật',
    context: 'Chào bạn bè, người đồng trang lứa',
    topics: ['greetings', 'social'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-003',
    ru: 'Большое спасибо!',
    phonetic: 'Bol-shoye spa-si-ba',
    vi: 'Cảm ơn bạn rất nhiều!',
    literalMeaningVi: 'Sự biết ơn to lớn',
    context: 'Cảm ơn khi nhận được sự giúp đỡ',
    topics: ['daily-life', 'communication'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-004',
    ru: 'Пожалуйста',
    phonetic: 'Pa-zhal-sta',
    vi: 'Làm ơn / Xin mời / Không có chi',
    literalMeaningVi: 'Xin vui lòng',
    context: 'Dùng khi nhờ vả hoặc đáp lại lời cảm ơn',
    topics: ['daily-life', 'communication'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-005',
    ru: 'Где находится станция метро?',
    phonetic: 'Gdye na-kho-dit-sya stan-tsi-ya mye-tro?',
    vi: 'Ga tàu điện ngầm ở đâu?',
    literalMeaningVi: 'Trạm metro nằm ở đâu?',
    context: 'Hỏi đường người Nga',
    topics: ['metro', 'transport'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-006',
    ru: 'Сколько стоит один билет?',
    phonetic: 'Skol-ko sto-it a-din bi-lyet?',
    vi: 'Một vé giá bao nhiêu tiền?',
    literalMeaningVi: 'Bao nhiêu tiền một chiếc vé?',
    context: 'Mua vé tàu, xe bus, bảo tàng',
    topics: ['transport', 'shopping'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-007',
    ru: 'Я плохо говорю по-русски',
    phonetic: 'Ya plo-kho ga-va-ryu pa-ru-ski',
    vi: 'Tôi nói tiếng Nga chưa thạo.',
    literalMeaningVi: 'Tôi nói tồi bằng tiếng Nga',
    context: 'Báo cho người đối diện biết để nói chậm lại',
    topics: ['communication', 'daily-life'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-008',
    ru: 'Повторите, пожалуйста, медленнее',
    phonetic: 'Pav-ta-ri-tye pa-zhal-sta myed-lyen-nyee',
    vi: 'Xin hãy nhắc lại chậm hơn một chút.',
    literalMeaningVi: 'Hãy nhắc lại, xin vui lòng, chậm hơn',
    context: 'Khi người Nga nói nhanh khó nghe',
    topics: ['communication'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-009',
    ru: 'Помогите, пожалуйста!',
    phonetic: 'Pa-ma-gi-tye pa-zhal-sta!',
    vi: 'Xin hãy giúp tôi với!',
    literalMeaningVi: 'Hãy giúp tôi, xin vui lòng!',
    context: 'Trường hợp cần trợ giúp ngay lập tức',
    topics: ['emergency', 'daily-life'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-010',
    ru: 'Вызовите скорую помощь!',
    phonetic: 'Vy-za-vi-tye sko-ru-yu po-moshch!',
    vi: 'Hãy gọi xe cứu thương giúp tôi!',
    literalMeaningVi: 'Hãy gọi trợ giúp khẩn cấp!',
    context: 'Tình huống y tế nguy cấp',
    topics: ['emergency', 'hospital', 'health'],
    difficulty: 'A2',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-011',
    ru: 'Мне нужно в больницу',
    phonetic: 'Mnye nuzh-no v bal-ni-tsu',
    vi: 'Tôi cần đến bệnh viện.',
    literalMeaningVi: 'Cần thiết cho tôi đến bệnh viện',
    context: 'Nói với tài xế taxi hoặc người đi đường khi bị bệnh',
    topics: ['hospital', 'health', 'taxi'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-012',
    ru: 'У меня есть регистрация и паспорт',
    phonetic: 'U mye-nya yest re-gi-stra-tsi-ya i pas-part',
    vi: 'Tôi có giấy đăng ký tạm trú và hộ chiếu.',
    literalMeaningVi: 'Ở chỗ tôi có đăng ký và hộ chiếu',
    context: 'Xuất trình giấy tờ cho cảnh sát hoặc cơ quan di trú',
    topics: ['documents', 'migration'],
    difficulty: 'A2',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-013',
    ru: 'Где находится ближайший банкомат?',
    phonetic: 'Gdye na-kho-dit-sya bli-zhay-shiy ban-ka-mat?',
    vi: 'Cây ATM gần nhất ở đâu?',
    literalMeaningVi: 'Máy rút tiền gần nhất ở đâu?',
    context: 'Tìm máy rút tiền hoặc ngân hàng',
    topics: ['banking', 'daily-life'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-014',
    ru: 'Можно оплатить картой?',
    phonetic: 'Mozh-no ap-la-tit kar-tay?',
    vi: 'Có thể thanh toán bằng thẻ được không?',
    literalMeaningVi: 'Có thể thanh toán bằng thẻ?',
    context: 'Hỏi khi tính tiền tại siêu thị, quán ăn',
    topics: ['shopping', 'banking', 'food'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
  {
    id: 'ph-015',
    ru: 'Дайте мне чек, пожалуйста',
    phonetic: 'Day-tye mnye chek pa-zhal-sta',
    vi: 'Cho tôi xin hóa đơn, làm ơn.',
    literalMeaningVi: 'Hãy đưa cho tôi hóa đơn',
    context: 'Yêu cầu hóa đơn thanh toán',
    topics: ['shopping', 'daily-life'],
    difficulty: 'A1',
    sourceRefs: ['project-authored'],
  },
];

const PHRASE_CATEGORY_MAP: Record<string, DictionaryTopic[]> = {
  'Chào hỏi': ['greetings', 'daily-life'],
  'Giới thiệu bản thân': ['social', 'communication'],
  'Giao tiếp': ['communication', 'daily-life'],
  'Taxi': ['taxi', 'transport'],
  'Tàu điện ngầm & Xe buýt': ['metro', 'transport'],
  'Sân bay': ['travel', 'transport'],
  'Khách sạn': ['hotel', 'housing'],
  'Nhà hàng & Ăn uống': ['food', 'restaurant'],
  'Mua sắm': ['shopping', 'money'],
  'Ngân hàng & Tiền tệ': ['banking', 'money'],
  'Chỉ đường': ['directions', 'travel'],
  'Điện thoại & Internet': ['communication', 'daily-life'],
  'Nhà thuốc': ['pharmacy', 'health'],
  'Bệnh viện': ['hospital', 'health'],
  'Cảnh sát & Khẩn cấp': ['emergency', 'documents'],
  'Công việc': ['work', 'documents'],
};

const existingRuSet = new Set(PRACTICAL_PHRASES.map((p) => p.ru.toLowerCase().trim()));
for (const p of RUSSIAN_PHRASES) {
  const key = p.ru.toLowerCase().trim();
  if (!existingRuSet.has(key)) {
    existingRuSet.add(key);
    PRACTICAL_PHRASES.push({
      id: `dict-${p.id}`,
      ru: p.ru,
      phonetic: p.pronunciation,
      vi: p.vi,
      context: p.situation,
      topics: PHRASE_CATEGORY_MAP[p.category] || ['daily-life', 'communication'],
      difficulty: p.isEmergency ? 'A2' : 'A1',
      sourceRefs: ['project-authored'],
    });
  }
}

