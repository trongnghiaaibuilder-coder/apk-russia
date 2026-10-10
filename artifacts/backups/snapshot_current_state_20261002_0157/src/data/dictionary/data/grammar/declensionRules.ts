/**
 * Russian Declension Grammar Patterns & Rules (Bảng biến cách tiếng Nga)
 * Source: OpenCorpora & Russian Grammar Reference
 * License: CC0 1.0 Universal / Project Curated
 */

export interface CaseRule {
  caseName: 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional';
  russianName: string;
  vietnameseName: string;
  questionRu: string;
  questionVi: string;
  prepositions: string[];
  primaryUsage: string;
  endings: {
    mascSingular: string[];
    femSingular: string[];
    neutSingular: string[];
    plural: string[];
  };
}

export const RUSSIAN_CASES: CaseRule[] = [
  {
    caseName: 'nominative',
    russianName: 'Именительный падеж (И.п.)',
    vietnameseName: 'Cách 1: Chủ cách',
    questionRu: 'Кто? Что?',
    questionVi: 'Ai? Cái gì?',
    prepositions: [],
    primaryUsage: 'Chủ ngữ trong câu, từ điển, và sau động từ "đây là" (это).',
    endings: {
      mascSingular: ['-ø (phụ âm)', '-й', '-ь'],
      femSingular: ['-а', '-я', '-ь'],
      neutSingular: ['-о', '-е', '-мя'],
      plural: ['-ы', '-и', '-а', '-я'],
    },
  },
  {
    caseName: 'genitive',
    russianName: 'Родительный падеж (Р.п.)',
    vietnameseName: 'Cách 2: Sinh cách',
    questionRu: 'Кого? Чего?',
    questionVi: 'Của ai? Cái gì? Không có ai? Của ai?',
    prepositions: ['у', 'без', 'для', 'до', 'из', 'от', 'с', 'после', 'около', 'кроме'],
    primaryUsage: 'Sở hữu (nhà của ai), sự vắng mặt/không có (нет...), chỉ số lượng sau số đếm, điểm xuất phát (из/с).',
    endings: {
      mascSingular: ['-а', '-я'],
      femSingular: ['-ы', '-и'],
      neutSingular: ['-а', '-я'],
      plural: ['-ов', '-ев', '-ей', '-ø'],
    },
  },
  {
    caseName: 'dative',
    russianName: 'Дательный падеж (Д.п.)',
    vietnameseName: 'Cách 3: Dữ cách',
    questionRu: 'Кому? Чему?',
    questionVi: 'Cho ai? Đến ai? Hướng nào?',
    prepositions: ['к', 'по', 'благодаря'],
    primaryUsage: 'Bổ ngữ gián tiếp (cho/tặng/nói với ai: сказать мне), trạng thái tâm lý (мне холодно), tuổi (мне 25 лет).',
    endings: {
      mascSingular: ['-у', '-ю'],
      femSingular: ['-е', '-и'],
      neutSingular: ['-у', '-ю'],
      plural: ['-ам', '-ям'],
    },
  },
  {
    caseName: 'accusative',
    russianName: 'Винительный падеж (В.п.)',
    vietnameseName: 'Cách 4: Đối cách',
    questionRu: 'Кого? Что? Куда?',
    questionVi: 'Ai? Cái gì (bị tác động)? Đi đâu?',
    prepositions: ['в', 'на', 'за', 'через', 'под'],
    primaryUsage: 'Bổ ngữ trực tiếp của ngoại động từ (chịu tác động), hướng chuyển động (đi vào đâu: в/на + C4).',
    endings: {
      mascSingular: ['-ø (vô sinh = C1)', '-а/-я (hữu sinh = C2)'],
      femSingular: ['-у', '-ю', '-ь'],
      neutSingular: ['-о', '-е'],
      plural: ['= C1 (vô sinh)', '= C2 (hữu sinh)'],
    },
  },
  {
    caseName: 'instrumental',
    russianName: 'Творительный падеж (Т.п.)',
    vietnameseName: 'Cách 5: Công cụ cách',
    questionRu: 'Кем? Чем? С кем?',
    questionVi: 'Bởi ai? Bằng cái gì? Cùng với ai?',
    prepositions: ['с (cùng với)', 'под', 'над', 'перед', 'за', 'между'],
    primaryUsage: 'Công cụ hành động (viết bằng bút), cùng với ai (с другом), nghề nghiệp/trạng thái sau быть, стать.',
    endings: {
      mascSingular: ['-ом', '-ем', '-ём'],
      femSingular: ['-ой', '-ей', '-ью'],
      neutSingular: ['-ом', '-ем'],
      plural: ['-ами', '-ями'],
    },
  },
  {
    caseName: 'prepositional',
    russianName: 'Предложный падеж (П.п.)',
    vietnameseName: 'Cách 6: Giới cách',
    questionRu: 'О ком? О чём? Где?',
    questionVi: 'Về ai? Về cái gì? Ở đâu?',
    prepositions: ['в (trong)', 'на (trên)', 'о/об (về)'],
    primaryUsage: 'Chỉ địa điểm (ở đâu: в Москве, на вокзале), chỉ đề tài suy nghĩ/nói chuyện (nghĩ về: о друге).',
    endings: {
      mascSingular: ['-е', '-ии', '-у (địa điểm đặc biệt)'],
      femSingular: ['-е', '-ии'],
      neutSingular: ['-е', '-ии'],
      plural: ['-ах', '-ях'],
    },
  },
];
