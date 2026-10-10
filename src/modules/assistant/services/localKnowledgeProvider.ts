/**
 * Russia AI Support - Offline Local Knowledge Base & Provider
 * Developer: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 * 
 * Provides deterministic, offline-first answers to essential practical questions
 * for Vietnamese students, expatriates, and travelers living in the Russian Federation.
 */

import { 
  IAIAssistantProvider, 
  AssistantMessage, 
  AssistantResponse, 
  AssistantContext,
  PresetAssistantTopic 
} from '../types';

export const PRESET_ASSISTANT_TOPICS: PresetAssistantTopic[] = [
  {
    id: 'topic_registration',
    labelVi: 'Đăng ký tạm trú (Регистрация)',
    descriptionVi: 'Thủ tục đăng ký cư trú trong 7 ngày làm việc',
    sampleQuestion: 'Tôi mới sang Nga, làm thế nào để làm đăng ký tạm trú (Регистрация)?',
    category: 'visa_legal'
  },
  {
    id: 'topic_metro_troika',
    labelVi: 'Đi tàu điện ngầm & Thẻ Troika',
    descriptionVi: 'Hướng dẫn mua vé, nạp thẻ và chuyển line Metro',
    sampleQuestion: 'Làm thế nào để mua và nạp tiền thẻ Troika đi Metro tại Moskva?',
    category: 'daily_life'
  },
  {
    id: 'topic_winter_clothes',
    labelVi: 'Trang phục giữ ấm mùa đông',
    descriptionVi: 'Kinh nghiệm chống rét từ -10°C đến -30°C',
    sampleQuestion: 'Mùa đông nước Nga rất lạnh, tôi cần chuẩn bị quần áo và giày dép như thế nào?',
    category: 'survival'
  },
  {
    id: 'topic_emergency_health',
    labelVi: 'Cấp cứu y tế & Mua thuốc',
    descriptionVi: 'Số điện thoại khẩn cấp 112 và tên thuốc cơ bản',
    sampleQuestion: 'Nếu bị ốm hoặc cần cấp cứu y tế tại Nga thì gọi số nào và mua thuốc ở đâu?',
    category: 'medical_health'
  },
  {
    id: 'topic_bank_mir',
    labelVi: 'Thẻ ngân hàng MIR (Карта МИР)',
    descriptionVi: 'Mở tài khoản tại Sberbank, VTB, T-Bank',
    sampleQuestion: 'Làm thế nào để người Việt mở tài khoản ngân hàng và thẻ MIR tại Nga?',
    category: 'daily_life'
  },
  {
    id: 'topic_etiquette',
    labelVi: 'Văn hóa & Ứng xử tại Nga',
    descriptionVi: 'Những điều kiêng kỵ và phép lịch sự thường ngày',
    sampleQuestion: 'Có những điều cấm kỵ hay quy tắc lịch sự nào cần biết khi giao tiếp với người Nga?',
    category: 'daily_life'
  }
];

export interface KnowledgeArticle {
  keywords: string[];
  titleVi: string;
  responseContent: string;
}

