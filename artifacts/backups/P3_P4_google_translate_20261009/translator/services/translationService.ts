/**
 * Translation Provider Abstraction & Engine Service
 * Developer: Xương Rồng AI developer
 * Phase: P3 — TRANSLATION ENGINE
 * Strict "NO FAKE AI" Guarantee:
 * - When an external translation provider is not configured, arbitrary text is NEVER falsely claimed as translated.
 * - An explicitly labeled local fallback demo dictionary is provided for test/offline verification.
 */
import { TranslationRequest, TranslationResponse, TranslationResult, TranslationProviderConfig } from '../types';
import { logger } from '../../../services/logger';

export const MAX_TRANSLATION_CHARS = 500;

interface DemoPair {
  vi: string;
  ru: string;
}

export const LOCAL_DEMO_DICTIONARY: DemoPair[] = [
  { vi: 'Xin chào', ru: 'Здравствуйте' },
  { vi: 'Chào bạn', ru: 'Привет' },
  { vi: 'Cảm ơn', ru: 'Спасибо' },
  { vi: 'Cảm ơn rất nhiều', ru: 'Большое спасибо' },
  { vi: 'Xin lỗi', ru: 'Извините' },
  { vi: 'Tạm biệt', ru: 'До свидания' },
  { vi: 'Hẹn gặp lại', ru: 'До встречи' },
  { vi: 'Bao nhiêu tiền', ru: 'Сколько это стоит?' },
  { vi: 'Bao nhiêu tiền?', ru: 'Сколько это стоит?' },
  { vi: 'Nhà vệ sinh ở đâu', ru: 'Где находится туалет?' },
  { vi: 'Nhà vệ sinh ở đâu?', ru: 'Где находится туалет?' },
  { vi: 'Cứu tôi với', ru: 'Помогите мне' },
  { vi: 'Tôi không hiểu', ru: 'Я не понимаю' },
  { vi: 'Tôi đến từ Việt Nam', ru: 'Я из Вьетнама' },
  { vi: 'Chúc ngủ ngon', ru: 'Спокойной ночи' },
  { vi: 'Làm ơn', ru: 'Пожалуйста' },
  { vi: 'Vâng', ru: 'Да' },
  { vi: 'Không', ru: 'Нет' },
];

const normalizeKey = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]/g, '');

export const translationService = {
  getProviderConfig(): TranslationProviderConfig {
    const endpoint = typeof process !== 'undefined' && process.env?.VITE_TRANSLATION_API_ENDPOINT
      ? process.env.VITE_TRANSLATION_API_ENDPOINT
      : '';

    return {
      providerName: endpoint ? 'External API Proxy' : 'Local Fallback (Demo Only)',
      isConfigured: Boolean(endpoint),
      endpoint: endpoint || undefined,
      timeoutMs: 5000,
    };
  },

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, sourceLang, targetLang } = request;

    // 1. Input Validation: Empty check
    if (!text || !text.trim()) {
      return {
        success: false,
        error: 'Vui lòng nhập văn bản cần dịch.',
      };
    }

    // 2. Input Validation: Language pair check
    if (sourceLang === targetLang) {
      return {
        success: false,
        error: 'Ngôn ngữ nguồn và ngôn ngữ đích phải khác nhau.',
      };
    }

    if (!['vi', 'ru'].includes(sourceLang) || !['vi', 'ru'].includes(targetLang)) {
      return {
        success: false,
        error: 'Chỉ hỗ trợ cặp ngôn ngữ Tiếng Việt (vi) và Tiếng Nga (ru).',
      };
    }

    // 3. Input Validation: Character limit check
    const trimmed = text.trim();
    if (trimmed.length > MAX_TRANSLATION_CHARS) {
      return {
        success: false,
        error: `Vượt quá giới hạn ${MAX_TRANSLATION_CHARS} ký tự (hiện có ${trimmed.length} ký tự).`,
      };
    }

    const providerConfig = this.getProviderConfig();

    // 4. If external provider configured, attempt real translation
    if (providerConfig.isConfigured && providerConfig.endpoint) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), providerConfig.timeoutMs || 5000);

        const response = await fetch(providerConfig.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: trimmed,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`Máy chủ dịch vụ báo lỗi: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || typeof data.translatedText !== 'string') {
          throw new Error('Định dạng phản hồi từ nhà cung cấp dịch vụ không hợp lệ.');
        }

        const result: TranslationResult = {
          id: `trans-${Date.now()}`,
          sourceText: trimmed,
          translatedText: data.translatedText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          provider: 'external_provider',
          timestamp: new Date().toISOString(),
          isFallback: false,
        };

        return { success: true, result };
      } catch (err) {
        logger.warn('TranslationService', 'External provider call failed, checking local demo fallback', err);
      }
    }

    // 5. Deterministic Local Fallback (for demo/test pairs and offline dictionary/signs)
    const normalizedInput = normalizeKey(trimmed);
    let match = '';

    if (sourceLang === 'vi' && targetLang === 'ru') {
      const found = LOCAL_DEMO_DICTIONARY.find((item) => normalizeKey(item.vi) === normalizedInput);
      if (found) {
        match = found.ru;
      } else {
        // Check dictionary dataset for Vietnamese term
        try {
          const { dictionaryService } = await import('../../../data/dictionary');
          const searchRes = dictionaryService.search(trimmed);
          if (searchRes.matches.length > 0) {
            match = searchRes.matches[0].entry.lemma;
          }
        } catch {}
      }
    } else if (sourceLang === 'ru' && targetLang === 'vi') {
      const found = LOCAL_DEMO_DICTIONARY.find((item) => normalizeKey(item.ru) === normalizedInput);
      if (found) {
        match = found.vi;
      } else {
        // Check realistic signage samples for full sign match
        try {
          const { REALISTIC_RUSSIAN_SIGN_SAMPLES } = await import('../../camera/services/ocrService');
          const signMatch = REALISTIC_RUSSIAN_SIGN_SAMPLES.find(
            s => normalizeKey(s.sampleTextRu) === normalizedInput || normalizeKey(s.sampleTextRu).includes(normalizedInput)
          );
          if (signMatch && signMatch.expectedTranslationVi) {
            match = signMatch.expectedTranslationVi;
          }
        } catch {}

        // If not found in signs, search Russian dictionary
        if (!match) {
          try {
            const { dictionaryService } = await import('../../../data/dictionary');
            const searchRes = dictionaryService.search(trimmed);
            if (searchRes.matches.length > 0 && searchRes.matches[0].entry.meanings.length > 0) {
              match = searchRes.matches[0].entry.meanings[0].vi;
            }
          } catch {}
        }
      }
    }

    if (match) {
      const result: TranslationResult = {
        id: `trans-fallback-${Date.now()}`,
        sourceText: trimmed,
        translatedText: match,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        provider: 'local_fallback_demo',
        timestamp: new Date().toISOString(),
        isFallback: true,
      };
      return { success: true, result, isFallback: true };
    }

    // 6. NO FAKE AI: Honest notification for arbitrary unconfigured text
    return {
      success: false,
      error:
        'Nhà cung cấp dịch vụ dịch thuật trực tiếp chưa được cấu hình (P3 Foundation). Bạn có thể thử nghiệm các mẫu câu demo có sẵn (ví dụ: "Xin chào", "Cảm ơn", "Xin lỗi", "Bao nhiêu tiền?", "Nhà vệ sinh ở đâu?").',
    };
  },
};
