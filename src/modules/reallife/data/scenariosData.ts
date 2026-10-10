/**
 * Russia AI Support - Real-Life Scenarios & Emergency Dataset
 * Developer: Xương Rồng AI developer
 * Phase: P7 — REAL-LIFE RUSSIA SUPPORT
 */

import { RealLifeScenario, EmergencyContact, RealLifePhrase } from '../types';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em_112',
    nameVi: 'Tổng đài Cứu nạn Quốc gia LB Nga',
    nameRu: 'Единая служба спасения 112',
    phone: '112',
    descriptionVi: 'Số khẩn cấp tích hợp gọi được ngay cả khi không có SIM, không có sóng mạng hoặc bị khóa màn hình.',
    isNationalEmergency: true
  },
  {
    id: 'em_103',
    nameVi: 'Cấp cứu Y tế nhanh (Xe cứu thương)',
    nameRu: 'Скорая медицинская помощь',
    phone: '103',
    descriptionVi: 'Gọi cứu thương khi gặp tai nạn, đột quỵ, chấn thương hoặc sốt co giật nguy kịch.',
    isNationalEmergency: true
  },
  {
    id: 'em_102',
    nameVi: 'Cảnh sát Liên bang Nga',
    nameRu: 'Полиция России',
    phone: '102',
    descriptionVi: 'Gọi khi bị cướp giật, hành hung, đe dọa an ninh trật tự hoặc phát hiện đồ vật khả nghi.',
    isNationalEmergency: true
  },
  {
    id: 'em_101',
    nameVi: 'Cứu hỏa & Cứu nạn khẩn cấp',
    nameRu: 'Пожарная охрана и МЧС',
    phone: '101',
    descriptionVi: 'Báo cháy nổ, tai nạn sập đổ công trình, rò rỉ khí gas.',
    isNationalEmergency: true
  },
  {
    id: 'em_embassy_vn',
    nameVi: 'Đại sứ quán Việt Nam tại Moskva (Bảo hộ công dân)',
    nameRu: 'Посольство Вьетнама в Москве',
    phone: '+7 499 245 10 92',
    descriptionVi: 'Hỗ trợ công dân Việt Nam bị mất hộ chiếu, tai nạn, pháp lý hoặc tình huống khẩn cấp tại Nga.',
    isNationalEmergency: false
  },
  {
    id: 'em_consulate_vladivostok',
    nameVi: 'Tổng Lãnh sự quán Việt Nam tại Vladivostok',
    nameRu: 'Генеральное консульство Вьетнама во Владивостоке',
    phone: '+7 423 222 69 48',
    descriptionVi: 'Hỗ trợ công dân khu vực Viễn Đông nước Nga.',
    isNationalEmergency: false
  }
];

