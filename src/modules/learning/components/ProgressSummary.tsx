import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle2, RotateCcw, Star, HelpCircle, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { learningStorage } from '../services/learningStorage';
import { TOPIC_LESSONS } from '../data/lessons';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { RUSSIAN_PHRASES } from '../data/phrases';

export const ProgressSummary: React.FC = () => {
  const [progress, setProgress] = useState(() => learningStorage.getProgress());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalLessons = TOPIC_LESSONS.length;
  const totalVocab = RUSSIAN_VOCABULARY.length;
  const totalPhrases = RUSSIAN_PHRASES.length;

  const lessonPct = Math.round((progress.completedLessonIds.length / totalLessons) * 100);
  const vocabPct = Math.round((progress.knownWordIds.length / totalVocab) * 100);
  const quizAccuracy =
    progress.quizAttempts > 0
      ? Math.round((progress.quizCorrectAnswers / progress.quizAttempts) * 100)
      : 0;

  const handleReset = () => {
    const fresh = learningStorage.resetProgress();
    setProgress(fresh);
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-4 v2-fade-up">
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border v2-divider text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 v2-accent-text flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold v2-text">Thống kê học tập cá nhân</h2>
          <p className="text-xs v2-text-muted mt-0.5">
            Dữ liệu lưu trữ trực tiếp trên thiết bị (Local Offline Storage)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Card variant="default" padding="md" className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs v2-accent-text font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bài học chủ đề</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold v2-text font-mono">
            {progress.completedLessonIds.length} / {totalLessons}
          </div>
          <p className="text-[11px] v2-text-muted">
            Hoàn thành {lessonPct}% giáo trình
          </p>
        </Card>

        <Card variant="default" padding="md" className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Từ đã thuộc</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold v2-text font-mono">
            {progress.knownWordIds.length} / {totalVocab}
          </div>
          <p className="text-[11px] v2-text-muted">
            Nắm vững {vocabPct}% từ vựng
          </p>
        </Card>

        <Card variant="default" padding="md" className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5" />
            <span>Từ cần ôn tập</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono">
            {progress.reviewWordIds.length}
          </div>
          <p className="text-[11px] v2-text-muted">
            Từ đang trong hàng đợi
          </p>
        </Card>

        <Card variant="default" padding="md" className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Độ chính xác Quiz</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold v2-text font-mono">
            {quizAccuracy}%
          </div>
          <p className="text-[11px] v2-text-muted">
            {progress.quizCorrectAnswers} / {progress.quizAttempts} câu đúng
          </p>
        </Card>
      </div>

      <Card variant="flat" padding="md" className="space-y-2 v2-divider text-xs">
        <div className="flex items-center justify-between v2-text-muted pb-1 border-b v2-divider">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nội dung học tập</span>
          </span>
          <span className="text-emerald-400 font-semibold">100% Offline</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 v2-text-muted">
          <div>Chữ cái: 33 ký tự Cyrillic</div>
          <div>Hướng dẫn phát âm: 10 bài</div>
          <div>Từ vựng cốt lõi: {totalVocab} từ</div>
          <div>Mẫu câu sinh tồn: {totalPhrases} câu</div>
          <div>Bài học chủ đề: 16 chủ đề</div>
          <div>Cập nhật: {new Date(progress.lastUpdated).toLocaleDateString('vi-VN')}</div>
        </div>
      </Card>

      <div className="pt-2">
        {!showConfirmReset ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirmReset(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full v2-text-muted hover:opacity-70 min-h-[44px]"
          >
            Đặt lại toàn bộ tiến trình
          </Button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2.5 text-center v2-fade-up">
            <p className="text-xs text-red-300 font-medium">
              Bạn có chắc chắn muốn đặt lại toàn bộ từ đã thuộc và điểm quiz về 0?
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleReset}
                className="min-h-[40px]"
              >
                Xác nhận xóa
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmReset(false)}
                className="min-h-[40px]"
              >
                Hủy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
