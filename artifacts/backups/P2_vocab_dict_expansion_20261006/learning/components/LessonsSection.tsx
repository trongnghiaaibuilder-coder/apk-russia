import React, { useState } from 'react';
import { ChevronRight, Clock, Award, CheckCircle2, HelpCircle, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TOPIC_LESSONS } from '../data/lessons';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { RUSSIAN_PHRASES } from '../data/phrases';
import { TopicLesson } from '../types';
import { learningStorage } from '../services/learningStorage';

export const LessonsSection: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<TopicLesson | null>(null);
  const [progress, setProgress] = useState(() => learningStorage.getProgress());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showPracticeFeedback, setShowPracticeFeedback] = useState(false);

  const handleOpenLesson = (lesson: TopicLesson) => {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setShowPracticeFeedback(false);
  };

  const handleToggleComplete = (lessonId: string) => {
    if (progress.completedLessonIds.includes(lessonId)) {
      const updated = {
        ...progress,
        completedLessonIds: progress.completedLessonIds.filter((id) => id !== lessonId),
      };
      learningStorage.saveProgress(updated);
      setProgress(updated);
    } else {
      const updated = learningStorage.markLessonCompleted(lessonId);
      setProgress(updated);
    }
  };

  const activeLessonVocab = activeLesson
    ? RUSSIAN_VOCABULARY.filter((v) => activeLesson.vocabularyIds.includes(v.id))
    : [];

  const activeLessonPhrases = activeLesson
    ? RUSSIAN_PHRASES.filter((p) => activeLesson.phraseIds.includes(p.id))
    : [];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block">Tiến trình 16 chủ đề chuẩn:</span>
          <span className="font-bold text-white text-sm">
            {progress.completedLessonIds.length} / {TOPIC_LESSONS.length} bài hoàn thành
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold text-xs">
          {Math.round((progress.completedLessonIds.length / TOPIC_LESSONS.length) * 100)}%
        </div>
      </div>

      <div className="space-y-2.5">
        {TOPIC_LESSONS.map((lesson) => {
          const isDone = progress.completedLessonIds.includes(lesson.id);

          return (
            <Card
              key={lesson.id}
              variant="interactive"
              padding="md"
              onClick={() => handleOpenLesson(lesson)}
              className={isDone ? 'border-emerald-500/30 bg-emerald-950/5' : ''}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : lesson.topicIndex}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                      <span>Bài {lesson.topicIndex}</span>
                      <span aria-hidden="true">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedMinutes} phút
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate">
                      {lesson.titleVi}
                    </h3>
                    <p className="text-xs text-rose-300/80 truncate">
                      {lesson.titleRu}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-slate-400">
                  <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300">
                    Chi tiết
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {activeLesson && (
        <Modal
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
          title={`Bài ${activeLesson.topicIndex}: ${activeLesson.titleVi}`}
          subtitle={activeLesson.titleRu}
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant={progress.completedLessonIds.includes(activeLesson.id) ? 'outline' : 'primary'}
                size="md"
                onClick={() => handleToggleComplete(activeLesson.id)}
                leftIcon={progress.completedLessonIds.includes(activeLesson.id) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Award className="w-4 h-4" />}
                className="flex-1"
              >
                {progress.completedLessonIds.includes(activeLesson.id)
                  ? 'Đã hoàn thành (Bấm để hủy)'
                  : 'Đánh dấu hoàn thành bài'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setActiveLesson(null)}
              >
                Đóng
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
              {activeLesson.descriptionVi}
            </div>

            {activeLessonVocab.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                  Từ vựng trọng tâm ({activeLessonVocab.length})
                </p>
                <div className="space-y-1.5">
                  {activeLessonVocab.map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white block">
                          {v.ru}
                        </span>
                        <span className="text-xs text-rose-300 font-mono block">
                          [{v.pronunciation}]
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 text-right">
                        {v.vi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLessonPhrases.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                  Mẫu câu tình huống ({activeLessonPhrases.length})
                </p>
                <div className="space-y-1.5">
                  {activeLessonPhrases.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-0.5"
                    >
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {p.ru}
                      </p>
                      <p className="text-[11px] text-rose-300 font-mono">
                        [{p.pronunciation}]
                      </p>
                      <p className="text-xs text-slate-300">
                        {p.vi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLesson.practiceQuestions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Luyện tập nhanh ({activeLesson.practiceQuestions.length} câu)</span>
                  </p>
                  <button
                    onClick={() => setShowPracticeFeedback(true)}
                    className="text-[11px] text-rose-400 font-medium hover:underline cursor-pointer"
                  >
                    Xem đáp án
                  </button>
                </div>

                <div className="space-y-3">
                  {activeLesson.practiceQuestions.map((q, qIdx) => {
                    const userChoice = selectedAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                      >
                        <p className="font-semibold text-white text-xs">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = userChoice === optIdx;
                            const isCorrect = optIdx === q.correctIndex;
                            let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                            if (showPracticeFeedback) {
                              if (isCorrect) {
                                style = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium';
                              } else if (isChosen && !isCorrect) {
                                style = 'bg-red-950/40 border-red-500/50 text-red-300';
                              }
                            } else if (isChosen) {
                              style = 'bg-rose-950/40 border-rose-500/50 text-rose-200 font-medium';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                className={`w-full p-2 rounded-xl border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${style}`}
                              >
                                <span>{opt}</span>
                                {showPracticeFeedback && isCorrect && (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {showPracticeFeedback && (
                          <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg leading-relaxed">
                            💡 Giải thích: {q.explanationVi}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
