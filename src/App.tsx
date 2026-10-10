/**
 * Nước Nga Trong Tầm Tay - Master Application Root
 * Mobile-First Android Application
 */

import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Banknote,
  BookOpen,
  Languages,
  Mic,
  Camera,
  Bot,
  ShieldAlert,
  ChevronRight,
  Flame,
  GraduationCap,
  MessageCircle,
  ScanLine,
} from 'lucide-react';
import { TabId } from './types/navigation';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LearningModule } from './modules/learning';
import { TranslatorModule } from './modules/translator';
import { VoiceModule } from './modules/voice';
import { CameraModule } from './modules/camera';
import { AssistantModule } from './modules/assistant';
import { RealLifeModule } from './modules/reallife';
import { SettingsView } from './components/SettingsView';
import { safeStorage } from './services/storage';
import { updateService, UpdateInfo } from './services/updateService';
import { Onboarding, ONBOARDING_KEY } from './components/Onboarding';
import { MapsView } from './modules/maps/components/MapsView';
import { CurrencyConverter } from './modules/currency/components/CurrencyConverter';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [prefilledTranslateText, setPrefilledTranslateText] = useState<string>('');
  const isOnline = useOnlineStatus();
  const [pendingUpdate, setPendingUpdate] = useState<UpdateInfo | null>(null);
  // Hiện hướng dẫn nếu chưa từng hoàn thành
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return safeStorage.getItem<string>(ONBOARDING_KEY, '') !== 'done';
    } catch {
      return true;
    }
  });

  const handleOnboardingComplete = () => {
    try {
      safeStorage.setItem(ONBOARDING_KEY, 'done');
    } catch {}
    setShowOnboarding(false);
  };

  // Tự động kiểm tra cập nhật mỗi khi mở app (tối đa 1 lần/ngày)
  // Bọc try/catch kỹ để không bao giờ làm crash app
  useEffect(() => {
    try {
      const lastAuto = safeStorage.getItem<string>('auto_update_last', '');
      const today = new Date().toDateString();
      if (lastAuto === today) return;
      const timer = window.setTimeout(async () => {
        try {
          const result = await updateService.checkForUpdate();
          if (result && result.hasUpdate && result.updateInfo) {
            setPendingUpdate(result.updateInfo);
          }
          try { safeStorage.setItem('auto_update_last', today); } catch {}
        } catch {}
      }, 5000);
      return () => window.clearTimeout(timer);
    } catch {}
  }, []);

  const handleOcrSendToTranslate = (russianText: string) => {
    setPrefilledTranslateText(russianText);
    setCurrentTab('translate');
  };

  const features = [
    {
      id: 'learn' as TabId,
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Học tiếng Nga',
      desc: 'Bảng chữ cái, từ vựng, mẫu câu',
      gradient: 'from-red-500 to-rose-600',
      glow: 'shadow-red-950/40',
    },
    {
      id: 'translate' as TabId,
      icon: <Languages className="w-6 h-6" />,
      title: 'Dịch thuật',
      desc: 'Việt ↔ Nga hai chiều',
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'shadow-blue-950/40',
    },
    {
      id: 'voice' as TabId,
      icon: <Mic className="w-6 h-6" />,
      title: 'Luyện nói',
      desc: 'Phát âm & hội thoại',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-950/40',
    },
    {
      id: 'camera' as TabId,
      icon: <ScanLine className="w-6 h-6" />,
      title: 'Quét biển báo',
      desc: 'Chụp ảnh dịch chữ Nga',
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-950/40',
    },
    {
      id: 'assistant' as TabId,
      icon: <Bot className="w-6 h-6" />,
      title: 'Trợ lý AI',
      desc: 'Hỏi đáp mọi thắc mắc',
      gradient: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-950/40',
    },
    {
      id: 'emergency' as TabId,
      icon: <ShieldAlert className="w-6 h-6" />,
      title: 'SOS khẩn cấp',
      desc: 'Số cứu nạn & mẫu câu',
      gradient: 'from-rose-600 to-red-700',
      glow: 'shadow-rose-950/40',
    },
    {
      id: 'maps' as TabId,
      icon: <MapIcon className="w-6 h-6" />,
      title: 'Bản đồ',
      desc: 'Chỉ đường & địa điểm',
      gradient: 'from-sky-500 to-cyan-600',
      glow: 'shadow-sky-950/40',
    },
    {
      id: 'currency' as TabId,
      icon: <Banknote className="w-6 h-6" />,
      title: 'Đổi tiền',
      desc: 'VND ↔ RUB nhanh',
      gradient: 'from-emerald-500 to-green-600',
      glow: 'shadow-emerald-950/40',
    },
  ];

  const renderHomeDashboard = () => (
    <div className="space-y-5">
      {/* Quick stats */}
      <div className="v2-fade-up v2-fade-up-1 grid grid-cols-3 gap-2.5">
        {[
          { icon: <BookOpen className="w-4 h-4" />, value: '300+', label: 'Từ vựng' },
          { icon: <MessageCircle className="w-4 h-4" />, value: '100%', label: 'Ngoại tuyến' },
          { icon: <Flame className="w-4 h-4" />, value: '16', label: 'Bài học' },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl v2-card p-3 text-center backdrop-blur-sm"
          >
            <div className="flex justify-center v2-accent-text mb-1">{s.icon}</div>
            <div className="text-lg font-black v2-text">{s.value}</div>
            <div className="text-[11px] v2-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features grid */}
      <div>
        <h2 className="v2-fade-up v2-fade-up-2 text-[15px] font-bold v2-text mb-3 px-1">
          Khám phá tính năng
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setCurrentTab(f.id)}
              className={`v2-fade-up v2-fade-up-${Math.min(i, 4)} group text-left rounded-3xl p-4 bg-gradient-to-br ${f.gradient} shadow-xl ${f.glow} active:scale-[0.97] transition-transform cursor-pointer overflow-hidden relative`}
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3">
                  {f.icon}
                </div>
                <div className="text-[15px] font-bold text-white">{f.title}</div>
                <div className="text-[12px] text-white/75 mt-0.5">{f.desc}</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-white/90 mt-2">
                  <span>Mở ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily tip */}
      <div className="v2-fade-up v2-fade-up-3 rounded-3xl v2-card p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="text-[13px] font-bold v2-text mb-1">Mẹo hôm nay</div>
            <p className="text-[12px] v2-text-muted leading-relaxed">
              Chạm vào biểu tượng loa 🔊 ở bất kỳ từ vựng nào để nghe phát âm chuẩn tiếng Nga.
              Ứng dụng hoạt động hoàn toàn không cần mạng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const handleUpdateNow = async () => {
    if (!pendingUpdate) return;
    const result = await updateService.downloadAndInstall(pendingUpdate.apkUrl);
    if (result.success) {
      setPendingUpdate(null);
    }
  };

  const handleDismissUpdate = () => {
    if (pendingUpdate) {
      updateService.skipVersion(pendingUpdate.versionCode);
      setPendingUpdate(null);
    }
  };

  return (
    <ErrorBoundary>
      {/* Hướng dẫn lần đầu mở app */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Banner cập nhật tự động */}
      {pendingUpdate && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-2 pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto v2-fade-up rounded-2xl v2-accent-bg shadow-2xl p-3.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white">Có bản mới: {pendingUpdate.versionName}</p>
              <p className="text-[11px] text-white/80 truncate">{pendingUpdate.releaseNotes || 'Cập nhật để có tính năng mới nhất'}</p>
            </div>
            <button
              onClick={handleUpdateNow}
              className="px-3.5 py-2 rounded-xl bg-white text-[12px] font-bold text-black active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              Cập nhật
            </button>
            {!pendingUpdate.mandatory && (
              <button
                onClick={handleDismissUpdate}
                className="text-white/70 text-[11px] underline shrink-0 cursor-pointer"
              >
                Để sau
              </button>
            )}
          </div>
        </div>
      )}
      <AppShell
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        isOnline={isOnline}
        onOpenInfo={() => setIsInfoOpen(true)}
        onTriggerEmergency={() => setCurrentTab('emergency')}
      >
        {currentTab === 'home' && renderHomeDashboard()}
        {currentTab === 'learn' && <LearningModule />}
        {currentTab === 'translate' && (
          <TranslatorModule
            initialText={prefilledTranslateText}
            initialSourceLang={prefilledTranslateText ? 'ru' : 'vi'}
            onOpenVoice={() => setCurrentTab('voice')}
            onOpenCamera={() => setCurrentTab('camera')}
          />
        )}
        {currentTab === 'voice' && <VoiceModule />}
        {currentTab === 'camera' && (
          <CameraModule
            onSendToTranslate={handleOcrSendToTranslate}
            onClose={() => setCurrentTab('home')}
          />
        )}
        {currentTab === 'assistant' && <AssistantModule />}
        {currentTab === 'emergency' && <RealLifeModule />}
        {currentTab === 'settings' && <SettingsView isOnline={isOnline} />}
        {currentTab === 'maps' && <MapsView />}
        {currentTab === 'currency' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold v2-text">Đổi tiền</h2>
            <CurrencyConverter />
          </div>
        )}
      </AppShell>

      {/* Info modal */}
      {isInfoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl v2-card border-t p-6 pb-8 v2-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <h3 className="text-lg font-bold v2-text mb-3">Về ứng dụng</h3>
            <p className="text-[13px] v2-text-muted leading-relaxed">
              <strong className="v2-text">Nước Nga Trong Tầm Tay</strong> là người bạn đồng hành
              của cộng đồng người Việt tại Liên bang Nga — học tiếng Nga, dịch thuật hai chiều,
              quét biển báo và cẩm nang sinh tồn, tất cả hoạt động ngoại tuyến.
            </p>
            <p className="text-[12px] v2-text-faint mt-3 text-center font-semibold">
              Phát triển bởi Xương Rồng AI Developer
            </p>
            <button
              onClick={() => setIsInfoOpen(false)}
              className="mt-5 w-full py-3 rounded-2xl v2-accent-bg text-sm font-bold active:scale-[0.98] transition-transform cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
