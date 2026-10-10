import React, { useState } from 'react';
import { History, Trash2, RotateCcw } from 'lucide-react';
import { TranslationHistoryItem } from '../types';

interface TranslationHistoryListProps {
  history: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
  onClear: () => void;
  onRemoveItem: (id: string) => void;
}

export const TranslationHistoryList: React.FC<TranslationHistoryListProps> = ({
  history,
  onSelect,
  onClear,
  onRemoveItem,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2 v2-fade-up v2-fade-up-3">
      <div className="flex items-center justify-between text-xs v2-text-muted px-1">
        <span className="flex items-center gap-1.5 font-semibold v2-text-muted">
          <History className="w-3.5 h-3.5 v2-accent-text" />
          <span>Lịch sử dịch gần đây ({history.length})</span>
        </span>
        {!showConfirmClear ? (
          <button
            type="button"
            onClick={() => setShowConfirmClear(true)}
            className="text-[11px] v2-text-faint hover:opacity-70 transition-colors cursor-pointer"
          >
            Xóa lịch sử
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-red-300">Xác nhận?</span>
            <button
              type="button"
              onClick={() => {
                onClear();
                setShowConfirmClear(false);
              }}
              className="text-[11px] font-bold v2-accent-text hover:underline cursor-pointer"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="text-[11px] v2-text-muted hover:underline cursor-pointer"
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {history.map((item) => {
          const isViToRu = item.sourceLanguage === 'vi';
          return (
            <div
              key={item.id}
              className="p-2.5 rounded-2xl v2-bg-soft hover:bg-slate-850 border v2-divider transition-all flex items-center justify-between gap-3 group"
            >
              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => onSelect(item)}
                title="Nhấn để đưa vào khung dịch"
              >
                <div className="flex items-center gap-2 text-[10px] v2-text-faint mb-0.5 font-mono">
                  <span>{isViToRu ? '🇻🇳 VI → 🇷🇺 RU' : '🇷🇺 RU → 🇻🇳 VI'}</span>
                  <span aria-hidden="true">•</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs v2-text truncate font-medium">
                  {item.sourceText}
                </p>
                <p className="text-xs v2-accent-text/90 truncate mt-0.5">
                  👉 {item.translatedText}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 v2-text-muted hover:opacity-70 flex items-center justify-center transition-colors cursor-pointer"
                  title="Nạp lại"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="w-8 h-8 rounded-lg v2-text-faint hover:opacity-70 hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Xóa mục này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
