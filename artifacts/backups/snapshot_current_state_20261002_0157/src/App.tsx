/**
 * Russia AI Support - Master Application Root
 * Developer Credit: Xương Rồng AI developer
 * Platform: Mobile-First Android Application
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Languages, 
  Mic, 
  Camera, 
  Bot, 
  ShieldAlert, 
  Settings, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  RotateCcw
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
import { safeStorage } from './services/storage';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [prefilledTranslateText, setPrefilledTranslateText] = useState<string>('');
  const isOnline = useOnlineStatus();

  // Handle OCR text dispatched to translator
  const handleOcrSendToTranslate = (russianText: string) => {
    setPrefilledTranslateText(russianText);
    setCurrentTab('translate');
  };

  const handleClearAllStorage = () => {
    if (typeof window !== 'undefined' && window.confirm('Bạn có chắc muốn làm mới toàn bộ tiến độ học và lịch sử?')) {
      safeStorage.clear();
      window.location.reload();
    }
  };

  const renderHomeDashboard = () => (
    <div className="space-y-4 pb-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 p-5 text-white shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Xương Rồng AI developer • v1.0.0</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Nước Nga trong tầm tay
          </h2>
          <p className="text-xs text-white/90 leading-relaxed max-w-sm">
            Học tiếng Nga, dịch thuật hai chiều, hội thoại giọng nói, quét biển báo OCR và cẩm nang sinh tồn ngoại tuyến.
          </p>
        </div>

        {/* Decorative Russian Tricolor Glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl" />
      </div>

      {/* Primary Feature Actions Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Learning */}
        <div
          onClick={() => setCurrentTab('learn')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition">
              Học tiếng Nga
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              33 Cyrillic, 113+ từ, 16 bài học
            </p>
          </div>
        </div>

        {/* Translation */}
        <div
          onClick={() => setCurrentTab('translate')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition">
              Dịch thuật
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Việt ↔ Nga tra cứu từ điển
            </p>
          </div>
        </div>

        {/* Voice 2-Way */}
        <div
          onClick={() => setCurrentTab('voice')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
              Hội thoại giọng nói
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              2 chiều: Bạn nói & Người Nga nói
            </p>
          </div>
        </div>

        {/* Camera OCR */}
        <div
          onClick={() => setCurrentTab('camera')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
              Quét biển hiệu OCR
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Metro, vé tàu, thực đơn, hiệu thuốc
            </p>
          </div>
        </div>

        {/* AI Assistant */}
        <div
          onClick={() => setCurrentTab('assistant')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-purple-400 transition">
              Trợ lý AI Nước Nga
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tạm trú, Troika, thủ tục di trú
            </p>
          </div>
        </div>

        {/* Emergency & Survival */}
        <div
          onClick={() => setCurrentTab('emergency')}
          className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 hover:border-red-500/50 hover:bg-red-950/60 cursor-pointer transition flex flex-col justify-between gap-3 group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition">
              Cứu hộ 112 & Đời sống
            </h3>
            <p className="text-[11px] text-red-300/80 mt-0.5">
              Đường dây nóng, y tế, bảo hộ
            </p>
          </div>
        </div>
      </div>

      {/* Practical Russian Phrase of the Day */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Mẫu câu thông dụng hôm nay
          </span>
          <span className="text-[10px] text-slate-500 font-mono">A1 Căn bản</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Здравствуйте! Скажите, пожалуйста...</p>
          <p className="text-xs text-red-300 font-mono mt-0.5">🗣 Zdrást-vuy-tye! Ska-zhí-tye, pa-zhá-luy-sta...</p>
          <p className="text-xs text-slate-400 mt-1">Xin chào! Làm ơn cho tôi hỏi...</p>
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-4 pb-8 max-w-lg mx-auto">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-500" />
          Cài đặt & Thông tin Ứng dụng
        </h3>

        <div className="space-y-2 text-xs divide-y divide-slate-800">
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Tên ứng dụng</span>
            <span className="text-white font-medium">Russia AI Support</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Phiên bản</span>
            <span className="font-mono text-white">v1.0.0 (Release Candidate)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Nhà phát triển</span>
            <span className="text-red-400 font-semibold">Xương Rồng AI developer</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Trạng thái kết nối</span>
            <span className={isOnline ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {isOnline ? 'Trực tuyến (Online)' : 'Ngoại tuyến (Offline-First)'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Dữ liệu lưu trữ</span>
            <span className="text-slate-300">Bộ nhớ thiết bị cục bộ</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAllStorage}
            className="w-full text-xs text-red-400 border-red-900/60 hover:bg-red-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới dữ liệu & lịch sử học
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
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
        {currentTab === 'settings' && renderSettingsView()}
      </AppShell>

      {/* Info & About Modal */}
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="Thông tin Russia AI Support"
      >
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            <strong className="text-white">Russia AI Support</strong> là ứng dụng di động toàn diện hỗ trợ cộng đồng người Việt Nam học tập, làm việc, sinh sống và du lịch tại Liên bang Nga.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="text-red-400 font-semibold">Tác giả & Nhà phát triển:</p>
            <p className="text-white font-medium">Xương Rồng AI developer</p>
          </div>
          <p>
            Ứng dụng được thiết kế theo kiến trúc <strong>Offline-First</strong>: toàn bộ bảng chữ cái, 113+ từ vựng, 16 bài học, số cứu nạn 112 và mẫu câu giao tiếp đều sẵn sàng 100% khi không có mạng Internet.
          </p>
        </div>
      </Modal>
    </ErrorBoundary>
  );
}