export const LOCAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    keywords: ['đăng ký', 'tạm trú', 'регистрация', 'рег', 'thẻ di trú', 'migrant', 'hộ chiếu', 'visa', 'hạn'],
    titleVi: 'Hướng dẫn đăng ký tạm trú (Регистрация)',
    responseContent: `📌 **QUY TRÌNH ĐĂNG KÝ TẠM TRÚ (РЕГИСТРАЦИЯ) TẠI NGA:**

1. **Thời hạn quy định:**
- Theo luật cư trú Liên bang Nga, công dân nước ngoài phải hoàn tất thủ tục đăng ký tạm trú trong vòng **07 ngày làm việc** kể từ ngày nhập cảnh.

2. **Giấy tờ bắt buộc cần có:**
- Hộ chiếu gốc kèm bản dịch công chứng tiếng Nga (Нотариальный перевод паспорта).
- Thẻ di trú (Миграционная карта) có dấu nhập cảnh của biên phòng cửa khẩu.
- Thị thực (Visa) còn hạn hợp lệ (nếu thuộc diện bắt buộc có visa).
- Hợp đồng thuê nhà hoặc giấy tờ bảo lãnh của chủ nhà (hoặc xác nhận của Ký túc xá trường đại học).

3. **Nơi nộp hồ sơ:**
- Ký túc xá trường (nếu là du học sinh - nộp cho phòng Quản lý sinh viên quốc tế).
- Trung tâm dịch vụ công cộng đa chức năng **MFC (Мои Документы)** tại quận bạn cư trú.
- Cơ quan Quản lý Di trú thuộc Bộ Nội vụ Nga (УВМ МВД).

⚠️ *Lưu ý quan trọng:* Luôn giữ phần cuống giấy đăng ký màu xanh/trắng (Отрывной талон) kẹp cùng hộ chiếu. Không đi lại ngoài đường mà thiếu giấy này!`
  },
  {
    keywords: ['troika', 'metro', 'tàu điện', 'тройка', 'метро', 'vé', 'chuyển line', 'xe bus', 'трамвай'],
    titleVi: 'Hướng dẫn đi lại bằng Metro và thẻ Troika',
    responseContent: `🚇 **HƯỚNG DẪN ĐI METRO & DÙNG THẺ TROIKA (КАРТА ТРОЙКА):**

1. **Mua thẻ Troika ở đâu?**
- Bạn có thể mua tại bất kỳ quầy vé có nhân viên (**Касса**) hoặc máy bán vé tự động (**Автомат по продаже билетов**) ở các ga tàu điện ngầm.
- Phí đặt cọc thẻ (залог) khoảng 80-150 RUB (có thể trả lại thẻ để lấy lại tiền cọc).

2. **Cách nạp tiền:**
- Nạp tại máy tự động bằng tiền mặt (tiền giấy RUB) hoặc thẻ ngân hàng (MIR).
- Hoặc nạp qua ứng dụng di động như *Московский транспорт* hoặc *Метро Москвы* (nếu điện thoại hỗ trợ NFC).
- Chọn chế độ nạp ví tiền: **"Кошелёк"** (Ví trả theo từng lượt) hoặc vé tháng 30/90 ngày.

3. **Mẹo đi lại hữu ích:**
- Metro Moscow hoạt động từ **05:30 sáng đến 01:00 đêm**.
- Chuyển tuyến (Переход): chú ý biển báo màu và số tuyến (ví dụ Tuyến 1 Đỏ, Tuyến 2 Xanh lá, Tuyến 5 Vòng tròn).
- Lối ra đường phố luôn ghi là **Выход в город** kèm số cửa thoát hiểm.`
  },
  {
    keywords: ['mùa đông', 'lạnh', 'áo ấm', 'rét', 'nhiệt độ', 'quần áo', 'giày', 'tuyết', 'ấm'],
    titleVi: 'Kinh nghiệm trang phục và giữ ấm mùa đông tại Nga',
    responseContent: `❄️ **KINH NGHIỆM GIỮ ẤM MÙA ĐÔNG NƯỚC NGA (-15°C ĐẾN -30°C):**

1. **Nguyên tắc mặc nhiều lớp (Layering):**
- **Lớp 1 (Sát da):** Quần áo giữ nhiệt (Термобельё). Chọn loại sợi tổng hợp hoặc len merino giúp thoát mồ hôi và giữ nhiệt tốt. Tránh mặc cotton sát da vì giữ ẩm gây lạnh.
- **Lớp 2 (Giữa):** Áo len dày, áo nỉ fleece (флис) hoặc áo hoodie ấm.
- **Lớp 3 (Ngoài cùng):** Áo khoác lông vũ dài qua hông (Пуховик), có mũ trùm đầu (капюшон) và chất liệu chống gió, chống thấm nước tuyết.

2. **Giày dép và tất:**
- Chọn giày bốt mùa đông có lớp lót lông thú hoặc nỉ len (Зимние ботинки на меху).
- Đế giày phải là cao su có rãnh sâu chống trơn trượt (đóng băng trên vỉa hè rất trơn!).
- Mua size giày lớn hơn 0.5 - 1 size để có thể đi tất len dày.

3. **Phụ kiện bảo vệ các chi:**
- Mũ len trùm kín tai (Шапка).
- Khăn quàng cổ hoặc khăn ống len (Шарф).
- Găng tay da chống gió có lót nỉ hoặc găng tay len dày (Перчатки / Варежки).
- Son dưỡng môi (Гигиеническая помада) và kem dưỡng ẩm da mặt chống nứt nẻ vì không khí mùa đông Nga rất khô!`
  },
  {
    keywords: ['cấp cứu', 'thuốc', 'ốm', 'bệnh viện', 'bác sĩ', '112', '103', 'аптека', 'đau đầu', 'sốt'],
    titleVi: 'Y tế, cấp cứu khẩn cấp và tên thuốc thông dụng',
    responseContent: `🏥 **CẤP CỨU Y TẾ & THUỐC THIẾT YẾU TẠI NGA:**

1. **Các số điện thoại khẩn cấp (Miễn phí từ di động):**
- **112**: Tổng đài cứu hộ khẩn cấp quốc gia (có hỗ trợ tiếng Nga và cơ bản tiếng Anh).
- **103** (hoặc 03): Cấp cứu y tế nhanh (Скорая медицинская помощь).
- **101**: Cứu hỏa (Пожарная служба).
- **102**: Cảnh sát (Полиция).

2. **Cách mua thuốc tại hiệu thuốc (Аптека):**
- Hiệu thuốc mở 24/7 gọi là: **Дежурная аптека 24 часа**.
- Nhiều loại kháng sinh tại Nga bắt buộc phải có đơn thuốc của bác sĩ (по рецепту).
- Tuy nhiên, các thuốc cảm, hạ sốt, đau họng, tiêu hóa thì mua tự do (без рецепта).

3. **Tên các loại thuốc thông dụng không cần đơn:**
- Hạ sốt / giảm đau: **Парацетамол** (Paracetamol), **Ибупрофен** (Ibuprofen), **Терафлю** (Theraflu).
- Đau họng / viêm họng: **Стрепсилс** (Strepsils), **Гексорал** (Hexoral).
- Xịt nghẹt mũi: **Снуп** (Snoop), **Отривин** (Otrivin).
- Rối loạn tiêu hóa / ngộ độc: **Активированный уголь** (Than hoạt tính), **Смекта** (Smecta).
- Dầu gió / cao xoa bóp: **Звёздочка** (Cao Sao Vàng - rất phổ biến tại Nga!).`
  },
  {
    keywords: ['ngân hàng', 'thẻ', 'mir', 'sberbank', 'vtb', 'tiền', 'руб', 'chuyển tiền', 'мир'],
    titleVi: 'Mở tài khoản ngân hàng và thẻ MIR tại Nga',
    responseContent: `💳 **HƯỚNG DẪN MỞ TÀI KHOẢN VÀ THẺ NGÂN HÀNG MIR (КАРТА МИР):**

1. **Các ngân hàng lớn, uy tín tại Nga:**
- **Sberbank (Сбербанк)**: Ngân hàng quốc doanh lớn nhất, chi nhánh và cây ATM có ở khắp mọi nơi.
- **VTB (ВТБ)**: Ngân hàng uy tín, hỗ trợ sinh viên nhiều trường đại học lớn.
- **T-Bank / Tinkoff (Т-Банк)**: Ngân hàng số tiện lợi, giao thẻ tận nơi qua nhân viên chuyển phát.

2. **Hồ sơ cần mang theo khi ra ngân hàng:**
- Hộ chiếu gốc kèm bản dịch công chứng tiếng Nga.
- Thẻ di trú (Миграционная карта).
- Giấy đăng ký tạm trú hợp lệ (Регистрация).
- Số điện thoại di động Nga (MTS, Megafon, Beeline hoặc Tele2) để nhận mã SMS OTP.

3. **Lưu ý thanh toán:**
- Tại Nga, hệ thống thẻ Visa / MasterCard quốc tế bị ngừng hoạt động nội địa.
- Tất cả thanh toán nội địa đều sử dụng hệ thống thẻ **MIR (МИР)** hoặc thanh toán qua mã QR qua hệ thống chuyển khoản nhanh **SBP (СБП - Система быстрых платежей)**.`
  },
  {
    keywords: ['văn hóa', 'ứng xử', 'kiêng kỵ', 'chào', 'tập quán', 'lịch sự', 'giao tiếp', 'phong tục'],
    titleVi: 'Văn hóa ứng xử và những điều kiêng kỵ tại Nga',
    responseContent: `🤝 **VĂN HÓA VÀ NHỮNG QUY TẮC ỨNG XỬ QUAN TRỌNG TẠI NGA:**

1. **Những điều kiêng kỵ tuyệt đối:**
- **Không bắt tay qua ngưỡng cửa:** Người Nga coi ngưỡng cửa là nơi ngăn cách ranh giới tâm linh, bắt tay hoặc đưa đồ qua ngưỡng cửa bị coi là mang lại điều xui xẻo hoặc bất hòa.
- **Bỏ mũ khi bước vào nhà / giảng đường:** Đội mũ trong phòng kín, lớp học hoặc nhà thờ bị coi là thiếu tôn trọng.
- **Cởi áo khoác ngoài tại tủ gửi đồ (Гардероб):** Mọi trường học, rạp hát, bảo tàng ở Nga đều có khu gửi áo khoác miễn phí mùa đông. Luôn gửi áo khoác trước khi vào phòng chính.

2. **Cách xưng hô lịch sự:**
- Dùng **"Вы" (Bạn/Ngài - số nhiều lịch sự)** khi nói chuyện với người lớn tuổi, thầy cô, nhân viên công sở hoặc người lạ mới gặp.
- Chỉ dùng **"ты"** khi nói với bạn bè thân thiết hoặc trẻ em.

3. **Trong phương tiện công cộng:**
- Luôn chủ động nhường ghế cho người già, phụ nữ mang thai và trẻ em trên Metro, xe buýt.
- Giữ trật tự, nói chuyện điện thoại nhỏ tiếng, tránh cười đùa quá lớn tiếng trong toa tàu.`
  }
];