export const REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: 'sc_emergency',
    titleVi: 'Khẩn cấp & Cứu nạn',
    titleRu: 'Экстренная помощь и безопасность',
    category: 'emergency',
    categoryLabelVi: 'Khẩn cấp',
    descriptionVi: 'Các câu cầu cứu tức thì khi gặp tai nạn, hỏa hoạn, mất giấy tờ hoặc cần cảnh sát can thiệp.',
    iconName: 'ShieldAlert',
    tipsVi: [
      'Số 112 hoạt động 24/7 và hoàn toàn miễn phí từ bất kỳ điện thoại di động nào.',
      'Khi gọi, hãy bình tĩnh nói rõ bạn đang ở đâu (thành phố, tên phố, số nhà).',
      'Nếu không thạo tiếng Nga, hãy nói: "Я говорю по-вьетнамски, помогите!" (Tôi nói tiếng Việt, hãy giúp tôi!).'
    ],
    phrases: [
      {
        id: 'em_p1',
        category: 'emergency',
        russian: 'Помогите, пожалуйста!',
        vietnamese: 'Làm ơn cứu tôi với!',
        pronunciation: 'Pa-ma-gí-tye, pa-zhá-luy-sta!',
        importance: 'critical'
      },
      {
        id: 'em_p2',
        category: 'emergency',
        russian: 'Вызовите скорую помощь!',
        vietnamese: 'Hãy gọi xe cấp cứu giúp tôi!',
        pronunciation: 'Vý-za-vi-tye skó-ru-yu pó-mash!',
        importance: 'critical'
      },
      {
        id: 'em_p3',
        category: 'emergency',
        russian: 'Вызовите полицию!',
        vietnamese: 'Hãy gọi cảnh sát!',
        pronunciation: 'Vý-za-vi-tye pa-lí-tsy-yu!',
        importance: 'critical'
      },
      {
        id: 'em_p4',
        category: 'emergency',
        russian: 'Здесь пожар!',
        vietnamese: 'Ở đây có cháy!',
        pronunciation: 'Zdyes pa-zhár!',
        importance: 'critical'
      },
      {
        id: 'em_p5',
        category: 'emergency',
        russian: 'Я потерял паспорт и документы.',
        vietnamese: 'Tôi bị mất hộ chiếu và giấy tờ.',
        pronunciation: 'Ya pa-tye-ryál pás-part i da-ku-myén-ty.',
        importance: 'high'
      },
      {
        id: 'em_p6',
        category: 'emergency',
        russian: 'Мне плохо, мне нужен врач.',
        vietnamese: 'Tôi thấy rất mệt, tôi cần bác sĩ.',
        pronunciation: 'Mnye pló-kha, mnye nú-zhen vrach.',
        importance: 'high'
      }
    ]
  },
  {
    id: 'sc_transport',
    titleVi: 'Tàu điện ngầm & Giao thông',
    titleRu: 'Метро и общественный транспорт',
    category: 'transportation',
    categoryLabelVi: 'Giao thông',
    descriptionVi: 'Cách mua thẻ Troika, hỏi tuyến Metro, gọi taxi Yandex Go và đi lại hàng ngày.',
    iconName: 'Train',
    tipsVi: [
      'Thẻ Troika có thể nạp tiền tại quầy vé (Касса) hoặc máy tự động có biểu tượng "Тройка".',
      'Luôn chú ý biển báo "Переход на линию" (Chuyển sang tuyến) và "Выход в город" (Lối ra thành phố).',
      'Ứng dụng gọi xe phổ biến và minh bạch nhất tại Nga là Yandex Go.'
    ],
    phrases: [
      {
        id: 'tr_p1',
        category: 'transportation',
        russian: 'Один билет на одну поездку, пожалуйста.',
        vietnamese: 'Làm ơn cho tôi một vé đi một lượt.',
        pronunciation: 'A-dín bi-lyét na ad-nú pa-yézd-ku, pa-zhá-luy-sta.',
        importance: 'high'
      },
      {
        id: 'tr_p2',
        category: 'transportation',
        russian: 'Пополните карту Тройка на 500 рублей, пожалуйста.',
        vietnamese: 'Làm ơn nạp vào thẻ Troika 500 rúp.',
        pronunciation: 'Pa-pal-ní-tye kár-tu Tróy-ka na pyat-sót rub-lyéy, pa-zhá-luy-sta.',
        importance: 'high'
      },
      {
        id: 'tr_p3',
        category: 'transportation',
        russian: 'Как доехать до центра?',
        vietnamese: 'Làm sao để đi đến trung tâm thành phố?',
        pronunciation: 'Kak da-yé-khat da tsén-tra?',
        importance: 'normal'
      },
      {
        id: 'tr_p4',
        category: 'transportation',
        russian: 'Где вход в метро?',
        vietnamese: 'Lối vào ga tàu điện ngầm ở đâu?',
        pronunciation: 'Gdye fkhot v myet-ró?',
        importance: 'normal'
      },
      {
        id: 'tr_p5',
        category: 'transportation',
        russian: 'Остановите здесь, пожалуйста.',
        vietnamese: 'Làm ơn cho tôi xuống ở đây (nói với tài xế taxi/bus).',
        pronunciation: 'As-ta-na-ví-tye zdyes, pa-zhá-luy-sta.',
        importance: 'high'
      }
    ]
  },
  {
    id: 'sc_food',
    titleVi: 'Ăn uống & Nhà hàng',
    titleRu: 'Кафе, рестораны и столовые',
    category: 'food',
    categoryLabelVi: 'Ăn uống',
    descriptionVi: 'Cách xem thực đơn, gọi món tại canteen (Столовая), hỏi nguyên liệu và thanh toán.',
    iconName: 'Utensils',
    tipsVi: [
      'Quán ăn bình dân kiểu tự phục vụ tại Nga gọi là "Столовая" (Stolovaya) - giá rẻ, đồ ăn nấu sẵn tiện lợi.',
      'Nếu kiêng thịt lợn, hãy hỏi: "Здесь есть свинина?" (Ở đây có thịt lợn không?).',
      'Hầu hết các quán đều chấp nhận thanh toán thẻ ngân hàng MIR hoặc mã QR qua SBP.'
    ],
    phrases: [
      {
        id: 'fd_p1',
        category: 'food',
        russian: 'Можно меню, пожалуйста?',
        vietnamese: 'Làm ơn cho tôi xem thực đơn được không?',
        pronunciation: 'Mózh-na mye-nyú, pa-zhá-luy-sta?',
        importance: 'normal'
      },
      {
        id: 'fd_p2',
        category: 'food',
        russian: 'Счёт, пожалуйста.',
        vietnamese: 'Làm ơn tính tiền / cho tôi hóa đơn.',
        pronunciation: 'Shchyot, pa-zhá-luy-sta.',
        importance: 'high'
      },
      {
        id: 'fd_p3',
        category: 'food',
        russian: 'Можно оплатить картой?',
        vietnamese: 'Tôi có thể thanh toán bằng thẻ được không?',
        pronunciation: 'Mózh-na ap-la-tít kár-tay?',
        importance: 'high'
      },
      {
        id: 'fd_p4',
        category: 'food',
        russian: 'Это блюдо острое?',
        vietnamese: 'Món này có cay không?',
        pronunciation: 'É-ta blyú-da ós-tra-ye?',
        importance: 'normal'
      },
      {
        id: 'fd_p5',
        category: 'food',
        russian: 'Без свинины, пожалуйста.',
        vietnamese: 'Làm ơn không cho thịt lợn.',
        pronunciation: 'Bez svi-ní-ny, pa-zhá-luy-sta.',
        importance: 'normal'
      }
    ]
  },
  {
    id: 'sc_shopping',
    titleVi: 'Siêu thị & Mua sắm',
    titleRu: 'Супермаркеты и покупки',
    category: 'shopping',
    categoryLabelVi: 'Mua sắm',
    descriptionVi: 'Mua hàng tại Pyaterochka, Perekrestok, cân hoa quả và dùng quầy tự thanh toán.',
    iconName: 'ShoppingBag',
    tipsVi: [
      'Tại các siêu thị như Pyaterochka (Пятёрочка), Magnit (Магнит), bạn phải tự cân rau củ ở quầy cân trước khi ra tính tiền.',
      'Thu ngân thường hỏi: "Пакет нужен?" (Có cần túi nilon không?) và "Карта магазина есть?" (Có thẻ tích điểm không?).'
    ],
    phrases: [
      {
        id: 'sh_p1',
        category: 'shopping',
        russian: 'Сколько это стоит?',
        vietnamese: 'Cái này giá bao nhiêu tiền?',
        pronunciation: 'Skól-ka é-ta stó-it?',
        importance: 'high'
      },
      {
        id: 'sh_p2',
        category: 'shopping',
        russian: 'Пакет не нужен, спасибо.',
        vietnamese: 'Tôi không cần túi, cảm ơn.',
        pronunciation: 'Pa-kyét nye nú-zhen, spa-sí-ba.',
        importance: 'normal'
      },
      {
        id: 'sh_p3',
        category: 'shopping',
        russian: 'Пакет, пожалуйста.',
        vietnamese: 'Làm ơn cho tôi một túi nilon.',
        pronunciation: 'Pa-kyét, pa-zhá-luy-sta.',
        importance: 'normal'
      },
      {
        id: 'sh_p4',
        category: 'shopping',
        russian: 'Где находится касса самообслуживания?',
        vietnamese: 'Quầy thanh toán tự động ở đâu?',
        pronunciation: 'Gdye na-khó-dit-sya kás-sa sa-ma-ap-slú-zhi-va-ni-ya?',
        importance: 'normal'
      }
    ]
  },
  {
    id: 'sc_accommodation',
    titleVi: 'Khách sạn & Ký túc xá',
    titleRu: 'Гостиницы и общежитие',
    category: 'accommodation',
    categoryLabelVi: 'Chỗ ở',
    descriptionVi: 'Nhận phòng, xin mật khẩu wifi, báo hỏng hệ thống sưởi ấm mùa đông.',
    iconName: 'Hotel',
    tipsVi: [
      'Hệ thống sưởi ấm trung tâm (Отопление) hoạt động tự động từ mùa thu đến mùa xuân.',
      'Nếu phòng bị lạnh do cửa sổ hở, hãy báo ngay quản lý phòng hoặc ban quản lý KTX.'
    ],
    phrases: [
      {
        id: 'ac_p1',
        category: 'accommodation',
        russian: 'У меня забронирован номер на имя...',
        vietnamese: 'Tôi đã đặt trước phòng dưới tên là...',
        pronunciation: 'U me-nyá zab-ra-ni-ró-van nó-myer na i-myá...',
        importance: 'high'
      },
      {
        id: 'ac_p2',
        category: 'accommodation',
        russian: 'Какой пароль от Wi-Fi?',
        vietnamese: 'Mật khẩu Wi-Fi là gì?',
        pronunciation: 'Ka-kóy pa-ról at wáy-fáy?',
        importance: 'normal'
      },
      {
        id: 'ac_p3',
        category: 'accommodation',
        russian: 'В комнате очень холодно, не работает отопление.',
        vietnamese: 'Trong phòng rất lạnh, lò sưởi không hoạt động.',
        pronunciation: 'V kóm-na-tye ó-chyen khó-lad-na, nye ra-bó-ta-yet a-tap-lyé-ni-ye.',
        importance: 'high'
      },
      {
        id: 'ac_p4',
        category: 'accommodation',
        russian: 'Во сколько выезд?',
        vietnamese: 'Mấy giờ phải trả phòng (check-out)?',
        pronunciation: 'Va skól-ka vý-yezd?',
        importance: 'normal'
      }
    ]
  },
  {
    id: 'sc_medical',
    titleVi: 'Y tế & Mua thuốc',
    titleRu: 'Аптека и здоровье',
    category: 'medical',
    categoryLabelVi: 'Y tế & Thuốc',
    descriptionVi: 'Mua thuốc hạ sốt, đau bụng, cảm cúm và trình bày triệu chứng cơ bản.',
    iconName: 'Pill',
    tipsVi: [
      'Hiệu thuốc mở cửa suốt đêm ghi là "Дежурная аптека 24 часа".',
      'Nếu không nhớ tên thuốc tiếng Nga, hãy đưa chữ Cyrillic hoặc tên hoạt chất (Paracetamol, Ibuprofen) cho dược sĩ xem.'
    ],
    phrases: [
      {
        id: 'md_p1',
        category: 'medical',
        russian: 'Дайте, пожалуйста, лекарство от головной боли.',
        vietnamese: 'Làm ơn cho tôi thuốc đau đầu.',
        pronunciation: 'Dáy-tye, pa-zhá-luy-sta, lye-kár-stva at ga-lav-nóy bó-li.',
        importance: 'high'
      },
      {
        id: 'md_p2',
        category: 'medical',
        russian: 'У меня высокая температура и кашель.',
        vietnamese: 'Tôi bị sốt cao và ho.',
        pronunciation: 'U me-nyá vy-só-ka-ya tyem-pye-ra-tú-ra i ká-shel.',
        importance: 'high'
      },
      {
        id: 'md_p3',
        category: 'medical',
        russian: 'Как принимать это лекарство?',
        vietnamese: 'Thuốc này uống/sử dụng như thế nào?',
        pronunciation: 'Kak pri-ni-mát é-ta lye-kár-stva?',
        importance: 'normal'
      },
      {
        id: 'md_p4',
        category: 'medical',
        russian: 'Сколько раз в день принимать?',
        vietnamese: 'Uống mấy lần một ngày?',
        pronunciation: 'Skól-ka raz v dyen pri-ni-mát?',
        importance: 'normal'
      }
    ]
  },
  {
    id: 'sc_administrative',
    titleVi: 'Hành chính & MFC',
    titleRu: 'МФЦ и документы',
    category: 'administrative',
    categoryLabelVi: 'Hành chính',
    descriptionVi: 'Thủ tục tại trung tâm hành chính công MFC, đăng ký tạm trú và công chứng.',
    iconName: 'FileText',
    tipsVi: [
      'Tại trung tâm MFC (Мои Документы), bạn cần bấm máy lấy số thứ tự (Талон) theo dịch vụ bạn cần.',
      'Luôn mang theo hộ chiếu gốc, bản dịch công chứng và thẻ di trú.'
    ],
    phrases: [
      {
        id: 'ad_p1',
        category: 'administrative',
        russian: 'Мне нужно сделать миграционный учёт (регистрацию).',
        vietnamese: 'Tôi cần làm thủ tục đăng ký tạm trú di trú.',
        pronunciation: 'Mnye núzh-na sdyé-lat mi-gra-tsy-ón-ny u-chyót (rye-gi-strá-tsy-yu).',
        importance: 'high'
      },
      {
        id: 'ad_p2',
        category: 'administrative',
        russian: 'Где можно взять талон очереди?',
        vietnamese: 'Tôi có thể lấy phiếu số thứ tự ở đâu?',
        pronunciation: 'Gdye mózh-na vzyat ta-lón ó-chye-rye-di?',
        importance: 'normal'
      },
      {
        id: 'ad_p3',
        category: 'administrative',
        russian: 'Вот мой паспорт и миграционная карта.',
        vietnamese: 'Đây là hộ chiếu và thẻ di trú của tôi.',
        pronunciation: 'Vot moy pás-part i mi-gra-tsy-ón-na-ya kár-ta.',
        importance: 'high'
      }
    ]
  },
  {
    id: 'sc_communication',
    titleVi: 'Giao tiếp & Ứng xử lịch thiệp',
    titleRu: 'Вежливое общение и фразы',
    category: 'communication',
    categoryLabelVi: 'Giao tiếp',
    descriptionVi: 'Chào hỏi lịch sự, xin lỗi, cảm ơn và nhờ giúp đỡ.',
    iconName: 'MessageSquare',
    tipsVi: [
      'Người Nga rất tôn trọng sự lịch thiệp: hãy bắt đầu bằng "Здравствуйте" (Xin kính chào) và kết thúc bằng "Спасибо" (Cảm ơn).',
      'Nếu nghe không kịp, hãy nhờ người đối diện nói chậm lại.'
    ],
    phrases: [
      {
        id: 'cm_p1',
        category: 'communication',
        russian: 'Здравствуйте! Извините, вы говорите по-английски?',
        vietnamese: 'Xin chào! Xin lỗi, bạn có nói tiếng Anh không?',
        pronunciation: 'Zdrást-vuy-tye! Iz-vi-ní-tye, vy ga-va-rí-tye pa-an-glíy-ski?',
        importance: 'normal'
      },
      {
        id: 'cm_p2',
        category: 'communication',
        russian: 'Говорите помедленнее, пожалуйста.',
        vietnamese: 'Làm ơn nói chậm lại một chút.',
        pronunciation: 'Ga-va-rí-tye pa-myéd-lyen-nye-ye, pa-zhá-luy-sta.',
        importance: 'high'
      },
      {
        id: 'cm_p3',
        category: 'communication',
        russian: 'Я плохо говорю по-русски.',
        vietnamese: 'Tôi nói tiếng Nga chưa tốt.',
        pronunciation: 'Ya pló-kha ga-va-ryú pa-rús-ski.',
        importance: 'normal'
      },
      {
        id: 'cm_p4',
        category: 'communication',
        russian: 'Большое спасибо за помощь!',
        vietnamese: 'Cảm ơn rất nhiều vì sự giúp đỡ!',
        pronunciation: 'Bal-shó-ye spa-sí-ba za pó-mash!',
        importance: 'normal'
      }
    ]
  }
];

