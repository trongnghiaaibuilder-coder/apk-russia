/**
 * Russia AI Support - Offline Capabilities Registry & Health Check
 * Developer: Xương Rồng AI developer
 * Phase: P8 — OFFLINE-FIRST HARDENING
 */

export interface FeatureCapability {
  id: string;
  nameVi: string;
  category: 'learning' | 'dictionary' | 'translation' | 'reallife' | 'camera_ocr' | 'assistant' | 'voice';
  isOfflineCapable: boolean;
  offlineBehaviorVi: string;
  onlineEnhancementVi?: string;
  dataStorageType: 'bundle_in_memory' | 'local_storage' | 'cache_storage';
}

export const OFFLINE_FEATURE_REGISTRY: FeatureCapability[] = [
  {
    id: 'learn_cyrillic',
    nameVi: 'Học Bảng chữ cái Cyrillic 33 chữ cái',
    category: 'learning',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Hoạt động 100% ngoại tuyến với toàn bộ bảng chữ cái, phát âm mẫu, quy tắc viết hoa/thường.',
    dataStorageType: 'bundle_in_memory'
  },
  {
    id: 'learn_vocabulary_lessons',
    nameVi: 'Kho Từ vựng, 16 Bài học & Trắc nghiệm Quiz',
    category: 'learning',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Hoạt động 100% ngoại tuyến, theo dõi tiến độ lưu tại LocalStorage.',
    dataStorageType: 'local_storage'
  },
  {
    id: 'dictionary_search',
    nameVi: 'Tra cứu Từ điển Nga-Việt & Biến hình Ngữ pháp',
    category: 'dictionary',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Tra cứu tức thời ngoại tuyến trên toàn bộ cơ sở dữ liệu từ điển tích hợp.',
    dataStorageType: 'bundle_in_memory'
  },
  {
    id: 'reallife_emergency_hotlines',
    nameVi: 'Đường dây nóng Cứu hộ 112 & Sổ tay Đời sống',
    category: 'reallife',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Toàn bộ 9 kịch bản thực tế, số khẩn cấp 112/103/102/101 và mẫu câu có sẵn 100% ngoại tuyến.',
    dataStorageType: 'bundle_in_memory'
  },
  {
    id: 'ocr_signage_presets',
    nameVi: 'Nhận dạng OCR Biển hiệu Nga mẫu',
    category: 'camera_ocr',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Nhận dạng và bóc tách chữ Cyrillic cho các mẫu biển Metro, Nhà thuốc, Vé tàu ngoại tuyến.',
    dataStorageType: 'bundle_in_memory'
  },
  {
    id: 'translation_fallback_history',
    nameVi: 'Dịch thuật Cục bộ & Lịch sử bản dịch',
    category: 'translation',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Tra cứu dịch các từ/câu thông dụng trong từ điển và lưu lại lịch sử ngoại tuyến.',
    onlineEnhancementVi: 'Kết nối mô hình Gemini trực tuyến để dịch văn bản dài bất kỳ.',
    dataStorageType: 'local_storage'
  },
  {
    id: 'ai_assistant_local_knowledge',
    nameVi: 'Trợ lý AI Nước Nga - Tri thức Ngoại tuyến',
    category: 'assistant',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Tự động kích hoạt Cơ sở tri thức ngoại tuyến giải đáp về tạm trú, Metro, mùa đông, y tế.',
    onlineEnhancementVi: 'Kích hoạt mô hình Gemini 2.5 Flash trực tuyến khi có Internet.',
    dataStorageType: 'bundle_in_memory'
  },
  {
    id: 'voice_tts',
    nameVi: 'Phát âm Text-to-Speech (TTS)',
    category: 'voice',
    isOfflineCapable: true,
    offlineBehaviorVi: 'Tận dụng giọng đọc tổng hợp trên thiết bị (Web Speech API) khi thiết bị hỗ trợ.',
    dataStorageType: 'bundle_in_memory'
  }
];

export class OfflineCapabilitiesService {
  getCapabilities(): FeatureCapability[] {
    return OFFLINE_FEATURE_REGISTRY;
  }

  getOfflineCapableRatio(): { total: number; offlineCapable: number; ratioPercent: number } {
    const total = OFFLINE_FEATURE_REGISTRY.length;
    const offlineCapable = OFFLINE_FEATURE_REGISTRY.filter(f => f.isOfflineCapable).length;
    return {
      total,
      offlineCapable,
      ratioPercent: Math.round((offlineCapable / total) * 100)
    };
  }

  isFeatureOffline(featureId: string): boolean {
    const f = OFFLINE_FEATURE_REGISTRY.find(item => item.id === featureId);
    return !!f?.isOfflineCapable;
  }
}

export const offlineCapabilitiesService = new OfflineCapabilitiesService();
