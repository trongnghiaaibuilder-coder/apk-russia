/**
 * Bộ đổi tiền VND ↔ RUB cho khách Việt ở Nga.
 * Dùng tỷ giá offline (có thể chỉnh tay khi cần).
 * Developer: Xương Rồng AI Developer
 */
import React, { useState } from 'react';
import { ArrowUpDown, Banknote } from 'lucide-react';
import { safeStorage } from '../../../services/storage';

// Tỷ giá mặc định: 1 RUB ≈ 320 VND (cập nhật 10/2026, chỉnh được)
const DEFAULT_RATE = 320;
const RATE_KEY = 'currency_rub_vnd_rate';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100000');
  const [direction, setDirection] = useState<'vnd-rub' | 'rub-vnd'>('vnd-rub');
  const [rate, setRate] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem<string>(RATE_KEY, '');
      return saved ? parseFloat(saved) : DEFAULT_RATE;
    } catch {
      return DEFAULT_RATE;
    }
  });
  const [editingRate, setEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(String(rate));

  const numAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;

  const result = direction === 'vnd-rub'
    ? numAmount / rate
    : numAmount * rate;

  const formatNum = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 0 });

  const handleSaveRate = () => {
    const r = parseFloat(rateInput);
    if (r > 0) {
      setRate(r);
      try { safeStorage.setItem(RATE_KEY, String(r)); } catch {}
    }
    setEditingRate(false);
  };

  return (
    <div className="v2-card rounded-3xl p-5 v2-fade-up space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <Banknote className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold v2-text">Đổi tiền</h3>
          <p className="text-xs v2-text-muted">Việt Nam Đồng ↔ Rúp Nga</p>
        </div>
      </div>

      {/* Nhập số tiền */}
      <div>
        <label className="text-xs v2-text-muted font-medium">
          {direction === 'vnd-rub' ? 'Số tiền VND' : 'Số tiền RUB (₽)'}
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full px-4 py-3 rounded-2xl v2-bg-soft v2-text text-xl font-bold outline-none border v2-divider focus:border-emerald-500/50"
          placeholder="Nhập số tiền..."
        />
      </div>

      {/* Nút đảo chiều */}
      <button
        onClick={() => setDirection(d => d === 'vnd-rub' ? 'rub-vnd' : 'vnd-rub')}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl v2-accent-soft v2-accent-text font-semibold text-sm cursor-pointer"
      >
        <ArrowUpDown className="w-4 h-4" />
        {direction === 'vnd-rub' ? 'VND → RUB' : 'RUB → VND'}
      </button>

      {/* Kết quả */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
        <p className="text-xs v2-text-muted">Kết quả</p>
        <p className="text-2xl font-black text-emerald-400 mt-1">
          {formatNum(result)} {direction === 'vnd-rub' ? '₽' : '₫'}
        </p>
      </div>

      {/* Tỷ giá */}
      <div className="flex items-center justify-between text-xs v2-text-muted">
        {editingRate ? (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              inputMode="numeric"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl v2-bg-soft v2-text outline-none border v2-divider"
              placeholder="1 RUB = ? VND"
            />
            <button
              onClick={handleSaveRate}
              className="px-4 py-2 rounded-xl v2-accent-bg text-sm font-bold cursor-pointer"
            >
              Lưu
            </button>
          </div>
        ) : (
          <>
            <span>Tỷ giá: 1 ₽ = {formatNum(rate)} ₫</span>
            <button
              onClick={() => { setRateInput(String(rate)); setEditingRate(true); }}
              className="underline cursor-pointer"
            >
              Sửa
            </button>
          </>
        )}
      </div>
    </div>
  );
};
