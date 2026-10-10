import React, { useState } from 'react';
import { Wifi, WifiOff, Trash2, Info, ChevronRight, KeyRound, Eye, EyeOff, RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { updateService, UpdateInfo, CURRENT_VERSION_NAME } from '../services/updateService';
import { safeStorage } from '../services/storage';
import { appSettings } from '../services/appSettings';

interface SettingsViewProps {
  isOnline: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isOnline }) => {
  const [apiKey, setApiKey] = useState(appSettings.getGeminiApiKey());
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState(false);

  const handleSaveKey = () => {
    appSettings.setGeminiApiKey(apiKey);
    setKeySaved(true);
    window.setTimeout(() => setKeySaved(false), 2500);
  };

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateError(null);
    setUpdateInfo(null);
    setIsUpToDate(false);
    const result = await updateService.checkForUpdate();
    setCheckingUpdate(false);
    if (result.hasUpdate && result.updateInfo) {
      setUpdateInfo(result.updateInfo);
    } else if (result.error) {
      setUpdateError(result.error);
    } else {
      setIsUpToDate(true);
    }
  };

  const handleDownloadUpdate = async () => {
    if (!updateInfo) return;
    setDownloading(true);
    setUpdateError(null);
    const result = await updateService.downloadAndInstall(updateInfo.apkUrl);
    setDownloading(false);
    if (!result.success) {
      setUpdateError(result.error || 'Tải cập nhật thất bại.');
    }
    // Nếu thành công, native đã mở màn hình cài đặt
  };

  const handleSkipUpdate = () => {
    if (updateInfo) {
      updateService.skipVersion(updateInfo.versionCode);
      setUpdateInfo(null);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Xóa toàn bộ tiến độ học và lịch sử? Hành động này không thể hoàn tác.')) {
      safeStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5">
      <div className="v2-fade-up">
        <h1 className="text-xl font-black v2-text">Cài đặt</h1>
        <p className="text-[13px] v2-text-muted mt-1">Tùy chỉnh trải nghiệm của bạn</p>
      </div>

      {/* AI Connection */}
      <div className="v2-fade-up v2-fade-up-1 rounded-3xl v2-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-300 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-bold v2-text">Kết nối Trợ lý AI</div>
            <div className="text-[12px] v2-text-muted">Nhập Gemini API key để trò chuyện trực tuyến</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dán Gemini API key vào đây..."
              className="w-full v2-input rounded-2xl px-4 py-2.5 text-[13px] outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 v2-text-faint hover:opacity-70-muted cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSaveKey}
            className="px-4 py-2.5 rounded-2xl bg-violet-600 v2-text text-[13px] font-bold active:scale-95 transition-transform cursor-pointer"
          >
            Lưu
          </button>
        </div>
        {keySaved && (
          <p className="text-[12px] text-emerald-300 mt-2">Đã lưu! Trợ lý AI sẽ dùng kết nối trực tuyến.</p>
        )}
        <p className="text-[11px] v2-text-faint mt-2 leading-relaxed">
          Lấy key miễn phí tại aistudio.google.com → Get API Key. Không có key, app vẫn dùng tri thức ngoại tuyến.
        </p>
      </div>

      {/* Connection */}
      <div className="v2-fade-up v2-fade-up-1 rounded-3xl v2-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[14px] font-bold v2-text">Kết nối mạng</div>
              <div className="text-[12px] v2-text-muted">
                {isOnline ? 'Đang trực tuyến' : 'Đang ngoại tuyến — app vẫn hoạt động đầy đủ'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cập nhật ứng dụng */}
      <div className="v2-fade-up v2-fade-up-2 rounded-3xl v2-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl v2-accent-soft v2-accent-text flex items-center justify-center">
              <RefreshCw className={`w-5 h-5 ${checkingUpdate ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-[14px] font-bold v2-text">Cập nhật ứng dụng</div>
              <div className="text-[12px] v2-text-muted">Phiên bản hiện tại: {CURRENT_VERSION_NAME}</div>
            </div>
          </div>
          <button
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            className="px-4 py-2 rounded-2xl v2-accent-bg text-[13px] font-bold active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
          >
            {checkingUpdate ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </button>
        </div>

        {isUpToDate && (
          <div className="mt-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[13px] text-emerald-600 font-medium">Bạn đang dùng bản mới nhất!</span>
          </div>
        )}

        {updateError && (
          <div className="mt-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-500">
            {updateError}
          </div>
        )}

        {updateInfo && (
          <div className="mt-2 p-3 rounded-2xl v2-accent-soft border v2-divider space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold v2-text">Có bản mới: {updateInfo.versionName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full v2-accent-bg font-semibold">MỚI</span>
            </div>
            {updateInfo.releaseNotes && (
              <p className="text-[12px] v2-text-muted leading-relaxed">{updateInfo.releaseNotes}</p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleDownloadUpdate}
                disabled={downloading}
                className="flex-1 py-2.5 rounded-2xl v2-accent-bg text-[13px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
              >
                {downloading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /><span>Đang tải...</span></>
                ) : (
                  <><Download className="w-4 h-4" /><span>Tải bản mới</span></>
                )}
              </button>
              {!updateInfo.mandatory && (
                <button
                  onClick={handleSkipUpdate}
                  className="px-4 py-2.5 rounded-2xl v2-card text-[13px] font-semibold v2-text-muted active:scale-95 transition-transform cursor-pointer"
                >
                  Để sau
                </button>
              )}
            </div>
            <p className="text-[11px] v2-text-faint leading-relaxed">
              Bấm sẽ mở trình duyệt để tải file APK — tải xong bạn mở file để cài đặt.
            </p>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="v2-fade-up v2-fade-up-3 rounded-3xl v2-card overflow-hidden">
        <div className="p-4 pb-2">
          <div className="text-[14px] font-bold v2-text mb-1">Dữ liệu của bạn</div>
          <p className="text-[12px] v2-text-muted">Tiến độ học được lưu trên thiết bị này</p>
        </div>
        <button
          onClick={handleClearData}
          className="w-full flex items-center justify-between p-4 hover:opacity-80 active:opacity-60 transition-opacity cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl v2-accent-soft text-red-300 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[14px] font-semibold text-red-300">Xóa dữ liệu học tập</div>
              <div className="text-[12px] v2-text-faint">Làm mới tiến độ và lịch sử</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 v2-text-faint" />
        </button>
      </div>

      {/* About */}
      <div className="v2-fade-up v2-fade-up-4 rounded-3xl v2-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-300 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-[14px] font-bold v2-text">Về ứng dụng</div>
        </div>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="v2-text-muted">Tên ứng dụng</span>
            <span className="v2-text font-medium">Nước Nga Trong Tầm Tay</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="v2-text-muted">Phiên bản</span>
            <span className="v2-text font-medium">2.2.0</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="v2-text-muted">Chế độ</span>
            <span className="text-emerald-300 font-medium">Ngoại tuyến ưu tiên</span>
          </div>
        </div>
      </div>

      <p className="v2-fade-up text-center text-[11px] v2-text-faint px-8 leading-relaxed">
        Được thiết kế với ❤️ cho cộng đồng người Việt tại Nga
      </p>
      <p className="text-center text-[11px] v2-text-faint font-semibold">
        Xương Rồng AI Developer
      </p>
    </div>
  );
};
