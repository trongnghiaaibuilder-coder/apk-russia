import React, { useState } from 'react';
import { HelpCircle, Check, X, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { quizService } from '../services/quizService';
import { learningStorage } from '../services/learningStorage';
import { QuizQuestion } from '../types';

export const QuizSection: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => quizService.generateQuizQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreData, setScoreData] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  const currentQ = questions[currentIndex];
  const userChoice = selectedAnswers[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showFeedback || isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const results = questions.map((q, idx) => selectedAnswers[idx] === q.correctIndex);
      const score = quizService.calculateScore(results);
      setScoreData(score);
      setIsFinished(true);
      learningStorage.recordQuizResult(score.correct, score.total);
    }
  };

  const handleRestart = (newBatch = false) => {
    if (newBatch) {
      setQuestions(quizService.generateQuizQuestions(10, Math.floor(Math.random() * 20)));
    }
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setIsFinished(false);
    setScoreData(null);
  };

  return (
    <div className="space-y-4 v2-fade-up">
      {!isFinished ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs v2-text-muted px-1">
            <span className="flex items-center gap-1.5 font-medium v2-accent-text">
              <HelpCircle className="w-4 h-4" />
              <span>Trắc nghiệm tiếng Nga</span>
            </span>
            <span className="font-mono v2-text font-bold">
              Câu {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full h-1.5 v2-bg-soft rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <Card variant="accent" padding="lg" className="space-y-4 v2-divider">
            <div className="text-center py-2 space-y-2">
              <span className="text-[11px] v2-accent-text uppercase tracking-wider font-semibold">
                {currentQ.type === 'ru_to_vi'
                  ? 'Nga → Việt'
                  : currentQ.type === 'vi_to_ru'
                  ? 'Việt → Nga'
                  : 'Ý nghĩa tình huống'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold v2-text">
                {currentQ.prompt || currentQ.question}
              </h2>
              {currentQ.prompt && (
                <p className="text-xs v2-text-muted">{currentQ.question}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;
                let btnStyle = 'v2-bg-soft v2-divider v2-text hover:bg-slate-850 hover:border-slate-700';

                if (showFeedback) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-950/40 border-red-500/60 text-red-300';
                  }
                } else if (isSelected) {
                  btnStyle = 'v2-accent-soft border-rose-500 v2-accent-text font-medium';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={showFeedback}
                    className={`w-full min-h-[50px] p-3 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer select-none active:scale-[0.99] ${btnStyle}`}
                  >
                    <span className="truncate pr-2">{opt}</span>
                    {showFeedback && isCorrect && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <X className="w-4 h-4 v2-accent-text shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="p-3 rounded-xl v2-bg border v2-divider text-xs space-y-1 v2-fade-up">
                <span className="v2-accent-text font-medium block">
                  {userChoice === currentQ.correctIndex ? '✓ Đúng rồi!' : '✗ Chưa chính xác!'}
                </span>
                <p className="v2-text-muted text-[11px] leading-relaxed">
                  {currentQ.explanationVi}
                </p>
              </div>
            )}

            {showFeedback && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextQuestion}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  fullWidth
                  className="min-h-[48px]"
                >
                  {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Card variant="accent" padding="lg" className="text-center space-y-5 v2-fade-up">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 v2-accent-text flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold v2-text">Kết quả bài trắc nghiệm</h2>
            <p className="text-xs v2-text-muted">
              Kết quả được ghi nhận vào tiến trình
            </p>
          </div>

          <div className="p-4 rounded-3xl v2-card flex items-center justify-around">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {scoreData?.correct} / {scoreData?.total}
              </span>
              <span className="text-[11px] v2-text-muted block mt-0.5">Số câu đúng</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <span className="text-2xl sm:text-3xl font-black v2-accent-text font-mono">
                {scoreData?.percentage}%
              </span>
              <span className="text-[11px] v2-text-muted block mt-0.5">Tỷ lệ chính xác</span>
            </div>
          </div>

          <p className="text-xs v2-text-muted leading-relaxed max-w-sm mx-auto">
            {scoreData && scoreData.percentage >= 80
              ? 'Xuất sắc! Bạn nắm kiến thức từ vựng và tình huống rất vững.'
              : scoreData && scoreData.percentage >= 50
              ? 'Khá tốt! Hãy ôn lại trong mục "Cần ôn" để đạt 100% nhé.'
              : 'Hãy dành thêm thời gian luyện thẻ flashcard và xem các chủ đề.'}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => handleRestart(true)}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              fullWidth
              className="min-h-[48px]"
            >
              Làm đề mới khác
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleRestart(false)}
              fullWidth
              className="min-h-[48px]"
            >
              Làm lại bài này
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
