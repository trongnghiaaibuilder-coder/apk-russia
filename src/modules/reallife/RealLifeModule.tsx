import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Train, 
  Utensils, 
  ShoppingBag, 
  Hotel, 
  Pill, 
  FileText, 
  MessageSquare,
  ArrowRight,
  X,
  Lightbulb
} from 'lucide-react';
import { RealLifeScenario, RealLifeCategory } from './types';
import { realLifeService } from './services/realLifeService';
import { EmergencyHotlinesView } from './components/EmergencyHotlinesView';
import { PhraseItem } from './components/PhraseItem';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';

export const RealLifeModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeScenario, setActiveScenario] = useState<RealLifeScenario | null>(null);

  const emergencyContacts = realLifeService.getEmergencyContacts();
  const searchResult = realLifeService.search(searchQuery);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'emergency', label: 'Khẩn cấp 112' },
    { id: 'transportation', label: 'Metro & Xe' },
    { id: 'food', label: 'Ăn uống' },
    { id: 'shopping', label: 'Mua sắm' },
    { id: 'accommodation', label: 'Chỗ ở' },
    { id: 'medical', label: 'Y tế & Thuốc' },
    { id: 'administrative', label: 'Hành chính MFC' },
    { id: 'communication', label: 'Giao tiếp' }
  ];

  const filteredScenarios = selectedCategory === 'all'
    ? searchResult.scenarios
    : searchResult.scenarios.filter(s => s.category === selectedCategory);

  const getCategoryIcon = (category: RealLifeCategory) => {
    switch (category) {
      case 'emergency': return <ShieldAlert className="w-4 h-4 v2-accent-text" />;
      case 'transportation': return <Train className="w-4 h-4 text-sky-400" />;
      case 'food': return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 v2-accent-text" />;
      case 'accommodation': return <Hotel className="w-4 h-4 text-indigo-400" />;
      case 'medical': return <Pill className="w-4 h-4 text-emerald-400" />;
      case 'administrative': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'communication': return <MessageSquare className="w-4 h-4 text-violet-400" />;
      default: return <ShieldAlert className="w-4 h-4 v2-text-muted" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-12">
      {/* Title */}
      <div className="v2-fade-up">
        <SectionHeader
          title="Đời sống & Khẩn cấp tại Nga"
          subtitle="Sổ tay sinh tồn thực tế: Số cứu trợ 112, tàu điện ngầm, mua sắm, thuê nhà và y tế"
        />
      </div>

      {/* Emergency Hotlines Banner */}
      <EmergencyHotlinesView contacts={emergencyContacts} />

      {/* Search Bar */}
      <div className="v2-fade-up v2-fade-up-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 v2-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm tình huống, từ khóa tiếng Nga hoặc tiếng Việt..."
          className="w-full pl-10 pr-4 py-3 v2-bg-soft border v2-divider focus:border-red-500 rounded-2xl text-xs sm:text-sm v2-text placeholder-slate-500 outline-none transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 v2-text-muted hover:opacity-70 text-xs"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'v2-accent-bg shadow-sm'
                : 'bg-slate-850 v2-text-muted hover:bg-slate-800 border v2-divider'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Direct phrase matches if search query is active */}
      {searchQuery && searchResult.phrases.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold v2-text-muted uppercase tracking-wider px-1">
            Mẫu câu tìm thấy ({searchResult.phrases.length})
          </h4>
          <div className="space-y-2">
            {searchResult.phrases.slice(0, 5).map(phrase => (
              <PhraseItem key={phrase.id} phrase={phrase} />
            ))}
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold v2-text-muted uppercase tracking-wider px-1">
          Các tình huống thực tế ({filteredScenarios.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredScenarios.map((sc, i) => (
            <div
              key={sc.id}
              onClick={() => setActiveScenario(sc)}
              className={`v2-fade-up v2-fade-up-${Math.min((i % 4) + 1, 4)} p-5 rounded-3xl bg-white/[0.04] border v2-divider cursor-pointer transition flex flex-col justify-between gap-3 shadow-xl group active:scale-[0.98]`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold v2-text">
                    {getCategoryIcon(sc.category)}
                    {sc.categoryLabelVi}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded v2-accent-soft v2-text-muted">
                    {sc.phrases.length} mẫu câu
                  </span>
                </div>

                <h3 className="text-sm font-bold v2-text group-hover:opacity-70 transition">
                  {sc.titleVi}
                </h3>
                <p className="text-[11px] v2-text-muted mt-1 line-clamp-2">
                  {sc.descriptionVi}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t v2-divider/80 text-xs v2-accent-text font-medium">
                <span className="text-[11px] v2-text-faint font-mono truncate max-w-[180px]">
                  {sc.titleRu}
                </span>
                <span className="flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition">
                  Xem chi tiết
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Detail Modal */}
      {activeScenario && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[85vh] v2-bg border v2-divider rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 v2-bg border-b v2-divider flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold v2-accent-text uppercase tracking-wider flex items-center gap-1.5">
                  {getCategoryIcon(activeScenario.category)}
                  {activeScenario.categoryLabelVi}
                </span>
                <h3 className="text-base font-bold v2-text mt-0.5">
                  {activeScenario.titleVi}
                </h3>
                <p className="text-xs v2-text-muted">{activeScenario.titleRu}</p>
              </div>

              <button
                onClick={() => setActiveScenario(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 v2-text-muted hover:opacity-70 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Practical Tips Box */}
              {activeScenario.tipsVi && activeScenario.tipsVi.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Lightbulb className="w-4 h-4" />
                    <span>Lưu ý & kinh nghiệm thực tế:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
                    {activeScenario.tipsVi.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Phrases List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold v2-text-muted uppercase tracking-wider">
                  Mẫu câu giao tiếp thiết yếu ({activeScenario.phrases.length})
                </h4>
                <div className="space-y-2">
                  {activeScenario.phrases.map((phrase) => (
                    <PhraseItem key={phrase.id} phrase={phrase} />
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 v2-bg border-t v2-divider flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveScenario(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
