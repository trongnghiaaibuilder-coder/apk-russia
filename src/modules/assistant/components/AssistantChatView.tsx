import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  WifiOff, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { AssistantMessage, PresetAssistantTopic } from '../types';
import { PRESET_ASSISTANT_TOPICS } from '../services/localKnowledgeProvider';
import { textToSpeechService } from '../../voice/services/textToSpeechService';
import { Button } from '../../../components/ui/Button';

export interface AssistantChatViewProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  activeProviderName: string;
  isOnline: boolean;
  onSendMessage: (content: string, topic?: string) => void;
  onClearHistory: () => void;
}

export const AssistantChatView: React.FC<AssistantChatViewProps> = ({
  messages,
  isLoading,
  activeProviderName,
  isOnline,
  onSendMessage,
  onClearHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectTopic = (topic: PresetAssistantTopic) => {
    if (isLoading) return;
    onSendMessage(topic.sampleQuestion, topic.id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  };

  const handleSpeak = async (id: string, text: string) => {
    if (speakingId === id) {
      textToSpeechService.stop();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    // Remove markdown symbols for cleaner speech
    const cleanSpeech = text.replace(/[*_#`]/g, '');
    await textToSpeechService.speak(cleanSpeech, 'vi');
    setSpeakingId(null);
  };

  return (
    <div className="v2-fade-up flex flex-col h-[calc(100vh-170px)] min-h-[480px] max-h-[750px] v2-bg-soft border v2-divider rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-4 py-3 v2-bg border-b v2-divider flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold v2-text flex items-center gap-1.5">
              <span>Trợ lý Nga AI</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full v2-accent-soft v2-text-muted border v2-divider">
                {activeProviderName.includes('Gemini') ? 'Trực tuyến' : 'Ngoại tuyến'}
              </span>
            </h3>
            <p className="text-[11px] v2-text-muted flex items-center gap-1">
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Trực tuyến</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">Ngoại tuyến</span>
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          title="Xóa đoạn chat làm mới"
          className="text-xs v2-text-muted hover:opacity-70 px-2.5 py-1.5 rounded-lg v2-card transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Preset Topics Carousel */}
      <div className="p-2.5 v2-bg/40 border-b v2-divider/80">
        <div className="text-[10px] font-medium v2-text-muted uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Chủ đề hỏi nhanh:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PRESET_ASSISTANT_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl v2-card text-xs font-medium v2-text whitespace-nowrap transition disabled:opacity-50 hover:opacity-80"
            >
              {topic.labelVi}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 v2-text ${
                  isUser
                    ? 'bg-blue-600 shadow-md'
                    : 'bg-gradient-to-br from-red-600 to-rose-700 shadow-md'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'v2-card v2-text rounded-tl-none'
                }`}
              >
                {/* Formatted Markdown/Text */}
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm tracking-wide">
                  {msg.content}
                </div>

                {/* Footer Bar for Assistant Messages */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t v2-divider flex items-center justify-between text-[11px] v2-text-muted">
                    <span className="flex items-center gap-1 text-[10px]">
                      {msg.isFallback ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Info className="w-3 h-3" /> Ngoại tuyến
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Trực tuyến
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        title="Đọc to câu trả lời"
                        className="p-1 hover:opacity-70 transition"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? 'v2-accent-text animate-pulse' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        title="Sao chép nội dung"
                        className="p-1 hover:opacity-70 transition"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg v2-accent-bg flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="v2-card rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs v2-text-muted ml-1">Trợ lý Nga đang suy nghĩ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-3 v2-bg border-t v2-divider">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnline ? "Hỏi bất kỳ điều gì về nước Nga..." : "Hỏi tri thức ngoại tuyến (Metro, Tạm trú, Mùa đông)..."}
            disabled={isLoading}
            maxLength={1000}
            className="flex-1 v2-bg-soft border border-slate-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm v2-text placeholder-slate-500 outline-none transition"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-xl v2-accent-bg hover:bg-red-500 v2-text flex items-center justify-center shadow-lg shadow-red-600/30 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] v2-text-faint px-1 mt-1.5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            An toàn: Không lưu giữ thông tin nhạy cảm
          </span>
          <span>{inputText.length}/1000</span>
        </div>
      </div>
    </div>
  );
};