/**
 * 100% Automated Dataset Validator according to P7 Quality Gate
 */
export function validateRealLifeDataset(): { isValid: boolean; errors: string[]; stats: { scenariosCount: number; phrasesCount: number; emergencyContactsCount: number } } {
  const errors: string[] = [];
  const scenarioIds = new Set<string>();
  const phraseIds = new Set<string>();
  const contactIds = new Set<string>();

  let totalPhrases = 0;

  // Validate emergency contacts
  for (const c of EMERGENCY_CONTACTS) {
    if (contactIds.has(c.id)) {
      errors.push(`Duplicate emergency contact ID: ${c.id}`);
    }
    contactIds.add(c.id);

    if (!c.nameVi || c.nameVi.trim().length === 0) {
      errors.push(`Contact ${c.id} missing nameVi`);
    }
    if (!c.nameRu || c.nameRu.trim().length === 0) {
      errors.push(`Contact ${c.id} missing nameRu`);
    }
    if (!c.phone || c.phone.trim().length === 0) {
      errors.push(`Contact ${c.id} missing phone`);
    }
  }

  // Validate scenarios
  for (const sc of REAL_LIFE_SCENARIOS) {
    if (scenarioIds.has(sc.id)) {
      errors.push(`Duplicate scenario ID: ${sc.id}`);
    }
    scenarioIds.add(sc.id);

    if (!sc.titleVi || sc.titleVi.trim().length === 0) {
      errors.push(`Scenario ${sc.id} missing titleVi`);
    }
    if (!sc.titleRu || sc.titleRu.trim().length === 0) {
      errors.push(`Scenario ${sc.id} missing titleRu`);
    }
    if (!sc.category || sc.category.trim().length === 0) {
      errors.push(`Scenario ${sc.id} missing category`);
    }
    if (!Array.isArray(sc.phrases) || sc.phrases.length === 0) {
      errors.push(`Scenario ${sc.id} has no phrases`);
    }

    for (const p of sc.phrases) {
      totalPhrases++;
      if (phraseIds.has(p.id)) {
        errors.push(`Duplicate phrase ID: ${p.id}`);
      }
      phraseIds.add(p.id);

      if (!p.russian || !/[\u0400-\u04FF]/i.test(p.russian)) {
        errors.push(`Phrase ${p.id} must contain Cyrillic characters in russian: "${p.russian}"`);
      }
      if (!p.vietnamese || p.vietnamese.trim().length === 0) {
        errors.push(`Phrase ${p.id} missing vietnamese translation`);
      }
      if (!p.pronunciation || p.pronunciation.trim().length === 0) {
        errors.push(`Phrase ${p.id} missing pronunciation`);
      }
      if (!['critical', 'high', 'normal'].includes(p.importance)) {
        errors.push(`Phrase ${p.id} has invalid importance: ${p.importance}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      scenariosCount: REAL_LIFE_SCENARIOS.length,
      phrasesCount: totalPhrases,
      emergencyContactsCount: EMERGENCY_CONTACTS.length
    }
  };
}
