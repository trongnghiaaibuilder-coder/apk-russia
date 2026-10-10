/**
 * Russian Verb Conjugation Rules & Aspectual Pairs (Bảng chia động từ tiếng Nga)
 * Source: OpenCorpora & Russian Grammar Reference
 * License: CC0 1.0 Universal / Project Curated
 */

export interface ConjugationPattern {
  conjugationType: '1st' | '2nd' | 'irregular';
  nameVi: string;
  endings: {
    '1stSingular': string; // я
    '2ndSingular': string; // ты
    '3rdSingular': string; // он/она
    '1stPlural': string;   // мы
    '2ndPlural': string;   // вы
    '3rdPlural': string;   // они
  };
  infinitiveSuffixes: string[];
  examples: string[];
}

export const CONJUGATION_PATTERNS: ConjugationPattern[] = [
  {
    conjugationType: '1st',
    nameVi: 'Chia động từ nhóm 1 (Chia theo -е- / -ут, -ют)',
    endings: {
      '1stSingular': '-ю / -у',
      '2ndSingular': '-ешь',
      '3rdSingular': '-ет',
      '1stPlural': '-ем',
      '2ndPlural': '-ете',
      '3rdPlural': '-ют / -ут',
    },
    infinitiveSuffixes: ['-ать', '-ять', '-еть', '-овать', '-нуть'],
    examples: ['работать', 'читать', 'знать', 'понимать', 'гулять'],
  },
  {
    conjugationType: '2nd',
    nameVi: 'Chia động từ nhóm 2 (Chia theo -и- / -ат, -ят)',
    endings: {
      '1stSingular': '-ю / -у',
      '2ndSingular': '-ишь',
      '3rdSingular': '-ит',
      '1stPlural': '-им',
      '2ndPlural': '-ите',
      '3rdPlural': '-ят / -ат',
    },
    infinitiveSuffixes: ['-ить', 'và 11 động từ đặc biệt (-ать, -еть)'],
    examples: ['говорить', 'учить', 'смотреть', 'видеть', 'помнить'],
  },
  {
    conjugationType: 'irregular',
    nameVi: 'Động từ đặc biệt (Bất quy tắc)',
    endings: {
      '1stSingular': 'biến âm',
      '2ndSingular': 'biến âm',
      '3rdSingular': 'biến âm',
      '1stPlural': 'biến âm',
      '2ndPlural': 'biến âm',
      '3rdPlural': 'biến âm',
    },
    infinitiveSuffixes: ['-чь', '-ти', '-зть', '-сть'],
    examples: ['мочь', 'хотеть', 'ехать', 'идти', 'дать', 'есть', 'пить'],
  },
];

export interface AspectualPairRule {
  imperfective: string;
  perfective: string;
  meaningVi: string;
  patternType: 'prefix' | 'suffix' | 'suppletive' | 'stress';
}

export const COMMON_ASPECTUAL_PAIRS: AspectualPairRule[] = [
  { imperfective: 'делать', perfective: 'сделать', meaningVi: 'làm', patternType: 'prefix' },
  { imperfective: 'говорить', perfective: 'сказать', meaningVi: 'nói', patternType: 'suppletive' },
  { imperfective: 'понимать', perfective: 'понять', meaningVi: 'hiểu', patternType: 'suffix' },
  { imperfective: 'покупать', perfective: 'купить', meaningVi: 'mua', patternType: 'suffix' },
  { imperfective: 'платить', perfective: 'заплатить', meaningVi: 'thanh toán, trả tiền', patternType: 'prefix' },
  { imperfective: 'спрашивать', perfective: 'спросить', meaningVi: 'hỏi', patternType: 'suffix' },
  { imperfective: 'отвечать', perfective: 'ответить', meaningVi: 'trả lời', patternType: 'suffix' },
  { imperfective: 'читать', perfective: 'прочитать', meaningVi: 'đọc', patternType: 'prefix' },
  { imperfective: 'писать', perfective: 'написать', meaningVi: 'viết', patternType: 'prefix' },
  { imperfective: 'смотреть', perfective: 'посмотреть', meaningVi: 'nhìn, xem', patternType: 'prefix' },
  { imperfective: 'слушать', perfective: 'послушать', meaningVi: 'lắng nghe', patternType: 'prefix' },
  { imperfective: 'помогать', perfective: 'помочь', meaningVi: 'giúp đỡ', patternType: 'suffix' },
  { imperfective: 'учить', perfective: 'выучить', meaningVi: 'học thuộc, học', patternType: 'prefix' },
  { imperfective: 'открывать', perfective: 'открыть', meaningVi: 'mở', patternType: 'suffix' },
  { imperfective: 'закрывать', perfective: 'закрыть', meaningVi: 'đóng', patternType: 'suffix' },
  { imperfective: 'брать', perfective: 'взять', meaningVi: 'lấy, cầm', patternType: 'suppletive' },
  { imperfective: 'идти', perfective: 'пойти', meaningVi: 'đi (bộ)', patternType: 'prefix' },
  { imperfective: 'ехать', perfective: 'поехать', meaningVi: 'đi (bằng xe)', patternType: 'prefix' },
];
