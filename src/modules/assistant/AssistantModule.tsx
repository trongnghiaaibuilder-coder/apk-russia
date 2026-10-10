import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';
import { AssistantMessage } from './types';
import { assistantService } from './services/assistantService';
import { AssistantChatView } from './components/AssistantChatView';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { SectionHeader } from '../../components/ui/SectionHeader';

export const AssistantModule: React.FC = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>(() => assistantService.getHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  const activeProvider = assistantService.getProvider();

  const handleSendMessage = async (content: string, topic?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await assistantService.ask(content, {
        currentTopic: topic,
        isOnline
      });

      setMessages(assistantService.getHistory());

      if (!response.success && response.error) {
        setErrorMessage(response.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối tới Trợ lý AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    assistantService.clearHistory();
    setMessages(assistantService.getHistory());
    setErrorMessage(null);
  };

  return (
    <div className="v2-fade-up w-full max-w-2xl mx-auto space-y-3 pb-8">
      {/* Module Title */}
      <SectionHeader
        title="Trợ lý AI Nước Nga"
        subtitle="Hỏi đáp thông minh về luật di trú, tạm trú, metro, văn hóa và đời sống Nga"
      />

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-400 hover:opacity-70 text-xs font-semibold px-2 py-1 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Chat Viewport */}
      <AssistantChatView
        messages={messages}
        isLoading={isLoading}
        activeProviderName={activeProvider.providerName}
        isOnline={isOnline}
        onSendMessage={handleSendMessage}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};
