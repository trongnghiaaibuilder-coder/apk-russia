/**
 * Kho câu đối thoại 2 chiều Việt ↔ Nga cho du khách.
 * Developer: Xương Rồng AI Developer
 */

export interface DialoguePhrase {
  vi: string;
  ru: string;
  pron: string; // phiên âm đọc tiếng Nga cho người Việt
  category: string;
}

export const DIALOGUE_CATEGORIES = [
  'Chào hỏi',
  'Giao tiếp cơ bản',
  'Hỏi đường',
  'Đi lại',
  'Sân bay & Hải quan',
  'Khách sạn',
  'Ăn uống',
  'Mua sắm',
  'Số & Thời gian',
  'Khẩn cấp & Sức khỏe',
  'Tiền & Ngân hàng',
  'Điện thoại & Internet',
  'Tham quan',
  'Xã giao',
  'Thời tiết',
] as const;

export const DIALOGUE_PHRASES: DialoguePhrase[] = [
  // ===== CHÀO HỎI =====
  { vi: 'Xin chào', ru: 'Здравствуйте', pron: 'zđra-stvu-y-tye', category: 'Chào hỏi' },
  { vi: 'Chào bạn', ru: 'Привет', pron: 'pri-vyet', category: 'Chào hỏi' },
  { vi: 'Chào buổi sáng', ru: 'Доброе утро', pron: 'đốp-ra-ye út-ra', category: 'Chào hỏi' },
  { vi: 'Chào buổi chiều', ru: 'Добрый день', pron: 'đốp-ry đyen', category: 'Chào hỏi' },
  { vi: 'Chào buổi tối', ru: 'Добрый вечер', pron: 'đốp-ry vye-chir', category: 'Chào hỏi' },
  { vi: 'Tạm biệt', ru: 'До свидания', pron: 'đa svi-đa-ni-ya', category: 'Chào hỏi' },
  { vi: 'Hẹn gặp lại', ru: 'До встречи', pron: 'đa fstrye-chi', category: 'Chào hỏi' },
  { vi: 'Chúc ngủ ngon', ru: 'Спокойной ночи', pron: 'spa-koy-nay no-chi', category: 'Chào hỏi' },
  { vi: 'Bạn khỏe không?', ru: 'Как дела?', pron: 'kak dye-la', category: 'Chào hỏi' },
  { vi: 'Tôi khỏe, cảm ơn', ru: 'Хорошо, спасибо', pron: 'kha-ra-sho spa-si-ba', category: 'Chào hỏi' },
  { vi: 'Rất vui được gặp bạn', ru: 'Рад познакомиться', pron: 'rat paz-na-ko-mit-sya', category: 'Chào hỏi' },
  { vi: 'Chúc một ngày tốt lành', ru: 'Хорошего дня', pron: 'kha-ro-shy-va dnya', category: 'Chào hỏi' },

  // ===== GIAO TIẾP CƠ BẢN =====
  { vi: 'Cảm ơn', ru: 'Спасибо', pron: 'spa-si-ba', category: 'Giao tiếp cơ bản' },
  { vi: 'Cảm ơn rất nhiều', ru: 'Большое спасибо', pron: 'bal-sho-ye spa-si-ba', category: 'Giao tiếp cơ bản' },
  { vi: 'Xin lỗi', ru: 'Извините', pron: 'iz-vi-ni-tye', category: 'Giao tiếp cơ bản' },
  { vi: 'Làm ơn', ru: 'Пожалуйста', pron: 'pa-zhal-sta', category: 'Giao tiếp cơ bản' },
  { vi: 'Vâng / Đúng vậy', ru: 'Да', pron: 'đa', category: 'Giao tiếp cơ bản' },
  { vi: 'Không', ru: 'Нет', pron: 'nyet', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi không hiểu', ru: 'Я не понимаю', pron: 'ya nye pa-ni-ma-yu', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi hiểu rồi', ru: 'Я понимаю', pron: 'ya pa-ni-ma-yu', category: 'Giao tiếp cơ bản' },
  { vi: 'Bạn nói tiếng Anh không?', ru: 'Вы говорите по-английски?', pron: 'vy ga-va-ri-tye pa-an-gli-ski', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi đến từ Việt Nam', ru: 'Я из Вьетнама', pron: 'ya iz vyet-na-ma', category: 'Giao tiếp cơ bản' },
  { vi: 'Bạn tên là gì?', ru: 'Как вас зовут?', pron: 'kak vas za-vut', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi tên là...', ru: 'Меня зовут...', pron: 'mye-nya za-vut', category: 'Giao tiếp cơ bản' },
  { vi: 'Nói chậm lại giúp tôi', ru: 'Говорите медленнее, пожалуйста', pron: 'ga-va-ri-tye myed-lye-nye-ye', category: 'Giao tiếp cơ bản' },
  { vi: 'Viết ra giúp tôi được không?', ru: 'Напишите, пожалуйста', pron: 'na-pi-shi-tye pa-zhal-sta', category: 'Giao tiếp cơ bản' },

  // ===== HỎI ĐƯỜNG =====
  { vi: 'Nhà vệ sinh ở đâu?', ru: 'Где находится туалет?', pron: 'gdye na-kho-dit-sya tu-a-lyet', category: 'Hỏi đường' },
  { vi: 'Ga tàu điện ngầm ở đâu?', ru: 'Где находится метро?', pron: 'gdye na-kho-dit-sya mye-tro', category: 'Hỏi đường' },
  { vi: 'Bến xe buýt ở đâu?', ru: 'Где остановка автобуса?', pron: 'gdye a-sta-nof-ka af-to-bu-sa', category: 'Hỏi đường' },
  { vi: 'Đi thẳng', ru: 'Идите прямо', pron: 'i-di-tye prya-ma', category: 'Hỏi đường' },
  { vi: 'Rẽ trái', ru: 'Поверните налево', pron: 'pa-vyer-ni-tye na-lye-va', category: 'Hỏi đường' },
  { vi: 'Rẽ phải', ru: 'Поверните направо', pron: 'pa-vyer-ni-tye na-pra-va', category: 'Hỏi đường' },
  { vi: 'Có xa không?', ru: 'Это далеко?', pron: 'e-ta đa-lye-ko', category: 'Hỏi đường' },
  { vi: 'Gần đây', ru: 'Рядом', pron: 'rya-dam', category: 'Hỏi đường' },
  { vi: 'Chỉ cho tôi trên bản đồ', ru: 'Покажите на карте', pron: 'pa-ka-zhi-tye na kar-tye', category: 'Hỏi đường' },
  { vi: 'Tôi bị lạc đường', ru: 'Я заблудился', pron: 'ya za-blu-dil-sya', category: 'Hỏi đường' },

  // ===== ĐI LẠI =====
  { vi: 'Cho tôi một vé', ru: 'Один билет, пожалуйста', pron: 'a-din bi-lyet pa-zhal-sta', category: 'Đi lại' },
  { vi: 'Vé khứ hồi', ru: 'Билет туда и обратно', pron: 'bi-lyet tu-đa i ab-rat-na', category: 'Đi lại' },
  { vi: 'Chuyến này đi đâu?', ru: 'Куда идёт этот поезд?', pron: 'ku-đa i-dyot e-tat po-yezd', category: 'Đi lại' },
  { vi: 'Mấy giờ khởi hành?', ru: 'Во сколько отправление?', pron: 'va skol-ka at-prav-lye-ni-ye', category: 'Đi lại' },
  { vi: 'Gọi taxi giúp tôi', ru: 'Вызовите такси, пожалуйста', pron: 'vy-za-vi-tye tak-si', category: 'Đi lại' },
  { vi: 'Đưa tôi đến địa chỉ này', ru: 'Отвезите меня по этому адресу', pron: 'at-vye-zi-tye mye-nya', category: 'Đi lại' },
  { vi: 'Dừng ở đây', ru: 'Остановите здесь', pron: 'a-sta-na-vi-tye zdyes', category: 'Đi lại' },
  { vi: 'Bao nhiêu tiền taxi?', ru: 'Сколько стоит такси?', pron: 'skol-ka sto-it tak-si', category: 'Đi lại' },
  { vi: 'Sân bay ở đâu?', ru: 'Где аэропорт?', pron: 'gdye a-e-ra-port', category: 'Đi lại' },

  // ===== KHÁCH SẠN =====
  { vi: 'Tôi đã đặt phòng', ru: 'У меня забронирован номер', pron: 'u mye-nya za-bra-ni-ra-van na-myer', category: 'Khách sạn' },
  { vi: 'Tôi muốn đặt một phòng đơn', ru: 'Я хочу забронировать одноместный номер', pron: 'ya kha-chu za-bra-ni-ra-vat', category: 'Khách sạn' },
  { vi: 'Phòng đôi', ru: 'Двухместный номер', pron: 'dvukh-myes-ny nom-yer', category: 'Khách sạn' },
  { vi: 'Một đêm bao nhiêu tiền?', ru: 'Сколько стоит ночь?', pron: 'skol-ka sto-it noch', category: 'Khách sạn' },
  { vi: 'Có bao gồm bữa sáng không?', ru: 'Завтрак включён?', pron: 'zaf-trak fklyu-chon', category: 'Khách sạn' },
  { vi: 'Cho tôi chìa khóa phòng', ru: 'Дайте ключ от номера', pron: 'đai-tye klyuch at no-mye-ra', category: 'Khách sạn' },
  { vi: 'Tôi muốn trả phòng', ru: 'Я хочу выехать', pron: 'ya kha-chu vy-ye-khat', category: 'Khách sạn' },
  { vi: 'Wifi mật khẩu là gì?', ru: 'Какой пароль от Wi-Fi?', pron: 'ka-koy pa-rol at vai-fai', category: 'Khách sạn' },

  // ===== ĂN UỐNG =====
  { vi: 'Cho tôi xem thực đơn', ru: 'Меню, пожалуйста', pron: 'mye-nyu pa-zhal-sta', category: 'Ăn uống' },
  { vi: 'Tôi muốn món này', ru: 'Я хочу это', pron: 'ya kha-chu e-ta', category: 'Ăn uống' },
  { vi: 'Ngon lắm', ru: 'Очень вкусно', pron: 'o-chin fkus-na', category: 'Ăn uống' },
  { vi: 'Tính tiền giúp tôi', ru: 'Счёт, пожалуйста', pron: 'shyot pa-zhal-sta', category: 'Ăn uống' },
  { vi: 'Cho tôi một ly nước', ru: 'Стакан воды, пожалуйста', pron: 'sta-kan va-dy', category: 'Ăn uống' },
  { vi: 'Tôi ăn chay', ru: 'Я вегетарианец', pron: 'ya vye-gye-ta-ri-a-nyets', category: 'Ăn uống' },
  { vi: 'Không cay', ru: 'Не острое', pron: 'nye a-stro-ye', category: 'Ăn uống' },
  { vi: 'Món này có gì?', ru: 'Что в этом блюде?', pron: 'shto v e-tam blyu-dye', category: 'Ăn uống' },

  // ===== MUA SẮM =====
  { vi: 'Bao nhiêu tiền?', ru: 'Сколько это стоит?', pron: 'skol-ka e-ta sto-it', category: 'Mua sắm' },
  { vi: 'Đắt quá', ru: 'Это дорого', pron: 'e-ta đa-ra-ga', category: 'Mua sắm' },
  { vi: 'Giảm giá được không?', ru: 'Можно скидку?', pron: 'mozh-na skid-ku', category: 'Mua sắm' },
  { vi: 'Tôi chỉ xem thôi', ru: 'Я просто смотрю', pron: 'ya pro-sta sma-tryu', category: 'Mua sắm' },
  { vi: 'Có size lớn hơn không?', ru: 'Есть размер побольше?', pron: 'yest raz-myer pa-bol-shye', category: 'Mua sắm' },
  { vi: 'Tôi lấy cái này', ru: 'Я беру это', pron: 'ya bye-ru e-ta', category: 'Mua sắm' },
  { vi: 'Thanh toán bằng thẻ được không?', ru: 'Можно оплатить картой?', pron: 'mozh-na a-pla-tit kar-tay', category: 'Mua sắm' },
  { vi: 'Mở cửa mấy giờ?', ru: 'Во сколько открываетесь?', pron: 'va skol-ka at-kry-va-ye-tyes', category: 'Mua sắm' },

  // ===== KHẨN CẤP =====
  { vi: 'Cứu tôi với!', ru: 'Помогите мне!', pron: 'pa-ma-gi-tye mnye', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Gọi cảnh sát!', ru: 'Вызовите полицию!', pron: 'vy-za-vi-tye pa-li-tsi-yu', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Gọi xe cấp cứu!', ru: 'Вызовите скорую!', pron: 'vy-za-vi-tye sko-ru-yu', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi cần bác sĩ', ru: 'Мне нужен врач', pron: 'mnye nu-zhin vrach', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị ốm', ru: 'Я заболел', pron: 'ya za-ba-lyel', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Hiệu thuốc ở đâu?', ru: 'Где аптека?', pron: 'gdye ap-tye-ka', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị mất hộ chiếu', ru: 'Я потерял паспорт', pron: 'ya pa-tye-ryal pa-sport', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Số điện thoại khẩn cấp là gì?', ru: 'Какой номер экстренной службы?', pron: 'ka-koy no-myer', category: 'Khẩn cấp & Sức khỏe' },

  // ===== SÂN BAY & HẢI QUAN =====
  { vi: 'Hộ chiếu của tôi đây', ru: 'Вот мой паспорт', pron: 'vot moy pa-sport', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi đi du lịch', ru: 'Я турист', pron: 'ya tu-rist', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi đi công tác', ru: 'Я в командировке', pron: 'ya f ka-man-di-rof-kye', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi ở lại 2 tuần', ru: 'Я останусь на две недели', pron: 'ya a-sta-nus na dvye nye-dye-li', category: 'Sân bay & Hải quan' },
  { vi: 'Hành lý của tôi ở đâu?', ru: 'Где мой багаж?', pron: 'gdye moy ba-gazh', category: 'Sân bay & Hải quan' },
  { vi: 'Hành lý của tôi bị thất lạc', ru: 'Мой багаж потерян', pron: 'moy ba-gazh pa-tye-ryan', category: 'Sân bay & Hải quan' },
  { vi: 'Cửa ra số mấy?', ru: 'Какой выход?', pron: 'ka-koy vy-khat', category: 'Sân bay & Hải quan' },
  { vi: 'Chuyến bay của tôi bị trễ', ru: 'Мой рейс задерживается', pron: 'moy ryes za-dyer-zhi-va-ye-tsya', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi cần khai báo hải quan', ru: 'Мне нужно пройти таможню', pron: 'mnye nuzh-na prai-ti ta-mozh-nyu', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi không có gì để khai báo', ru: 'Мне нечего декларировать', pron: 'mnye nye-che-va', category: 'Sân bay & Hải quan' },
  { vi: 'Visa của tôi đây', ru: 'Вот моя виза', pron: 'vot ma-ya vi-za', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi quá cảnh ở đây', ru: 'У меня транзит', pron: 'u mye-nya tran-zit', category: 'Sân bay & Hải quan' },

  // ===== SỐ & THỜI GIAN =====
  { vi: 'Một', ru: 'Один', pron: 'a-din', category: 'Số & Thời gian' },
  { vi: 'Hai', ru: 'Два', pron: 'đva', category: 'Số & Thời gian' },
  { vi: 'Ba', ru: 'Три', pron: 'tri', category: 'Số & Thời gian' },
  { vi: 'Bốn', ru: 'Четыре', pron: 'chye-ty-rye', category: 'Số & Thời gian' },
  { vi: 'Năm', ru: 'Пять', pron: 'pyat', category: 'Số & Thời gian' },
  { vi: 'Mười', ru: 'Десять', pron: 'dye-syat', category: 'Số & Thời gian' },
  { vi: 'Một trăm', ru: 'Сто', pron: 'sto', category: 'Số & Thời gian' },
  { vi: 'Một nghìn', ru: 'Тысяча', pron: 'ty-sya-cha', category: 'Số & Thời gian' },
  { vi: 'Bây giờ là mấy giờ?', ru: 'Который час?', pron: 'ka-to-ry chas', category: 'Số & Thời gian' },
  { vi: 'Hôm nay là thứ mấy?', ru: 'Какой сегодня день?', pron: 'ka-koy sye-vod-nya dyen', category: 'Số & Thời gian' },
  { vi: 'Ngày mai', ru: 'Завтра', pron: 'zaf-tra', category: 'Số & Thời gian' },
  { vi: 'Hôm qua', ru: 'Вчера', pron: 'fchye-ra', category: 'Số & Thời gian' },
  { vi: 'Buổi sáng', ru: 'Утром', pron: 'ut-ram', category: 'Số & Thời gian' },
  { vi: 'Buổi tối', ru: 'Вечером', pron: 'vye-chye-ram', category: 'Số & Thời gian' },
  { vi: 'Tuần này', ru: 'На этой неделе', pron: 'na e-tay nye-dye-lye', category: 'Số & Thời gian' },
  { vi: 'Tháng này', ru: 'В этом месяце', pron: 'v e-tam mye-sya-tsye', category: 'Số & Thời gian' },

  // ===== KHẨN CẤP & SỨC KHỎE (mở rộng) =====
  { vi: 'Tôi bị đau đầu', ru: 'У меня болит голова', pron: 'u mye-nya ba-lit ga-la-va', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị đau bụng', ru: 'У меня болит живот', pron: 'u mye-nya ba-lit zhi-vot', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị sốt', ru: 'У меня температура', pron: 'u mye-nya tyem-pye-ra-tu-ra', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị dị ứng', ru: 'У меня аллергия', pron: 'u mye-nya a-lyer-gi-ya', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi cần thuốc giảm đau', ru: 'Мне нужно обезболивающее', pron: 'mnye nuzh-na a-byez-bo-li-va-yu-shye-ye', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Gọi bác sĩ giúp tôi', ru: 'Позовите врача', pron: 'pa-za-vi-tye vra-cha', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Bệnh viện gần nhất ở đâu?', ru: 'Где ближайшая больница?', pron: 'gdye bli-zhai-sha-ya bal-ni-tsa', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị thương', ru: 'Я ранен', pron: 'ya ra-nyen', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Cẩn thận!', ru: 'Осторожно!', pron: 'a-sta-rozh-na', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Cháy!', ru: 'Пожар!', pron: 'pa-zhar', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Trộm!', ru: 'Вор!', pron: 'vor', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Giúp tôi với!', ru: 'На помощь!', pron: 'na po-mash', category: 'Khẩn cấp & Sức khỏe' },

  // ===== TIỀN & NGÂN HÀNG =====
  { vi: 'Đổi tiền ở đâu?', ru: 'Где обмен валюты?', pron: 'gdye ab-myen va-lyu-ty', category: 'Tiền & Ngân hàng' },
  { vi: 'Tỷ giá hôm nay là bao nhiêu?', ru: 'Какой сегодня курс?', pron: 'ka-koy sye-vod-nya kurs', category: 'Tiền & Ngân hàng' },
  { vi: 'Cây ATM ở đâu?', ru: 'Где банкомат?', pron: 'gdye ban-ka-mat', category: 'Tiền & Ngân hàng' },
  { vi: 'Tôi muốn đổi đô la sang rúp', ru: 'Я хочу обменять доллары на рубли', pron: 'ya kha-chu ab-mye-nyat', category: 'Tiền & Ngân hàng' },
  { vi: 'Thẻ của tôi bị nuốt', ru: 'Банкомат забрал мою карту', pron: 'ban-ka-mat za-bral', category: 'Tiền & Ngân hàng' },
  { vi: 'Ngân hàng mở cửa mấy giờ?', ru: 'Во сколько открывается банк?', pron: 'va skol-ka at-kry-va-ye-tsya bank', category: 'Tiền & Ngân hàng' },
  { vi: 'Tôi cần chuyển tiền', ru: 'Мне нужно перевести деньги', pron: 'mnye nuzh-na pye-rye-vyes-ti dyen-gi', category: 'Tiền & Ngân hàng' },

  // ===== ĐIỆN THOẠI & INTERNET =====
  { vi: 'Tôi muốn mua sim điện thoại', ru: 'Я хочу купить сим-карту', pron: 'ya kha-chu ku-pit sim-kar-tu', category: 'Điện thoại & Internet' },
  { vi: 'Gói cước nào rẻ nhất?', ru: 'Какой тариф самый дешёвый?', pron: 'ka-koy ta-rif sa-my dye-sho-vy', category: 'Điện thoại & Internet' },
  { vi: 'Điện thoại tôi hết pin', ru: 'У меня разрядился телефон', pron: 'u mye-nya raz-rya-dil-sya', category: 'Điện thoại & Internet' },
  { vi: 'Cho tôi sạc nhờ', ru: 'Можно зарядить телефон?', pron: 'mozh-na za-rya-dit', category: 'Điện thoại & Internet' },
  { vi: 'Mật khẩu wifi là gì?', ru: 'Какой пароль от Wi-Fi?', pron: 'ka-koy pa-rol at vai-fai', category: 'Điện thoại & Internet' },
  { vi: 'Không có sóng', ru: 'Нет сигнала', pron: 'nyet sig-na-la', category: 'Điện thoại & Internet' },
  { vi: 'Tôi cần gọi về Việt Nam', ru: 'Мне нужно позвонить во Вьетнам', pron: 'mnye nuzh-na paz-va-nit', category: 'Điện thoại & Internet' },

  // ===== THAM QUAN =====
  { vi: 'Vé vào cửa bao nhiêu?', ru: 'Сколько стоит входной билет?', pron: 'skol-ka sto-it fkhad-noy bi-lyet', category: 'Tham quan' },
  { vi: 'Mấy giờ đóng cửa?', ru: 'Во сколько закрываетесь?', pron: 'va skol-ka za-kry-va-ye-tyes', category: 'Tham quan' },
  { vi: 'Có hướng dẫn viên tiếng Anh không?', ru: 'Есть экскурсия на английском?', pron: 'yest eks-kur-si-ya', category: 'Tham quan' },
  { vi: 'Chụp ảnh được không?', ru: 'Можно фотографировать?', pron: 'mozh-na fa-ta-gra-fi-ra-vat', category: 'Tham quan' },
  { vi: 'Nhà hát ở đâu?', ru: 'Где театр?', pron: 'gdye tye-atr', category: 'Tham quan' },
  { vi: 'Bảo tàng ở đâu?', ru: 'Где музей?', pron: 'gdye mu-zyei', category: 'Tham quan' },
  { vi: 'Chỗ này đẹp quá', ru: 'Здесь очень красиво', pron: 'zdyes o-chin kra-si-va', category: 'Tham quan' },
  { vi: 'Tôi muốn đi thuyền trên sông', ru: 'Я хочу покататься на теплоходе', pron: 'ya kha-chu pa-ka-tat-sya', category: 'Tham quan' },

  // ===== XÃ GIAO =====
  { vi: 'Bạn từ đâu đến?', ru: 'Откуда вы?', pron: 'at-ku-đa vy', category: 'Xã giao' },
  { vi: 'Bạn làm nghề gì?', ru: 'Кем вы работаете?', pron: 'kyem vy ra-bo-ta-ye-tye', category: 'Xã giao' },
  { vi: 'Tôi đi du lịch một mình', ru: 'Я путешествую один', pron: 'ya pu-tye-shest-vu-yu a-din', category: 'Xã giao' },
  { vi: 'Đây là lần đầu tôi đến Nga', ru: 'Я впервые в России', pron: 'ya fpyer-vy-ye v ra-si-i', category: 'Xã giao' },
  { vi: 'Tôi rất thích nước Nga', ru: 'Мне очень нравится Россия', pron: 'mnye o-chin nra-vit-sya', category: 'Xã giao' },
  { vi: 'Chúc mừng!', ru: 'Поздравляю!', pron: 'paz-drav-lya-yu', category: 'Xã giao' },
  { vi: 'Chúc sức khỏe!', ru: 'Будьте здоровы!', pron: 'bud-tye zda-ro-vy', category: 'Xã giao' },
  { vi: 'Hẹn gặp lại sớm nhé', ru: 'До скорой встречи', pron: 'đa sko-ray fstrye-chi', category: 'Xã giao' },
  { vi: 'Cho tôi xin số điện thoại', ru: 'Дайте ваш номер телефона', pron: 'đai-tye vash no-myer', category: 'Xã giao' },
  { vi: 'Chúng ta chụp ảnh chung nhé', ru: 'Давайте сфотографируемся', pron: 'đa-vai-tye sfа-ta-gra-fi-ru-yem-sya', category: 'Xã giao' },

  // ===== THỜI TIẾT =====
  { vi: 'Hôm nay trời thế nào?', ru: 'Какая сегодня погода?', pron: 'ka-ka-ya sye-vod-nya pa-go-đa', category: 'Thời tiết' },
  { vi: 'Trời lạnh quá', ru: 'Очень холодно', pron: 'o-chin kha-lad-na', category: 'Thời tiết' },
  { vi: 'Trời đang mưa', ru: 'Идёт дождь', pron: 'i-dyot dozhd', category: 'Thời tiết' },
  { vi: 'Trời đang có tuyết', ru: 'Идёт снег', pron: 'i-dyot snyeg', category: 'Thời tiết' },
  { vi: 'Ngày mai có lạnh không?', ru: 'Завтра будет холодно?', pron: 'zaf-tra bu-dyet kha-lad-na', category: 'Thời tiết' },
  { vi: 'Nhiệt độ bao nhiêu?', ru: 'Какая температура?', pron: 'ka-ka-ya tyem-pye-ra-tu-ra', category: 'Thời tiết' },

  // ===== ĂN UỐNG (mở rộng) =====
  { vi: 'Bàn cho hai người', ru: 'Столик на двоих', pron: 'sto-lik na dva-ikh', category: 'Ăn uống' },
  { vi: 'Món đặc sản ở đây là gì?', ru: 'Какое здесь фирменное блюдо?', pron: 'ka-ko-ye zdyes fir-mye-no-ye blyu-đa', category: 'Ăn uống' },
  { vi: 'Cho thêm một phần nữa', ru: 'Ещё одну порцию, пожалуйста', pron: 'ye-shyo ad-nu por-tsi-yu', category: 'Ăn uống' },
  { vi: 'Tôi bị dị ứng đậu phộng', ru: 'У меня аллергия на арахис', pron: 'u mye-nya a-lyer-gi-ya', category: 'Ăn uống' },
  { vi: 'Không đường', ru: 'Без сахара', pron: 'byez sa-kha-ra', category: 'Ăn uống' },
  { vi: 'Cho tôi hóa đơn', ru: 'Дайте счёт', pron: 'đai-tye shyot', category: 'Ăn uống' },
  { vi: 'Giữ lại tiền thừa', ru: 'Сдачи не надо', pron: 'zda-chi nye na-đa', category: 'Ăn uống' },
  { vi: 'Quán này mở đến mấy giờ?', ru: 'До скольки вы открыты?', pron: 'đa skol-ki vy at-kry-ty', category: 'Ăn uống' },

  // ===== MUA SẮM (mở rộng) =====
  { vi: 'Siêu thị ở đâu?', ru: 'Где супермаркет?', pron: 'gdye su-pyer-mar-kyet', category: 'Mua sắm' },
  { vi: 'Chợ ở đâu?', ru: 'Где рынок?', pron: 'gdye ry-nak', category: 'Mua sắm' },
  { vi: 'Tôi muốn đổi size', ru: 'Я хочу поменять размер', pron: 'ya kha-chu pa-mye-nyat raz-myer', category: 'Mua sắm' },
  { vi: 'Có màu khác không?', ru: 'Есть другой цвет?', pron: 'yest dru-goy tsvyet', category: 'Mua sắm' },
  { vi: 'Thử được không?', ru: 'Можно примерить?', pron: 'mozh-na pri-mye-rit', category: 'Mua sắm' },
  { vi: 'Bảo hành bao lâu?', ru: 'Какая гарантия?', pron: 'ka-ka-ya ga-ran-ti-ya', category: 'Mua sắm' },
  { vi: 'Có hóa đơn không?', ru: 'Дайте чек', pron: 'đai-tye chyek', category: 'Mua sắm' },

  // ===== ĐI LẠI (mở rộng) =====
  { vi: 'Trạm tiếp theo là đâu?', ru: 'Какая следующая станция?', pron: 'ka-ka-ya slye-du-yu-sha-ya stant-si-ya', category: 'Đi lại' },
  { vi: 'Tôi xuống ở trạm nào?', ru: 'На какой станции мне выходить?', pron: 'na ka-koy stant-si-i', category: 'Đi lại' },
  { vi: 'Xe buýt số mấy đi đến...?', ru: 'Какой автобус идёт до...?', pron: 'ka-koy af-to-bus i-dyot đa', category: 'Đi lại' },
  { vi: 'Mua vé ở đâu?', ru: 'Где купить билет?', pron: 'gdye ku-pit bi-lyet', category: 'Đi lại' },
  { vi: 'Tôi muốn thuê xe', ru: 'Я хочу арендовать машину', pron: 'ya kha-chu a-ryen-đa-vat', category: 'Đi lại' },
  { vi: 'Bật đồng hồ tính tiền', ru: 'Включите счётчик', pron: 'fklyu-chi-tye shyot-chik', category: 'Đi lại' },

  // ===== CHÀO HỎI (mở rộng) =====
  { vi: 'Chào mọi người', ru: 'Здравствуйте все', pron: 'zđra-stvu-y-tye fsye', category: 'Chào hỏi' },
  { vi: 'Lâu rồi không gặp', ru: 'Давно не виделись', pron: 'đav-na nye vi-dye-lis', category: 'Chào hỏi' },
  { vi: 'Chúc cuối tuần vui vẻ', ru: 'Хороших выходных', pron: 'kha-ro-shikh vy-khad-nykh', category: 'Chào hỏi' },
  { vi: 'Cảm ơn bạn đã giúp đỡ', ru: 'Спасибо за помощь', pron: 'spa-si-ba za po-mash', category: 'Chào hỏi' },
  { vi: 'Không có gì', ru: 'Не за что', pron: 'nye za shta', category: 'Chào hỏi' },

  // ===== GIAO TIẾP CƠ BẢN (mở rộng) =====
  { vi: 'Tôi nói tiếng Nga một chút', ru: 'Я немного говорю по-русски', pron: 'ya nye-mno-ga ga-va-ryu', category: 'Giao tiếp cơ bản' },
  { vi: 'Bạn có hiểu không?', ru: 'Вы понимаете?', pron: 'vy pa-ni-ma-ye-tye', category: 'Giao tiếp cơ bản' },
  { vi: 'Đợi một chút', ru: 'Подождите минуту', pron: 'pa-dazh-di-tye mi-nu-tu', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi không biết', ru: 'Я не знаю', pron: 'ya nye zna-yu', category: 'Giao tiếp cơ bản' },
  { vi: 'Có thể', ru: 'Возможно', pron: 'vaz-mozh-na', category: 'Giao tiếp cơ bản' },
  { vi: 'Chắc chắn rồi', ru: 'Конечно', pron: 'ka-nye-shna', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi đồng ý', ru: 'Я согласен', pron: 'ya sag-la-syen', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi không đồng ý', ru: 'Я не согласен', pron: 'ya nye sag-la-syen', category: 'Giao tiếp cơ bản' },
  { vi: 'Không sao đâu', ru: 'Ничего страшного', pron: 'ni-chye-va strash-na-va', category: 'Giao tiếp cơ bản' },
  { vi: 'Để tôi suy nghĩ', ru: 'Дайте подумать', pron: 'đai-tye pa-du-mat', category: 'Giao tiếp cơ bản' },
  { vi: 'Tôi đang vội', ru: 'Я спешу', pron: 'ya spye-shu', category: 'Giao tiếp cơ bản' },
  { vi: 'Không vấn đề gì', ru: 'Без проблем', pron: 'byez prab-lyem', category: 'Giao tiếp cơ bản' },

  // ===== HỎI ĐƯỜNG (mở rộng) =====
  { vi: 'Đi bộ mất bao lâu?', ru: 'Сколько идти пешком?', pron: 'skol-ka i-dti pyesh-kom', category: 'Hỏi đường' },
  { vi: 'Có gần ga tàu không?', ru: 'Это рядом со станцией?', pron: 'e-ta rya-dam sa stant-si-yey', category: 'Hỏi đường' },
  { vi: 'Bản đồ thành phố ở đâu bán?', ru: 'Где купить карту города?', pron: 'gdye ku-pit kar-tu go-ra-đa', category: 'Hỏi đường' },
  { vi: 'Khu trung tâm ở hướng nào?', ru: 'Где центр города?', pron: 'gdye tsyentr go-ra-đa', category: 'Hỏi đường' },
  { vi: 'Con đường này tên gì?', ru: 'Как называется эта улица?', pron: 'kak na-zy-va-ye-tsya', category: 'Hỏi đường' },
  { vi: 'Số nhà bao nhiêu?', ru: 'Какой номер дома?', pron: 'ka-koy no-myer do-ma', category: 'Hỏi đường' },

  // ===== KHÁCH SẠN (mở rộng) =====
  { vi: 'Phòng có view đẹp', ru: 'Номер с красивым видом', pron: 'no-myer s kra-si-vym vi-dam', category: 'Khách sạn' },
  { vi: 'Phòng yên tĩnh', ru: 'Тихий номер', pron: 'ti-khi no-myer', category: 'Khách sạn' },
  { vi: 'Điều hòa không hoạt động', ru: 'Кондиционер не работает', pron: 'kan-di-tsi-a-nyer nye ra-bo-ta-yet', category: 'Khách sạn' },
  { vi: 'Không có nước nóng', ru: 'Нет горячей воды', pron: 'nyet ga-rya-chey va-dy', category: 'Khách sạn' },
  { vi: 'Cho thêm khăn tắm', ru: 'Дайте ещё полотенце', pron: 'đai-tye ye-shyo pa-la-tyen-tsye', category: 'Khách sạn' },
  { vi: 'Dọn phòng giúp tôi', ru: 'Уберите номер, пожалуйста', pron: 'u-bye-ri-tye no-myer', category: 'Khách sạn' },
  { vi: 'Tôi để quên đồ trong phòng', ru: 'Я забыл вещи в номере', pron: 'ya za-byl vye-shi', category: 'Khách sạn' },
  { vi: 'Có két sắt không?', ru: 'Есть сейф?', pron: 'yest syeyf', category: 'Khách sạn' },
  { vi: 'Trả phòng lúc mấy giờ?', ru: 'Во сколько выезд?', pron: 'va skol-ka vy-yezd', category: 'Khách sạn' },

  // ===== SÂN BAY (mở rộng) =====
  { vi: 'Quầy làm thủ tục ở đâu?', ru: 'Где стойка регистрации?', pron: 'gdye stoy-ka rye-gist-ra-tsi-i', category: 'Sân bay & Hải quan' },
  { vi: 'Cửa lên máy bay số mấy?', ru: 'Какой номер выхода на посадку?', pron: 'ka-koy no-myer vy-kha-đa', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi bị lỡ chuyến bay', ru: 'Я опоздал на рейс', pron: 'ya a-paz-đa-al na ryes', category: 'Sân bay & Hải quan' },
  { vi: 'Chuyến bay tiếp theo khi nào?', ru: 'Когда следующий рейс?', pron: 'kag-đa slye-du-yu-shi ryes', category: 'Sân bay & Hải quan' },
  { vi: 'Tôi cần xe lăn', ru: 'Мне нужна инвалидная коляска', pron: 'mnye nuzh-na ka-lyas-ka', category: 'Sân bay & Hải quan' },

  // ===== ĂN UỐNG (mở rộng thêm) =====
  { vi: 'Tôi muốn gọi món', ru: 'Я хочу сделать заказ', pron: 'ya kha-chu zdye-lat za-kas', category: 'Ăn uống' },
  { vi: 'Món này cay không?', ru: 'Это острое?', pron: 'e-ta a-stro-ye', category: 'Ăn uống' },
  { vi: 'Cho ít đá thôi', ru: 'Поменьше льда', pron: 'pa-myen-shye lda', category: 'Ăn uống' },
  { vi: 'Tôi muốn thanh toán riêng', ru: 'Мы платим раздельно', pron: 'my pla-tim raz-dyel-na', category: 'Ăn uống' },
  { vi: 'Món ăn rất ngon', ru: 'Блюдо очень вкусное', pron: 'blyu-đa o-chin fkus-na-ye', category: 'Ăn uống' },
  { vi: 'Cho tôi thêm bánh mì', ru: 'Дайте ещё хлеба', pron: 'đai-tye ye-shyo khlye-ba', category: 'Ăn uống' },
  { vi: 'Tôi không ăn thịt heo', ru: 'Я не ем свинину', pron: 'ya nye yem svi-ni-nu', category: 'Ăn uống' },
  { vi: 'Có món chay không?', ru: 'Есть вегетарианские блюда?', pron: 'yest vye-gye-ta-ri-an-ski-ye', category: 'Ăn uống' },

  // ===== MUA SẮM (mở rộng thêm) =====
  { vi: 'Có giảm giá không?', ru: 'Есть скидки?', pron: 'yest skid-ki', category: 'Mua sắm' },
  { vi: 'Tôi muốn trả lại hàng', ru: 'Я хочу вернуть товар', pron: 'ya kha-chu vyer-nut ta-var', category: 'Mua sắm' },
  { vi: 'Hàng này sản xuất ở đâu?', ru: 'Где это произведено?', pron: 'gdye e-ta pra-iz-vye-dye-no', category: 'Mua sắm' },
  { vi: 'Cho tôi túi đựng', ru: 'Дайте пакет', pron: 'đai-tye pa-kyet', category: 'Mua sắm' },
  { vi: 'Tôi chỉ đang xem thôi, cảm ơn', ru: 'Я просто смотрю, спасибо', pron: 'ya pro-sta sma-tryu', category: 'Mua sắm' },

  // ===== ĐI LẠI (mở rộng thêm) =====
  { vi: 'Xe này có đi qua trung tâm không?', ru: 'Этот автобус идёт через центр?', pron: 'e-tat af-to-bus i-dyot', category: 'Đi lại' },
  { vi: 'Tôi cần xuống ở bến tiếp theo', ru: 'Мне нужно выйти на следующей остановке', pron: 'mnye nuzh-na vy-ti', category: 'Đi lại' },
  { vi: 'Bao lâu có một chuyến?', ru: 'Как часто ходит?', pron: 'kak cha-sta kho-dit', category: 'Đi lại' },
  { vi: 'Chuyến cuối mấy giờ?', ru: 'Во сколько последний рейс?', pron: 'va skol-ka pas-lyed-ni ryes', category: 'Đi lại' },

  // ===== THAM QUAN (mở rộng) =====
  { vi: 'Có tour tiếng Việt không?', ru: 'Есть тур на вьетнамском?', pron: 'yest tur na vyet-nam-skam', category: 'Tham quan' },
  { vi: 'Vé cho sinh viên có giảm không?', ru: 'Есть скидка для студентов?', pron: 'yest skid-ka dlya stu-dyen-tav', category: 'Tham quan' },
  { vi: 'Tôi muốn mua vé ngày mai', ru: 'Я хочу купить билет на завтра', pron: 'ya kha-chu ku-pit bi-lyet', category: 'Tham quan' },
  { vi: 'Ở đây có gì nổi tiếng?', ru: 'Что здесь знаменито?', pron: 'shto zdyes zna-mye-ni-ta', category: 'Tham quan' },
  { vi: 'Tôi muốn đi dạo quanh thành phố', ru: 'Я хочу погулять по городу', pron: 'ya kha-chu pa-gu-lyat', category: 'Tham quan' },

  // ===== XÃ GIAO (mở rộng) =====
  { vi: 'Bạn có người yêu chưa?', ru: 'У вас есть парень/девушка?', pron: 'u vas yest pa-ryen', category: 'Xã giao' },
  { vi: 'Tôi đã kết hôn', ru: 'Я женат/замужем', pron: 'ya zhye-nat', category: 'Xã giao' },
  { vi: 'Tôi độc thân', ru: 'Я холост', pron: 'ya kha-lost', category: 'Xã giao' },
  { vi: 'Bạn bao nhiêu tuổi?', ru: 'Сколько вам лет?', pron: 'skol-ka vam lyet', category: 'Xã giao' },
  { vi: 'Tôi 25 tuổi', ru: 'Мне 25 лет', pron: 'mnye dva-tsat pyat lyet', category: 'Xã giao' },
  { vi: 'Gia đình bạn có mấy người?', ru: 'Сколько человек в вашей семье?', pron: 'skol-ka chye-la-vyek', category: 'Xã giao' },
  { vi: 'Rất vui được làm quen', ru: 'Очень приятно познакомиться', pron: 'o-chin pri-yat-na', category: 'Xã giao' },

  // ===== THỜI TIẾT (mở rộng) =====
  { vi: 'Trời nắng đẹp', ru: 'Солнечно', pron: 'sol-nye-chna', category: 'Thời tiết' },
  { vi: 'Trời nhiều mây', ru: 'Облачно', pron: 'ab-lach-na', category: 'Thời tiết' },
  { vi: 'Trời gió to', ru: 'Сильный ветер', pron: 'sil-ny vye-tyer', category: 'Thời tiết' },
  { vi: 'Ngày mai có mưa không?', ru: 'Завтра будет дождь?', pron: 'zaf-tra bu-dyet dozhd', category: 'Thời tiết' },
  { vi: 'Tôi cần mua ô', ru: 'Мне нужен зонт', pron: 'mnye nu-zhin zont', category: 'Thời tiết' },
  { vi: 'Mặc ấm vào nhé', ru: 'Одевайтесь теплее', pron: 'a-dye-vai-tyes tyep-lye-ye', category: 'Thời tiết' },

  // ===== TIỀN (mở rộng) =====
  { vi: 'Tôi muốn rút tiền', ru: 'Я хочу снять деньги', pron: 'ya kha-chu snyat dyen-gi', category: 'Tiền & Ngân hàng' },
  { vi: 'Máy ATM này có thu phí không?', ru: 'Этот банкомат берёт комиссию?', pron: 'e-tat ban-ka-mat bye-ryot', category: 'Tiền & Ngân hàng' },
  { vi: 'Tôi muốn mở tài khoản', ru: 'Я хочу открыть счёт', pron: 'ya kha-chu at-kryt shyot', category: 'Tiền & Ngân hàng' },
  { vi: 'Cho tôi biên lai', ru: 'Дайте квитанцию', pron: 'đai-tye kvi-tant-si-yu', category: 'Tiền & Ngân hàng' },

  // ===== ĐIỆN THOẠI (mở rộng) =====
  { vi: 'Sim này bao nhiêu tiền?', ru: 'Сколько стоит эта сим-карта?', pron: 'skol-ka sto-it', category: 'Điện thoại & Internet' },
  { vi: 'Nạp tiền điện thoại ở đâu?', ru: 'Где пополнить баланс?', pron: 'gdye pa-pol-nit ba-lans', category: 'Điện thoại & Internet' },
  { vi: 'Tôi cần mua cục sạc', ru: 'Мне нужно купить зарядку', pron: 'mnye nuzh-na ku-pit za-ryat-ku', category: 'Điện thoại & Internet' },
  { vi: 'Điện thoại tôi bị mất', ru: 'Я потерял телефон', pron: 'ya pa-tye-ryal tye-lye-fon', category: 'Điện thoại & Internet' },

  // ===== SỨC KHỎE (mở rộng) =====
  { vi: 'Tôi cần gặp nha sĩ', ru: 'Мне нужен стоматолог', pron: 'mnye nu-zhin sta-ma-to-lag', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị đau răng', ru: 'У меня болит зуб', pron: 'u mye-nya ba-lit zup', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi bị cảm cúm', ru: 'У меня грипп', pron: 'u mye-nya grip', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi cần đơn thuốc', ru: 'Мне нужен рецепт', pron: 'mnye nu-zhin rye-tsyept', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Thuốc này uống thế nào?', ru: 'Как принимать это лекарство?', pron: 'kak pri-ni-mat', category: 'Khẩn cấp & Sức khỏe' },
  { vi: 'Tôi mang thai', ru: 'Я беременна', pron: 'ya bye-rye-mye-na', category: 'Khẩn cấp & Sức khỏe' },
];

/** Lấy câu theo danh mục */
export function getPhrasesByCategory(category: string): DialoguePhrase[] {
  return DIALOGUE_PHRASES.filter((p) => p.category === category);
}

/** Tìm câu trong kho (không phân biệt hoa thường, dấu câu) */
export function findDialoguePhrase(text: string): DialoguePhrase | undefined {
  const norm = text.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  return DIALOGUE_PHRASES.find(
    (p) =>
      p.vi.toLowerCase().replace(/[.,!?;:]/g, '') === norm ||
      p.ru.toLowerCase().replace(/[.,!?;:]/g, '') === norm
  );
}
