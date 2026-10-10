import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Volume2, Copy, Check, Sparkles, MicOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { VoiceDirection, VoiceState } from '../types';
import { voiceOrchestrator } from '../services/voiceTranslationService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { textToSpeechService } from '../services/textToSpeechService';
import { VoiceStatus } from './VoiceStatus';
import { VoiceControls } from './VoiceControls';

export const VoiceMode: React.FC = () => {
  const [direction, setDirection] = useState<VoiceDirection>('vi_to_ru');
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hasSpeechApi = speechRecognitionService.isSupported();
  const hasTtsApi = textToSpeechService.isSupported();

  useEffect(() => {
    const unsubscribe = voiceOrchestrator.subscribe({
      onStateChange: (newState, msg) => {
        setState(newState);
        if (msg) setStatusMessage(msg);
      },
      onTranscriptUpdate: (text) => {
        setTranscript(text);
      },
      onTranslationResult: (_, trans) => {
        setTranslatedText(trans);
      },
    });

    return () => {
      unsubscribe();
      voiceOrchestrator.stop();
    };
  }, []);

  const handleSwapDirection = () => {
    const nextDir: VoiceDirection = direction === 'vi_to_ru' ? 'ru_to_vi' : 'vi_to_ru';
    setDirection(nextDir);
    voiceOrchestrator.setDirection(nextDir);
    setTranscript('');
    setTranslatedText('');
    setStatusMessage(null);
  };

  const handleStartListening = async () => {
    setStatusMessage(null);
    await voiceOrchestrator.startVoiceTranslation(direction);
  };

  const handleStopListening = async () => {
    await speechRecognitionService.stopListening();
  };

  const handleCancel = async () => {
    await voiceOrchestrator.cancel();
    setTranscript('');
    setTranslatedText('');
    setStatusMessage(null);
  };

  const handleReplayTts = async () => {
    if (!translatedText) return;
    const ttsLang = direction === 'vi_to_ru' ? 'ru-RU' : 'vi-VN';
    await textToSpeechService.speak(translatedText, ttsLang);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  // Sample phrases for quick test in preview environment
  const demoSamples = direction === 'vi_to_ru'
    ? ['Xin chào', 'Cảm ơn', 'Bao nhiêu tiền?', 'Nhà vệ sinh ở đâu?', 'Cứu tôi với']
    : ['Здравствуйте', 'Спасибо', 'Сколько это стоит?', 'Где находится туалет?', 'Помогите мне'];

  const handleSelectDemoSample = async (sample: string) => {
    setTranscript(sample);
    const sourceLang = direction === 'vi_to_ru' ? 'vi' : 'ru';
    const targetLang = direction === 'vi_to_ru' ? 'ru' : 'vi';

    const res = await voiceOrchestrator.executeTranslation(sample, sourceLang, targetLang);
    if (res.success) {
      setTranslatedText(res.translatedText);
      const ttsLang = direction === 'vi_to_ru' ? 'ru-RU' : 'vi-VN';
      await textToSpeechService.speak(res.translatedText, ttsLang);
    } else {
      setStatusMessage(res.error || 'Dịch thuật thất bại.');
    }
  };

  const isViToRu = direction === 'vi_to_ru';

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Direction Switcher Card */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xl select-none" role="img" aria-label="Source Language">
            {isViToRu ? '🇻🇳' : '🇷🇺'}
          </span>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">
              {isViToRu ? 'Tiếng Việt' : 'Русский'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Người nói ({isViToRu ? 'VI' : 'RU'})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwapDirection}
          disabled={state === 'listening'}
          className="w-11 h-11 mx-2 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 border border-slate-700/60"
          aria-label="Đổi chiều dịch giọng nói"
          title="Đổi chiều dịch giọng nói"
        >
          <ArrowLeftRight className="w-4 h-4 text-rose-400" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xl select-none" role="img" aria-label="Target Language">
            {isViToRu ? '🇷🇺' : '🇻🇳'}
          </span>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block">
              {isViToRu ? 'Русский' : 'Tiếng Việt'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Bản dịch TTS ({isViToRu ? 'RU' : 'VI'})
            </span>
          </div>
        </div>
      </div>

      {/* Voice Status Pill */}
      <VoiceStatus state={state} customMessage={statusMessage} />

      {/* Browser Speech API Compatibility Warning if not supported */}
      {!hasSpeechApi && (
        <Card variant="flat" padding="sm" className="border-amber-500/30 bg-amber-950/20 text-xs">
          <div className="flex items-start gap-2.5">
            <MicOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-amber-300">
                Thông tin môi trường trình duyệt
              </p>
              <p className="text-amber-200/90 text-[11px] leading-relaxed">
                Trình duyệt hoặc khung nhúng hiện tại chưa kích hoạt Web Speech Recognition API trực tiếp. Bạn có thể dùng câu thử nghiệm để kiểm tra toàn bộ pipeline dịch thuật P3 và TTS.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Microphone Interaction Component */}
      <Card variant="accent" padding="md" className="border-slate-800 text-center">
        <VoiceControls
          state={state}
          onStart={handleStartListening}
          onStop={handleStopListening}
          onCancel={handleCancel}
          onReplay={translatedText ? handleReplayTts : undefined}
          activeSpeakerLabel={
            state === 'listening'
              ? isViToRu
                ? 'Đang lắng nghe tiếng Việt (vi-VN)...'
                : 'Слушаю русскую речь (ru-RU)...'
              : undefined
          }
        />
      </Card>

      {/* Transcript & Result Cards */}
      {(transcript || translatedText) && (
        <div className="space-y-3 animate-in fade-in">
          {/* Source Transcript */}
          {transcript && (
            <Card variant="default" padding="md" className="space-y-1.5 border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-300">
                  {isViToRu ? 'Lời bạn nói (Tiếng Việt)' : 'Русская речь'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {state === 'listening' ? 'Đang nhận dạng...' : 'Đã nhận dạng'}
                </span>
              </div>
              <p className="text-base text-slate-100 font-medium select-text">
                {transcript}
              </p>
            </Card>
          )}

          {/* Translated Text Result */}
          {translatedText && (
            <Card variant="accent" padding="md" className="space-y-2.5 border-rose-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-rose-300">
                  {isViToRu ? 'Bản dịch tiếng Nga (P3 Engine)' : 'Bản dịch tiếng Việt (P3 Engine)'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleReplayTts}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Nghe lại phát âm (TTS)"
                    aria-label="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Sao chép"
                    aria-label="Sao chép"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-lg font-bold text-white leading-relaxed select-text font-sans">
                {translatedText}
              </p>
              <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                <span>TTS: {isViToRu ? 'ru-RU' : 'vi-VN'}</span>
                <span>{hasTtsApi ? 'Âm thanh đã kích hoạt' : 'TTS không khả dụng'}</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Quick Test Demo Samples */}
      <div className="space-y-1.5 px-1 pt-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>Mẫu thử nghiệm giọng nói nhanh (P3 Fallback):</span>
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {demoSamples.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDemoSample(phrase)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
