import React, { useState } from 'react';
import { Sparkles, ArrowRight, Train, Utensils, Pill, Building2, ShoppingBag, ShieldAlert } from 'lucide-react';
import { SampleOcrImage, SampleCategory } from '../types';
import { REALISTIC_RUSSIAN_SIGN_SAMPLES } from '../services/ocrService';

export interface SampleImageSelectorProps {
  onSelectSample: (sampleId: string) => void;
}

export const SampleImageSelector: React.FC<SampleImageSelectorProps> = ({ onSelectSample }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (category: SampleCategory) => {
    switch (category) {
      case 'metro_sign':
      case 'train_ticket':
        return <Train className="w-4 h-4 text-sky-400" />;
      case 'menu':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'pharmacy':
        return <Pill className="w-4 h-4 text-emerald-400" />;
      case 'street_sign':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'store_sign':
        return <ShoppingBag className="w-4 h-4 v2-accent-text" />;
      case 'emergency_sign':
        return <ShieldAlert className="w-4 h-4 v2-accent-text" />;
      default:
        return <Sparkles className="w-4 h-4 v2-text-muted" />;
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'metro_sign', label: 'Metro & Tàu' },
    { id: 'menu', label: 'Quán ăn' },
    { id: 'pharmacy', label: 'Hiệu thuốc' },
    { id: 'street_sign', label: 'Tên phố' },
    { id: 'store_sign', label: 'Cửa hàng' },
    { id: 'emergency_sign', label: 'Khẩn cấp' }
  ];

  const filteredSamples = selectedCategory === 'all'
    ? REALISTIC_RUSSIAN_SIGN_SAMPLES
    : REALISTIC_RUSSIAN_SIGN_SAMPLES.filter(s =>
        selectedCategory === 'metro_sign'
          ? s.category === 'metro_sign' || s.category === 'train_ticket'
          : s.category === selectedCategory
      );

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="v2-fade-up flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold v2-text flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Biển báo mẫu
          </h4>
          <p className="text-xs v2-text-muted">
            Chạm để thử quét ngay, không cần chụp ảnh
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="v2-fade-up v2-fade-up-1 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all active:scale-[0.97] ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'v2-card v2-text-muted'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredSamples.map((sample, i) => (
          <div
            key={sample.id}
            onClick={() => onSelectSample(sample.id)}
            className={`v2-fade-up v2-fade-up-${Math.min(i % 4 + 1, 4)} group p-4 rounded-3xl v2-card cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between gap-2 shadow-sm`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold v2-text">
                  {getCategoryIcon(sample.category)}
                  {sample.categoryLabelVi}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full v2-accent-soft v2-text-muted">
                  {sample.linesRu.length} dòng
                </span>
              </div>

              <p className="text-xs font-medium v2-text-muted mb-2">{sample.title}</p>

              {/* Russian Sign Text Mock Preview */}
              <div className="v2-bg/80 p-2.5 rounded-2xl border border-white/5 text-xs font-mono text-red-300/90 whitespace-pre-wrap leading-tight">
                {sample.sampleTextRu}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs v2-text-muted pt-1.5 border-t border-white/5">
              <span className="text-[11px] truncate max-w-[200px] v2-text-muted">
                {sample.expectedTranslationVi?.split('\n')[0]}...
              </span>
              <span className="flex items-center font-medium gap-1 text-[11px] v2-accent-text shrink-0">
                Thử quét
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
