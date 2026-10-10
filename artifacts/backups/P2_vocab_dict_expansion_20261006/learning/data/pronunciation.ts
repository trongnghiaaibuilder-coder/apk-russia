/**
 * Russian Pronunciation Foundation Dataset
 * Developer: Xương Rồng AI developer
 */
import { PronunciationGuideItem } from '../types';

export const PRONUNCIATION_GUIDES: PronunciationGuideItem[] = [
  {
    id: 'pr-vowels',
    soundRu: 'А, О, У, Э, Ы',
    name: '5 Nguyên âm cứng cơ bản',
    category: 'vowels',
    descriptionVi: 'Nhóm nguyên âm phát âm trực tiếp, rõ ràng, không làm mềm phụ âm đứng trước.',
    howToPronounceVi: 'Khẩu hình mở như tiếng Việt. Lưu ý quy tắc giảm âm "O": khi không mang trọng âm, chữ "O" đọc giảm thành "A" nhẹ (Москва -> Mas-kva).',
    examples: [
      { ru: 'Мама', pronunciation: 'Ma-ma', vi: 'Mẹ' },
      { ru: 'Москва', pronunciation: 'Mas-kva', vi: 'Thủ đô Mat-xcơ-va' },
      { ru: 'Утро', pronunciation: 'U-tra', vi: 'Buổi sáng' },
    ],
  },
  {
    id: 'pr-iotated',
    soundRu: 'Я, Е, Ё, Ю',
    name: '4 Nguyên âm iot hóa (I-lướt)',
    category: 'iotated',
    descriptionVi: 'Là các nguyên âm ghép có âm lướt [y] kết hợp nguyên âm gốc.',
    howToPronounceVi: 'Khi đứng đầu từ hoặc sau nguyên âm khác, đọc có âm "y" lướt: Я = [ya], Е = [ye], Ё = [yo], Ю = [yu]. Khi đứng sau phụ âm, chúng làm mềm phụ âm trước đó.',
    examples: [
      { ru: 'Я', pronunciation: 'Ya', vi: 'Tôi' },
      { ru: 'Если', pronunciation: 'Yes-li', vi: 'Nếu như' },
      { ru: 'Ёлка', pronunciation: 'Yol-ka', vi: 'Cây thông' },
      { ru: 'Юрист', pronunciation: 'Yu-rist', vi: 'Luật sư' },
    ],
  },
  {
    id: 'pr-y-sound',
    soundRu: 'Ы',
    name: 'Âm Y (Nguyên âm đặc trưng)',
    category: 'difficult_sounds',
    descriptionVi: 'Âm thanh khó đối với người Việt, không tương đương hoàn toàn âm nào trong tiếng Việt.',
    howToPronounceVi: 'Khẩu hình chuẩn bị đọc âm "i" nhưng rút cuống lưỡi thụt lùi ra sau như khi phát âm "ư". Phát âm chắc, sâu trong cổ họng, không tròn môi.',
    examples: [
      { ru: 'Мы', pronunciation: 'My (M-ư-i)', vi: 'Chúng tôi' },
      { ru: 'Вы', pronunciation: 'Vy (V-ư-i)', vi: 'Bạn / Các bạn (lịch sự)' },
      { ru: 'Сыр', pronunciation: 'Syr', vi: 'Phô mai' },
    ],
  },
  {
    id: 'pr-zh-sound',
    soundRu: 'Ж',
    name: 'Phụ âm Zh (Âm vo ve cuống họng)',
    category: 'difficult_sounds',
    descriptionVi: 'Phụ âm hữu thanh, luôn luôn cứng trong tiếng Nga chuẩn.',
    howToPronounceVi: 'Uốn cong đầu lưỡi lên vòm họng trên, không chạm, đẩy luồng hơi ra đồng thời rung dây thanh âm (như tiếng con ong vo ve trầm).',
    examples: [
      { ru: 'Жизнь', pronunciation: 'Zhyzn', vi: 'Cuộc sống' },
      { ru: 'Журнал', pronunciation: 'Zhur-nal', vi: 'Tạp chí' },
      { ru: 'Тоже', pronunciation: 'To-zhe', vi: 'Cũng vậy' },
    ],
  },
  {
    id: 'pr-kh-sound',
    soundRu: 'Х',
    name: 'Phụ âm Kh (Ma sát cuống họng)',
    category: 'consonants',
    descriptionVi: 'Tương tự âm "kh" tiếng Việt nhưng phát sâu ở đáy cuống họng hơn.',
    howToPronounceVi: 'Nâng cuống lưỡi lên chạm nhẹ vòm mềm, đẩy luồng hơi mạnh tạo tiếng cọ sát gió (như khi hà hơi sưởi ấm tay mùa đông).',
    examples: [
      { ru: 'Хорошо', pronunciation: 'Kha-ra-sho', vi: 'Tốt, ổn' },
      { ru: 'Хлеб', pronunciation: 'Khlyep', vi: 'Bánh mì' },
    ],
  },
  {
    id: 'pr-ts-sound',
    soundRu: 'Ц',
    name: 'Phụ âm Ts (Ghép t + s)',
    category: 'difficult_sounds',
    descriptionVi: 'Phụ âm tắc - xát vô thanh, luôn luôn cứng.',
    howToPronounceVi: 'Đầu lưỡi chạm chân răng trên phát âm "t", sau đó nhanh chóng bật tách ra luồng hơi "s" liền mạch, dứt khoát không ngắt quãng.',
    examples: [
      { ru: 'Центр', pronunciation: 'Tsen-tr', vi: 'Trung tâm' },
      { ru: 'Цена', pronunciation: 'Tse-na', vi: 'Giá cả' },
      { ru: 'Улица', pronunciation: 'U-li-tsa', vi: 'Đường phố' },
    ],
  },
  {
    id: 'pr-ch-sound',
    soundRu: 'Ч',
    name: 'Phụ âm Ch (Luôn luôn mềm)',
    category: 'consonants',
    descriptionVi: 'Phụ âm vô thanh, trong tiếng Nga luôn luôn được phát âm mềm.',
    howToPronounceVi: 'Gần giống "ch" tiếng Việt nhưng môi hơi mở rộng làm miệng căng, tạo âm thanh nhẹ dịu.',
    examples: [
      { ru: 'Чай', pronunciation: 'Chay', vi: 'Trà' },
      { ru: 'Час', pronunciation: 'Chas', vi: 'Giờ' },
      { ru: 'Очень', pronunciation: 'O-chyen', vi: 'Rất' },
    ],
  },
  {
    id: 'pr-sh-vs-shch',
    soundRu: 'Ш vs Щ',
    name: 'Cặp phụ âm Sh (Cứng) vs Shch (Mềm)',
    category: 'difficult_sounds',
    descriptionVi: 'Hai âm dễ nhầm lẫn nhưng cấu trúc phát âm trái ngược nhau.',
    howToPronounceVi: 'Ш (Cứng): Lưỡi cong hướng ra sau, môi nhô ra, âm trầm đục. Щ (Mềm): Mặt lưỡi nâng cao ép sát vòm cứng trên, miệng dẹt sang hai bên, âm thanh nhẹ như "si-xi" gió mềm.',
    examples: [
      { ru: 'Школа (cứng)', pronunciation: 'Shko-la', vi: 'Trường học' },
      { ru: 'Борщ (mềm)', pronunciation: 'Borshch', vi: 'Món súp Borscht' },
      { ru: 'Вещь (mềm)', pronunciation: 'Vyeshch', vi: 'Đồ vật' },
    ],
  },
  {
    id: 'pr-signs',
    soundRu: 'Ь & Ъ',
    name: 'Dấu mềm (Ь) và Dấu cứng (Ъ)',
    category: 'signs',
    descriptionVi: 'Hai ký tự không có âm đọc riêng nhưng làm thay đổi tính chất phát âm của phụ âm xung quanh.',
    howToPronounceVi: 'Dấu mềm (Ь): Làm phụ âm đứng trước nó phát âm mềm mượt hơn bình thường. Dấu cứng (Ъ): Ngăn cách phát âm, ép phụ âm trước phải đọc cứng ngắt quãng dứt khoát không dính liền.',
    examples: [
      { ru: 'Мать (t mềm)', pronunciation: 'Mat (t mềm)', vi: 'Mẹ' },
      { ru: 'Подъезд (d cứng)', pronunciation: 'Pad-yezd', vi: 'Lối vào chung cư' },
    ],
  },
  {
    id: 'pr-j-sound',
    soundRu: 'Й',
    name: 'Bán nguyên âm Й (I ngắn)',
    category: 'consonants',
    descriptionVi: 'Không tạo thành một âm tiết, đóng vai trò như âm "y" trong tiếng Việt.',
    howToPronounceVi: 'Phát âm cực ngắn, không kéo dài, thường đứng sau nguyên âm để tạo thành nguyên âm đôi.',
    examples: [
      { ru: 'Мой', pronunciation: 'Moy', vi: 'Của tôi' },
      { ru: 'Музей', pronunciation: 'Mu-zyey', vi: 'Bảo tàng' },
      { ru: 'Добрый', pronunciation: 'Dob-ry', vi: 'Tốt lành' },
    ],
  },
];
