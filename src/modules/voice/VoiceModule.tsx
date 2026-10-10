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
    <div className="space-y-4 v2-fade-up">
      <SectionHeader
        kicker="Trò chuyện bằng giọng nói"
        title="Nói & Trò chuyện"
        subtitle="Dịch giọng nói trực tiếp và trò chuyện hai chiều Việt ↔ Nga"
      />

      {/* Mode Sub-Tab Switcher */}
      <div className="v2-fade-up v2-fade-up-1 flex items-center gap-1.5 p-1 v2-bg-soft border v2-divider rounded-3xl shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('translation')}
          className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
            activeTab === 'translation'
              ? 'v2-accent-bg shadow-sm shadow-rose-950/50'
              : 'v2-text-muted hover:opacity-70 hover:bg-slate-850'
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
              ? 'v2-accent-bg shadow-sm shadow-rose-950/50'
              : 'v2-text-muted hover:opacity-70 hover:bg-slate-850'
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

      {/* Capability status card */}
      <Card variant="flat" padding="md" className="v2-divider space-y-2 v2-bg-soft/60 rounded-3xl v2-fade-up v2-fade-up-2">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 v2-accent-text shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold v2-text">
              Trạng thái giọng nói
            </p>
            <p className="v2-text-muted leading-relaxed text-[11px]">
              Nhận dạng giọng nói và phát âm hoạt động ngay trên điện thoại của bạn, không cần gõ phím.
            </p>
          </div>
        </div>
        <div className="pt-2 border-t v2-divider/80 flex items-center justify-between text-[11px] v2-text-muted">
          <span>Nhận dạng giọng nói: {hasSpeechApi ? 'Sẵn sàng' : 'Không hỗ trợ'}</span>
          <span aria-hidden="true">•</span>
          <span>Phát âm: {hasTtsApi ? 'Sẵn sàng' : 'Không hỗ trợ'}</span>
        </div>
      </Card>
    </div>
  );
};
