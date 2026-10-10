import React, { useState, useEffect, useRef } from 'react';
import { Mic, Trash2, Sparkles, MessageSquare, Radio } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ConversationMessage as MessageType, ConversationSpeaker, VoiceState } from '../types';
import { voiceOrchestrator } from '../services/voiceTranslationService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { ConversationMessage } from './ConversationMessage';

export const ConversationMode: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(() =>
    [...voiceOrchestrator.getConversationHistory()]
  );
  const [state, setState] = useState<VoiceState>('idle');
  const [activeSpeaker, setActiveSpeaker] = useState<ConversationSpeaker | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = voiceOrchestrator.subscribe({
      onStateChange: (newState, msg) => {
        setState(newState);
        if (msg) setStatusMessage(msg);
        if (newState === 'idle' || newState === 'ready' || newState === 'error') {
          setActiveSpeaker(null);
        }
      },
      onTranscriptUpdate: (text) => {
        setInterimTranscript(text);
      },
      onTranslationResult: () => {
        // Translation completed
      },
      onNewConversationMessage: (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        setInterimTranscript('');
      },
    });

    return () => {
      unsubscribe();
      voiceOrchestrator.stop();
    };
  }, []);

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  const handleStartSpeaker = async (speaker: ConversationSpeaker) => {
    setStatusMessage(null);
    setActiveSpeaker(speaker);
    setInterimTranscript('');
    await voiceOrchestrator.startConversationTurn(speaker);
  };

  const handleStop = async () => {
    await speechRecognitionService.stopListening();
  };

  const handleClear = () => {
    voiceOrchestrator.clearConversationHistory();
    setMessages([]);
    setInterimTranscript('');
    setStatusMessage(null);
  };

  const handleReplay = async (msg: MessageType) => {
    await voiceOrchestrator.replayMessageAudio(msg);
  };

  // Quick phrase suggestions for test/interactive demo
  const userSuggestions = ['Xin chào', 'Bao nhiêu tiền?', 'Cảm ơn rất nhiều', 'Tôi đến từ Việt Nam'];
  const russianSuggestions = ['Здравствуйте', 'Сколько это стоит?', 'Спасибо', 'Хорошо'];

  const handleTapSuggestion = async (speaker: ConversationSpeaker, text: string) => {
    setActiveSpeaker(speaker);
    await voiceOrchestrator.submitManualTurn(speaker, text);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Session Header with Clear Action */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
          <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
          <span>Hội thoại 2 chiều ({messages.length} lượt)</span>
        </span>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa hội thoại</span>
          </button>
        )}
      </div>

      {/* Conversation Timeline Stream */}
      <div className="min-h-[220px] max-h-[360px] overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 pr-2">
        {messages.length === 0 && !interimTranscript && (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <MessageSquare className="w-6 h-6 text-rose-400/60" />
            </div>
            <p className="text-xs font-medium text-slate-300">
              Chưa có tin nhắn trong phiên đối thoại
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              Nhấn "Anh nói" khi bạn nói tiếng Việt, hoặc nhấn "Người Nga nói" khi người đối diện nói tiếng Nga.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ConversationMessage key={msg.id} message={msg} onReplay={handleReplay} />
        ))}

        {/* Live speech preview if listening */}
        {interimTranscript && (
          <div
            className={`flex flex-col space-y-1 max-w-[85%] animate-in fade-in ${
              activeSpeaker === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <span className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Đang nhận giọng: {activeSpeaker === 'user' ? 'Tiếng Việt' : 'Русский'}</span>
            </span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 italic animate-pulse">
              “{interimTranscript}”
            </div>
          </div>
        )}
        <div ref={timelineEndRef} />
      </div>

      {/* Dual Big Microphone Trigger Buttons (Anh nói vs Người Nga nói) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Left Button: Vietnamese Speaker (User) */}
        <Card
          variant="interactive"
          padding="md"
          onClick={() => {
            if (state === 'listening' && activeSpeaker === 'user') {
              handleStop();
            } else {
              handleStartSpeaker('user');
            }
          }}
          className={`flex flex-col items-center justify-center text-center p-4 transition-all cursor-pointer select-none active:scale-95 ${
            activeSpeaker === 'user' && state === 'listening'
              ? 'border-red-500/80 bg-red-950/30 ring-2 ring-red-500/50'
              : 'border-rose-500/30 bg-slate-900 hover:bg-slate-850'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform ${
              activeSpeaker === 'user' && state === 'listening'
                ? 'bg-red-600 text-white animate-pulse scale-110'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            <Mic className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-white block">
            Anh nói
          </span>
          <span className="text-[10px] text-rose-300 font-mono block mt-0.5">
            🇻🇳 VI → 🇷🇺
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            {activeSpeaker === 'user' && state === 'listening' ? 'Chạm để dừng' : 'Chạm để nói'}
          </span>
        </Card>

        {/* Right Button: Russian Speaker */}
        <Card
          variant="interactive"
          padding="md"
          onClick={() => {
            if (state === 'listening' && activeSpeaker === 'russianSpeaker') {
              handleStop();
            } else {
              handleStartSpeaker('russianSpeaker');
            }
          }}
          className={`flex flex-col items-center justify-center text-center p-4 transition-all cursor-pointer select-none active:scale-95 ${
            activeSpeaker === 'russianSpeaker' && state === 'listening'
              ? 'border-sky-500/80 bg-sky-950/30 ring-2 ring-sky-500/50'
              : 'border-sky-500/30 bg-slate-900 hover:bg-slate-850'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform ${
              activeSpeaker === 'russianSpeaker' && state === 'listening'
                ? 'bg-sky-600 text-white animate-pulse scale-110'
                : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
            }`}
          >
            <Mic className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-white block">
            Người Nga nói
          </span>
          <span className="text-[10px] text-sky-300 font-mono block mt-0.5">
            🇷🇺 RU → 🇻🇳
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            {activeSpeaker === 'russianSpeaker' && state === 'listening' ? 'Chạm để dừng' : 'Chạm để nói'}
          </span>
        </Card>
      </div>

      {statusMessage && (
        <p className="text-[11px] text-red-400 text-center font-medium">
          {statusMessage}
        </p>
      )}

      {/* Quick Test Demo Helpers */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <div className="space-y-1">
          <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Thử nói tiếng Việt (Người dùng):</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {userSuggestions.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTapSuggestion('user', phrase)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Thử nói tiếng Nga (Người đối diện):</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {russianSuggestions.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTapSuggestion('russianSpeaker', phrase)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
