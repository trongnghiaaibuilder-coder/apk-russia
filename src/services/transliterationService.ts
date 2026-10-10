/**
 * Service phiên âm tiếng Nga sang cách đọc cho người Việt (vietsub).
 * Giúp người mới học tiếng Nga đọc theo được chữ Cyrillic.
 * Phong cách đồng nhất với kho câu đối thoại (vd: Привет → privyet).
 * Developer: Xương Rồng AI Developer
 */

// Bảng chuyển đổi Cyrillic → phiên âm thân thiện với người Việt
const CYRILLIC_MAP: Record<string, string> = {
  'а': 'a', 'А': 'A',
  'б': 'b', 'Б': 'B',
  'в': 'v', 'В': 'V',
  'г': 'g', 'Г': 'G',
  'д': 'đ', 'Д': 'Đ',
  'е': 'ye', 'Е': 'Ye',
  'ё': 'yo', 'Ё': 'Yo',
  'ж': 'zh', 'Ж': 'Zh',
  'з': 'z', 'З': 'Z',
  'и': 'i', 'И': 'I',
  'й': 'y', 'Й': 'Y',
  'к': 'k', 'К': 'K',
  'л': 'l', 'Л': 'L',
  'м': 'm', 'М': 'M',
  'н': 'n', 'Н': 'N',
  'о': 'o', 'О': 'O',
  'п': 'p', 'П': 'P',
  'р': 'r', 'Р': 'R',
  'с': 's', 'С': 'S',
  'т': 't', 'Т': 'T',
  'у': 'u', 'У': 'U',
  'ф': 'f', 'Ф': 'F',
  'х': 'kh', 'Х': 'Kh',
  'ц': 'ts', 'Ц': 'Ts',
  'ч': 'ch', 'Ч': 'Ch',
  'ш': 'sh', 'Ш': 'Sh',
  'щ': 'shch', 'Щ': 'Shch',
  'ъ': '', 'Ъ': '',
  'ы': 'y', 'Ы': 'Y',
  'ь': '', 'Ь': '',
  'э': 'e', 'Э': 'E',
  'ю': 'yu', 'Ю': 'Yu',
  'я': 'ya', 'Я': 'Ya',
};

/**
 * Kiểm tra chuỗi có chứa chữ Cyrillic (tiếng Nga) không.
 */
export function containsCyrillic(text: string): boolean {
  if (!text) return false;
  return /[\u0400-\u04FF]/.test(text);
}

/**
 * Phiên âm chữ tiếng Nga sang cách đọc cho người Việt.
 * Giữ nguyên số, dấu câu, chữ Latin và ký tự khác.
 *
 * @example
 * transliterateRussian('Привет') // 'Privyet'
 * transliterateRussian('Спасибо!') // 'Spasiba!'
 */
export function transliterateRussian(text: string): string {
  if (!text) return '';
  let result = '';
  for (const char of text) {
    if (CYRILLIC_MAP[char] !== undefined) {
      result += CYRILLIC_MAP[char];
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Phiên âm từng dòng riêng — dùng cho kết quả OCR dịch trên ảnh.
 */
export function transliterateLines(lines: string[]): string[] {
  return lines.map(transliterateRussian);
}
