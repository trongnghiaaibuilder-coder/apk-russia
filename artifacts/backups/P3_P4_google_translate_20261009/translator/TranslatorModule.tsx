import React, { useState } from 'react';
import { Info, WifiOff } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationInput } from './components/TranslationInput';
import { TranslationResultCard } from './components/TranslationResult';
import { TranslationHistoryList } from './components/TranslationHistory';
import { SupportedLanguage, TranslationResult, TranslationHistoryItem, TranslatorModuleProps } from './types';
import { translationService } from './services/translationService';
import { translationHistory } from './services/translationHistory';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const TranslatorModule: React.FC<TranslatorModuleProps> = ({
  initialText = '',
  initialSourceLang = 'vi',
  onOpenVoice,
  onOpenCamera,
}) => {
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>(initialSourceLang);
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(initialSourceLang === 'vi' ? 'ru' : 'vi');
  const [inputText, setInputText] = useState(initialText);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => translationHistory.getHistory());
  const isOnline = useOnlineStatus();
  const providerConfig = translationService.getProviderConfig();

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setInputText(result.translatedText);
      setResult(null);
    }
    setErrorMessage(null);
  };

  const handleTranslate = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await translationService.translate({
        text: inputText,
        sourceLang,
        targetLang,
      });

      if (response.success && response.result) {
        setResult(response.result);
        const updatedHistory = translationHistory.addHistoryItem(response.result);
        setHistory(updatedHistory);
      } else {
        setResult(null);
        setErrorMessage(response.error || 'Không thể thực hiện dịch thuật.');
      }
    } catch (err: unknown) {
      setResult(null);
      setErrorMessage((err as Error)?.message || 'Xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setErrorMessage(null);
  };

  const handleSelectSuggestion = (phrase: string) => {
    setInputText(phrase);
    setResult(null);
    setErrorMessage(null);
  };

  const handleRestoreHistoryItem = (item: TranslationHistoryItem) => {
    setSourceLang(item.sourceLanguage);
    setTargetLang(item.targetLanguage);
    setInputText(item.sourceText);
    setResult({
      id: item.id,
      sourceText: item.sourceText,
      translatedText: item.translatedText,
      sourceLanguage: item.sourceLanguage,
      targetLanguage: item.targetLanguage,
      provider: item.provider as 'local_fallback_demo' | 'external_provider',
      timestamp: item.timestamp,
      isFallback: item.provider === 'local_fallback_demo',
    });
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    translationHistory.clearHistory();
    setHistory([]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = translationHistory.removeHistoryItem(id);
    setHistory(updated);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <SectionHeader
        kicker="Hệ thống dịch thuật P3"
        title="Bilingual Text Translator"
        subtitle="Dịch văn bản hai chiều Tiếng Việt ↔ Tiếng Nga và lưu trữ ngoại tuyến"
      />

      {!isOnline && (
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-200">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-relaxed">
            Thiết bị đang ở ngoại tuyến. Lịch sử dịch và dữ liệu thử nghiệm hoạt động 100%. Dịch trực tuyến qua API ngoại vi tạm thời ngắt kết nối.
          </p>
        </div>
      )}

      <LanguageSelector
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSwap={handleSwapLanguages}
        disabled={isLoading}
      />

      <TranslationInput
        text={inputText}
        sourceLang={sourceLang}
        onChange={setInputText}
        onSubmit={handleTranslate}
        onClear={handleClear}
        isLoading={isLoading}
        onOpenVoice={onOpenVoice}
        onOpenCamera={onOpenCamera}
        onSelectSuggestion={handleSelectSuggestion}
      />

      <TranslationResultCard
        result={result}
        error={errorMessage}
      />

      <TranslationHistoryList
        history={history}
        onSelect={handleRestoreHistoryItem}
        onClear={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
      />

      <Card variant="flat" padding="md" className="border-slate-800 space-y-2 bg-slate-900/60">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-slate-200">
              Cấu trúc Translation Provider P3
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {providerConfig.isConfigured
                ? `Nhà cung cấp ngoại vi kết nối qua: ${providerConfig.endpoint}.`
                : 'Hệ thống tuân thủ nghiêm ngặt quy tắc không tạo kết quả giả ("No Fake AI"). Khi chưa cấu hình API ngoại vi, động cơ cung cấp demo các câu quan trọng cho du khách và lưu trữ lịch sử an toàn ngoại tuyến.'}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Trạng thái: {providerConfig.isConfigured ? 'Live API Proxy' : 'Local Fallback (Demo)'}</span>
          <span aria-hidden="true">•</span>
          <span>Giới hạn: 500 ký tự / lần</span>
        </div>
      </Card>
    </div>
  );
};
