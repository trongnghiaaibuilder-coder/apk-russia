/**
 * Màn hình hướng dẫn sử dụng cho lần đầu mở app.
 * Thiết kế đơn giản, chữ to, dễ hiểu cho người lớn tuổi.
 * Developer: Xương Rồng AI Developer
 */
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Home, BookOpen, Languages, Mic, Camera, Bot, Siren } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
}

const STEPS: Step[] = [
  {
    icon: <Home className="w-12 h-12" />,
    title: 'Chào mừng bạn!',
    description: 'Đây là ứng dụng "Nước Nga Trong Tầm Tay" — người bạn đồng hành giúp bạn học tiếng Nga, dịch thuật và giao tiếp khi ở Nga.',
    tip: 'Bạn cứ bấm nút "Tiếp theo" để xem hướng dẫn nhé.',
  },
  {
    icon: <BookOpen className="w-12 h-12" />,
    title: 'Mục "Học"',
    description: 'Học bảng chữ cái, từ vựng và các câu giao tiếp thông dụng. Mỗi câu đều có phiên âm để bạn đọc theo.',
    tip: 'Ví dụ: Привет đọc là "Privyet" (xin chào).',
  },
  {
    icon: <Languages className="w-12 h-12" />,
    title: 'Mục "Dịch"',
    description: 'Gõ hoặc dán chữ tiếng Việt để dịch sang tiếng Nga và ngược lại. Bấm nút "Nghe đọc" để nghe phát âm qua loa.',
    tip: 'Dưới mỗi câu tiếng Nga đều có phiên âm giúp bạn đọc theo.',
  },
  {
    icon: <Mic className="w-12 h-12" />,
    title: 'Mục "Nói"',
    description: 'Nói tiếng Việt vào điện thoại, app sẽ dịch sang tiếng Nga và đọc to lên để người Nga nghe hiểu.',
    tip: 'Rất hữu ích khi hỏi đường, mua đồ, gọi món ăn.',
  },
  {
    icon: <Camera className="w-12 h-12" />,
    title: 'Mục "Quét"',
    description: 'Chụp ảnh bảng hiệu, thực đơn, giấy tờ tiếng Nga — app sẽ đọc chữ trong ảnh và dịch ngay trên ảnh.',
    tip: 'Lần đầu dùng cần cho phép app truy cập máy ảnh.',
  },
  {
    icon: <Bot className="w-12 h-12" />,
    title: 'Mục "Trợ lý"',
    description: 'Hỏi đáp mọi thứ về nước Nga: văn hóa, du lịch, thủ tục giấy tờ. Trợ lý trả lời bằng tiếng Việt.',
  },
  {
    icon: <Siren className="w-12 h-12" />,
    title: 'Nút "SOS"',
    description: 'Khi gặp khẩn cấp, bấm nút SOS để xem số điện thoại khẩn cấp ở Nga và các câu cầu cứu bằng tiếng Nga.',
    tip: 'Hãy nhớ vị trí nút này để dùng khi cần gấp.',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] v2-bg flex flex-col">
      {/* Nội dung */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center overflow-y-auto">
        <div className="w-24 h-24 rounded-3xl v2-accent-soft flex items-center justify-center v2-accent-text mb-6">
          {current.icon}
        </div>

        <h2 className="text-2xl font-bold v2-text mb-4">
          {current.title}
        </h2>

        <p className="text-base v2-text-muted leading-relaxed max-w-md">
          {current.description}
        </p>

        {current.tip && (
          <p className="mt-4 text-sm v2-accent-text bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3 max-w-md">
            💡 {current.tip}
          </p>
        )}

        {/* Chấm chỉ bước */}
        <div className="flex gap-2 mt-8">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === step ? 'w-8 v2-accent-bg' : 'w-2.5 v2-divider'
              }`}
              aria-label={`Bước ${idx + 1}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs v2-text-faint">
          Bước {step + 1} / {STEPS.length}
        </p>
      </div>

      {/* Nút điều hướng */}
      <div className="p-6 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 px-5 py-3.5 rounded-2xl v2-card v2-text font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>
        )}

        <button
          onClick={() => (isLast ? onComplete() : setStep(step + 1))}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl v2-accent-bg font-bold text-base cursor-pointer"
        >
          {isLast ? (
            <>
              <Check className="w-5 h-5" />
              Bắt đầu sử dụng
            </>
          ) : (
            <>
              Tiếp theo
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Bỏ qua */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="pb-6 text-sm v2-text-muted underline cursor-pointer"
        >
          Bỏ qua hướng dẫn
        </button>
      )}
    </div>
  );
};

export const ONBOARDING_KEY = 'onboarding_completed';
