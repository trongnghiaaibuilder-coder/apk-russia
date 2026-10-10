import React, { useState } from 'react';
import { Mic, MessageSquare, Info } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { VoiceMode } from './components/VoiceMode';
import { ConversationMode } from './components/ConversationMode';
import { speechRecognitionService } from './services/speechRecognitionService';
import { textToSpeechService } from './services/textToSpeechService';

export interface VoiceModuleProps {
  initialMode?: 'translation' | 'conversation';
  onClose?: () => void;
}

export const VoiceModule: React.FC<VoiceModuleProps> = ({
  initialMode = 'translation',
}) => {
  const [activeTab, setActiveTab] = useState<'translation' | 'conversation'>(initialMode);
  const hasSpeechApi = speechRecognitionService.isSupported();
  const hasTtsApi = textToSpeechService.isSupported();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        kicker="Hệ thống Voice & Hội thoại P4"
        title="Voice & 2-Way Conversation"
        subtitle="Dịch giọng nói trực tiếp & đàm thoại hai chiều Việt ↔ Nga với Text-to-Speech"
      />

      {/* Mode Sub-Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('translation')}
          className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
            activeTab === 'translation'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-950/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Dịch Giọng Nói</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('conversation')}
          className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
            activeTab === 'conversation'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-950/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hội Thoại 2 Chiều</span>
        </button>
      </div>

      {/* Mode Content */}
      <div className="pt-1">
        {activeTab === 'translation' ? <VoiceMode /> : <ConversationMode />}
      </div>

      {/* Architecture & Verification Guarantee Card */}
      <Card variant="flat" padding="md" className="border-slate-800 space-y-2 bg-slate-900/60">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-slate-200">
              Kiến trúc Voice P4 (No Fake AI & Real Integration)
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Tái sử dụng trực tiếp động cơ dịch thuật P3 và các chuẩn Web Speech API. Báo cáo trung thực tình trạng microphone và công cụ TTS, bảo đảm không giả mạo kết quả.
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Speech Recognition: {hasSpeechApi ? 'Sẵn sàng' : 'Không hỗ trợ'}</span>
          <span aria-hidden="true">•</span>
          <span>TTS Synthesizer: {hasTtsApi ? 'Sẵn sàng' : 'Không hỗ trợ'}</span>
        </div>
      </Card>
    </div>
  );
};
