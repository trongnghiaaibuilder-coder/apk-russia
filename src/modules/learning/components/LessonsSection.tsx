import React, { useState } from 'react';
import { ChevronRight, Clock, Award, CheckCircle2, HelpCircle, Check, Volume2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TOPIC_LESSONS } from '../data/lessons';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { RUSSIAN_PHRASES } from '../data/phrases';
import { textToSpeechService } from '../../voice/services/textToSpeechService';
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

  const handleSpeak = (text: string) => {
    if (!text) return;
    const cleanText = text.split('/')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim();
    textToSpeechService.speak(cleanText, 'ru');
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
    <div className="space-y-4 v2-fade-up">
      <div className="p-3.5 rounded-3xl v2-card flex items-center justify-between text-xs">
        <div>
          <span className="v2-text-muted block">Tiến trình 16 chủ đề chuẩn:</span>
          <span className="font-bold v2-text text-sm">
            {progress.completedLessonIds.length} / {TOPIC_LESSONS.length} bài hoàn thành
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 v2-accent-text flex items-center justify-center font-mono font-bold text-xs">
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
                        : 'v2-accent-soft v2-text-muted'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : lesson.topicIndex}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] v2-text-muted mb-0.5">
                      <span>Bài {lesson.topicIndex}</span>
                      <span aria-hidden="true">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedMinutes} phút
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold v2-text truncate">
                      {lesson.titleVi}
                    </h3>
                    <p className="text-xs v2-accent-text/80 truncate">
                      {lesson.titleRu}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 v2-text-muted">
                  <span className="text-[11px] px-2 py-1 rounded-lg v2-accent-soft v2-text-muted">
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
            <div className="p-3 rounded-3xl v2-card v2-text-muted leading-relaxed">
              {activeLesson.descriptionVi}
            </div>

            {activeLessonVocab.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold v2-accent-text uppercase tracking-wider">
                  Từ vựng trọng tâm ({activeLessonVocab.length})
                </p>
                <div className="space-y-1.5">
                  {activeLessonVocab.map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-xl v2-bg/80 border v2-divider/80 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold v2-text block">
                          {v.ru}
                        </span>
                        <span className="text-xs v2-accent-text font-mono block">
                          [{v.pronunciation}]
                        </span>
                        <span className="text-xs v2-text-muted block mt-0.5">
                          {v.vi}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(v.ru)}
                        className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-800 hover:opacity-80 v2-accent-text hover:opacity-70 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        title={`Phát âm ${v.ru}`}
                        aria-label={`Phát âm ${v.ru}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLessonPhrases.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold v2-accent-text uppercase tracking-wider">
                  Mẫu câu tình huống ({activeLessonPhrases.length})
                </p>
                <div className="space-y-1.5">
                  {activeLessonPhrases.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl v2-bg/80 border v2-divider/80 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold v2-text">
                          {p.ru}
                        </p>
                        <p className="text-[11px] v2-accent-text font-mono">
                          [{p.pronunciation}]
                        </p>
                        <p className="text-xs v2-text-muted">
                          {p.vi}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(p.ru)}
                        className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-800 hover:opacity-80 v2-accent-text hover:opacity-70 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        title={`Phát âm ${p.ru}`}
                        aria-label={`Phát âm ${p.ru}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLesson.practiceQuestions.length > 0 && (
              <div className="space-y-2 pt-2 border-t v2-divider">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold v2-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 v2-accent-text" />
                    <span>Luyện tập nhanh ({activeLesson.practiceQuestions.length} câu)</span>
                  </p>
                  <button
                    onClick={() => setShowPracticeFeedback(true)}
                    className="text-[11px] v2-accent-text font-medium hover:underline cursor-pointer"
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
                        className="p-3 rounded-3xl v2-card space-y-2"
                      >
                        <p className="font-semibold v2-text text-xs">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = userChoice === optIdx;
                            const isCorrect = optIdx === q.correctIndex;
                            let style = 'v2-bg-soft v2-divider v2-text-muted hover:bg-slate-850';
                            if (showPracticeFeedback) {
                              if (isCorrect) {
                                style = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium';
                              } else if (isChosen && !isCorrect) {
                                style = 'bg-red-950/40 border-red-500/50 text-red-300';
                              }
                            } else if (isChosen) {
                              style = 'v2-accent-soft border-rose-500/50 v2-accent-text font-medium';
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
                          <p className="text-[11px] v2-text-muted v2-bg-soft/60 p-2 rounded-lg leading-relaxed">
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
