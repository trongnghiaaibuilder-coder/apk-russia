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
          icon: <Radio className="w-4 h-4 v2-accent-text animate-pulse" />,
          label: 'Đang lắng nghe...',
          description: 'Hãy nói vào microphone thiết bị của bạn.',
          badgeColor: 'v2-accent-soft v2-accent-text border-rose-500/40',
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />,
          label: 'Đang nhận dạng...',
          description: 'Đang nghe và nhận dạng giọng nói.',
          badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
        };
      case 'translating':
        return {
          icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
          label: 'Đang dịch...',
          description: 'Đang dịch câu bạn vừa nói.',
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
          icon: <AlertCircle className="w-4 h-4 v2-accent-text" />,
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
          badgeColor: 'v2-accent-soft v2-text-muted v2-divider',
        };
      default:
        return {
          icon: <Mic className="w-4 h-4 v2-text-muted" />,
          label: 'Chờ lệnh',
          description: customMessage || 'Chạm nút micro để bắt đầu thu âm.',
          badgeColor: 'v2-accent-soft v2-text-muted v2-divider',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-3 rounded-3xl v2-bg-soft/80 border v2-divider flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeColor}`}>
          {config.icon}
          <span className="font-semibold">{config.label}</span>
        </span>
        <p className="text-xs v2-text-muted truncate hidden xs:inline">
          {config.description}
        </p>
      </div>
    </div>
  );
};