export class LocalKnowledgeProvider implements IAIAssistantProvider {
  readonly providerId = 'offline_local_knowledge';
  readonly providerName = 'Cơ sở tri thức Nga (Ngoại tuyến / Offline)';

  /**
   * Find matching knowledge response based on user keywords
   */
  async sendMessage(
    messages: AssistantMessage[],
    _context?: AssistantContext
  ): Promise<AssistantResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

    if (!lastUserMessage || !lastUserMessage.content.trim()) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'EMPTY_PROMPT',
        error: 'Vui lòng nhập câu hỏi cần trợ giúp.'
      };
    }

    const query = lastUserMessage.content.toLowerCase();

    // Search for best matching knowledge article
    let bestArticle: KnowledgeArticle | null = null;
    let maxMatchCount = 0;

    for (const article of LOCAL_KNOWLEDGE_ARTICLES) {
      let matches = 0;
      for (const kw of article.keywords) {
        if (query.includes(kw.toLowerCase())) {
          matches++;
        }
      }
      if (matches > maxMatchCount) {
        maxMatchCount = matches;
        bestArticle = article;
      }
    }

    let responseText = '';
    if (bestArticle && maxMatchCount > 0) {
      responseText = bestArticle.responseContent;
    } else {
      responseText = `Xin chào! Tôi là Trợ lý AI Hỗ trợ nước Nga (Chế độ Ngoại tuyến).

Hiện tại ứng dụng đang dùng Cơ sở dữ liệu thường trú ngoại tuyến. Bạn có thể hỏi tôi về các chủ đề thiết yếu sau:

1. **Thủ tục đăng ký tạm trú (Регистрация)** và Thẻ di trú.
2. **Đi lại bằng Metro Moscow** và cách mua thẻ Troika.
3. **Kinh nghiệm mặc ấm mùa đông** từ -10°C đến -30°C.
4. **Cấp cứu y tế khẩn cấp 112** và các loại thuốc thông dụng tại hiệu thuốc (Аптека).
5. **Mở tài khoản ngân hàng và thẻ MIR** tại Sberbank, VTB.
6. **Phong tục, kiêng kỵ và văn hóa giao tiếp** người Nga.

Khi có kết nối mạng Internet, Trợ lý sẽ tự động kích hoạt mô hình Gemini AI thế hệ mới để giải đáp chuyên sâu mọi câu hỏi của bạn!`;
    }

    const message: AssistantMessage = {
      id: `msg_offline_${Date.now()}`,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
      provider: this.providerId,
      isFallback: true
    };

    return {
      success: true,
      message,
      durationMs: Date.now() - startTime
    };
  }
}

export const localKnowledgeProvider = new LocalKnowledgeProvider();
