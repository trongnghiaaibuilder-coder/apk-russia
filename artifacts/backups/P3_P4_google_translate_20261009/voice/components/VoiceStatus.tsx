import React from 'react';
import { Mic, Loader2, Volume2, AlertCircle, CheckCircle2, Radio } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceStatusProps {
  state: VoiceState;
  customMessage?: string | null;
  className?: string;
}

export const VoiceStatus: React.FC<VoiceStatusProps> = ({
  state,
  customMessage,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (state) {
      case 'listening':
        return {
          icon: <Radio className="w-4 h-4 text-rose-400 animate-pulse" />,
          label: 'Đang lắng nghe...',
          description: 'Hãy nói vào microphone thiết bị của bạn.',
          badgeColor: 'bg-rose-950/40 text-rose-300 border-rose-500/40',
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />,
          label: 'Đang nhận dạng...',
          description: 'Hệ thống đang trích xuất giọng nói.',
          badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
        };
      case 'translating':
        return {
          icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
          label: 'Đang dịch thuật (P3)...',
          description: 'Động cơ dịch thuật P3 đang xử lý văn bản.',
          badgeColor: 'bg-blue-950/40 text-blue-300 border-blue-500/40',
        };
      case 'playing':
        return {
          icon: <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />,
          label: 'Đang phát âm thanh...',
          description: 'Đang đọc to bản dịch qua loa thiết bị.',
          badgeColor: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-400" />,
          label: 'Lỗi',
          description: customMessage || 'Không nhận dạng được giọng nói. Vui lòng thử lại.',
          badgeColor: 'bg-red-950/40 text-red-300 border-red-500/40',
        };
      case 'ready':
      case 'ready_to_play':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Sẵn sàng',
          description: customMessage || 'Chạm nút micro để nói tiếp.',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        };
      default:
        return {
          icon: <Mic className="w-4 h-4 text-slate-400" />,
          label: 'Chờ lệnh',
          description: customMessage || 'Chạm nút micro để bắt đầu thu âm.',
          badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeColor}`}>
          {config.icon}
          <span className="font-semibold">{config.label}</span>
        </span>
        <p className="text-xs text-slate-400 truncate hidden xs:inline">
          {config.description}
        </p>
      </div>
      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider shrink-0">
        P4 Voice
      </span>
    </div>
  );
};
