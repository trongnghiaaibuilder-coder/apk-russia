/**
 * Danh sách địa điểm quan trọng cho người Việt ở Nga.
 * Developer: Xương Rồng AI Developer
 */

export interface KeyPlace {
  id: string;
  nameVi: string;
  nameRu: string;
  addressRu: string;
  category: 'embassy' | 'airport' | 'station' | 'hospital' | 'other';
  phone?: string;
}

export const PLACE_CATEGORIES: Record<string, string> = {
  embassy: 'Đại sứ quán',
  airport: 'Sân bay',
  station: 'Ga tàu',
  hospital: 'Bệnh viện',
  other: 'Khác',
};

export const KEY_PLACES: KeyPlace[] = [
  {
    id: 'embassy-hn',
    nameVi: 'Đại sứ quán Việt Nam tại Moscow',
    nameRu: 'Посольство Вьетнама в Москве',
    addressRu: 'ул. Большая Пироговская, 13, Москва',
    category: 'embassy',
    phone: '+74952456131',
  },
  {
    id: 'airport-svo',
    nameVi: 'Sân bay Sheremetyevo',
    nameRu: 'Аэропорт Шереметьево',
    addressRu: 'Шереметьево, Московская область',
    category: 'airport',
  },
  {
    id: 'airport-dme',
    nameVi: 'Sân bay Domodedovo',
    nameRu: 'Аэропорт Домодедово',
    addressRu: 'Домодедово, Московская область',
    category: 'airport',
  },
  {
    id: 'airport-vko',
    nameVi: 'Sân bay Vnukovo',
    nameRu: 'Аэропорт Внуково',
    addressRu: 'ул. Центральная, 2, Внуково',
    category: 'airport',
  },
  {
    id: 'station-kazan',
    nameVi: 'Ga Kazan (tàu đi các tỉnh)',
    nameRu: 'Казанский вокзал',
    addressRu: 'Комсомольская пл., 2, Москва',
    category: 'station',
  },
  {
    id: 'station-yaroslavl',
    nameVi: 'Ga Yaroslavl (tàu xuyên Siberia)',
    nameRu: 'Ярославский вокзал',
    addressRu: 'Комсомольская пл., 5, Москва',
    category: 'station',
  },
  {
    id: 'hospital-botkin',
    nameVi: 'Bệnh viện Botkin',
    nameRu: 'Больница имени Боткина',
    addressRu: '2-й Боткинский пр., 5, Москва',
    category: 'hospital',
    phone: '+74959450411',
  },
  {
    id: 'red-square',
    nameVi: 'Quảng trường Đỏ',
    nameRu: 'Красная площадь',
    addressRu: 'Красная площадь, Москва',
    category: 'other',
  },
];

/**
 * Tạo link mở Yandex Maps tìm địa điểm.
 */
export function yandexMapsUrl(query: string): string {
  return `https://yandex.com/maps/?text=${encodeURIComponent(query)}`;
}

/**
 * Tạo link mở Google Maps tìm địa điểm.
 */
export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
