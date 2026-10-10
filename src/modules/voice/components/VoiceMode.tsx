import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Volume2, Copy, Check, Sparkles, MicOff } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { VoiceDirection, VoiceState } from '../types';
import { voiceOrchestrator } from '../services/voiceTranslationService';
import { DIALOGUE_PHRASES, DIALOGUE_CATEGORIES } from '../../../data/dialoguePhrases';
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

  // Dialogue phrasebook — quick test phrases from the built-in collection
  const [phraseCategory, setPhraseCategory] = useState<string>(DIALOGUE_CATEGORIES[0]);
  const demoSamples: string[] = DIALOGUE_PHRASES.filter((p) => p.category === phraseCategory).map((p) =>
    direction === 'vi_to_ru' ? p.vi : p.ru
  );

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
    <div className="space-y-4 v2-fade-up">
      {/* Direction Switcher Card */}
      <div className="v2-fade-up v2-fade-up-1 flex items-center justify-between p-2 rounded-3xl v2-bg-soft border v2-divider shadow-sm">
        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl v2-bg/60 border v2-divider/80">
          <span className="text-xl select-none" role="img" aria-label="Source Language">
            {isViToRu ? '🇻🇳' : '🇷🇺'}
          </span>
          <div className="text-left">
            <span className="text-xs font-semibold v2-text block">
              {isViToRu ? 'Tiếng Việt' : 'Русский'}
            </span>
            <span className="text-[10px] v2-text-muted block">
              Người nói
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwapDirection}
          disabled={state === 'listening'}
          className="w-11 h-11 mx-2 flex items-center justify-center rounded-xl v2-card v2-text-muted hover:opacity-70 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          aria-label="Đổi chiều dịch giọng nói"
          title="Đổi chiều dịch giọng nói"
        >
          <ArrowLeftRight className="w-4 h-4 v2-accent-text" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl v2-bg/60 border v2-divider/80">
          <span className="text-xl select-none" role="img" aria-label="Target Language">
            {isViToRu ? '🇷🇺' : '🇻🇳'}
          </span>
          <div className="text-left">
            <span className="text-xs font-semibold v2-text block">
              {isViToRu ? 'Русский' : 'Tiếng Việt'}
            </span>
            <span className="text-[10px] v2-text-muted block">
              Bản dịch
            </span>
          </div>
        </div>
      </div>

      {/* Voice Status Pill */}
      <VoiceStatus state={state} customMessage={statusMessage} />

      {/* Compatibility notice when speech recognition is unavailable */}
      {!hasSpeechApi && (
        <Card variant="flat" padding="sm" className="border-amber-500/30 bg-amber-950/20 text-xs rounded-3xl v2-fade-up">
          <div className="flex items-start gap-2.5">
            <MicOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-amber-300">
                Chưa hỗ trợ nhận dạng giọng nói
              </p>
              <p className="text-amber-200/90 text-[11px] leading-relaxed">
                Điện thoại hiện chưa hỗ trợ nhận dạng giọng nói trực tiếp. Bạn vẫn có thể dùng các câu mẫu bên dưới để nghe thử bản dịch.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Microphone Interaction Component */}
      <Card variant="accent" padding="md" className="v2-divider text-center rounded-3xl v2-fade-up v2-fade-up-2">
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
        <div className="space-y-3 v2-fade-up">
          {/* Source Transcript */}
          {transcript && (
            <Card variant="default" padding="md" className="space-y-1.5 v2-divider rounded-3xl">
              <div className="flex items-center justify-between text-xs v2-text-muted border-b v2-divider pb-1.5">
                <span className="font-semibold v2-text-muted">
                  {isViToRu ? 'Lời bạn nói (Tiếng Việt)' : 'Русская речь'}
                </span>
                <span className="text-[10px] v2-text-faint font-mono">
                  {state === 'listening' ? 'Đang nhận dạng...' : 'Đã nhận dạng'}
                </span>
              </div>
              <p className="text-base v2-text font-medium select-text">
                {transcript}
              </p>
            </Card>
          )}

          {/* Translated Text Result */}
          {translatedText && (
            <Card variant="accent" padding="md" className="space-y-2.5 border-rose-500/30 rounded-3xl">
              <div className="flex items-center justify-between border-b v2-divider pb-2">
                <span className="text-xs font-semibold v2-accent-text">
                  {isViToRu ? 'Bản dịch tiếng Nga' : 'Bản dịch tiếng Việt'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleReplayTts}
                    className="p-1.5 rounded-lg v2-card v2-text-muted hover:opacity-70 transition-colors cursor-pointer"
                    title="Nghe lại phát âm"
                    aria-label="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg v2-card v2-text-muted hover:opacity-70 transition-colors cursor-pointer"
                    title="Sao chép"
                    aria-label="Sao chép"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-lg font-bold v2-text leading-relaxed select-text font-sans">
                {translatedText}
              </p>
              <div className="pt-1 text-[11px] v2-text-muted flex items-center justify-between">
                <span>Giọng đọc: {isViToRu ? 'Tiếng Nga' : 'Tiếng Việt'}</span>
                <span>{hasTtsApi ? 'Âm thanh đã sẵn sàng' : 'Chưa hỗ trợ phát âm'}</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Quick demo samples with categories */}
      <div className="space-y-2 px-1 pt-1 v2-fade-up v2-fade-up-3">
        <span className="text-[10px] v2-text-muted uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 v2-accent-text" />
          <span>Kho câu đối thoại ({DIALOGUE_PHRASES.length} câu):</span>
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DIALOGUE_CATEGORIES.map((cat: string) => (
            <button
              key={cat}
              type="button"
              onClick={() => setPhraseCategory(cat)}
              className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                phraseCategory === cat
                  ? 'v2-accent-bg border-transparent font-semibold'
                  : 'v2-bg-soft v2-text-muted hover:opacity-70 v2-divider'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {demoSamples.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDemoSample(phrase)}
              className="text-xs px-2.5 py-1.5 rounded-lg v2-card v2-text hover:opacity-80 whitespace-nowrap transition-colors cursor-pointer"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
