/**
 * Hệ thống tự động cập nhật app.
 * Developer: Xương Rồng AI Developer
 *
 * Cách hoạt động:
 * 1. App đọc file version.json từ URL cấu hình (mặc định: GitHub releases).
 * 2. So sánh versionCode với bản đang cài.
 * 3. Nếu có bản mới: hiện thông báo, người dùng bấm "Cập nhật" để tải và cài.
 *
 * File version.json mẫu:
 * {
 *   "versionCode": 11,
 *   "versionName": "2.9.0",
 *   "apkUrl": "https://github.com/user/repo/releases/download/v2.9.0/app.apk",
 *   "releaseNotes": "Sửa lỗi camera, thêm 262 câu mẫu",
 *   "mandatory": false
 * }
 */

export interface UpdateInfo {
  versionCode: number;
  versionName: string;
  apkUrl: string;
  releaseNotes: string;
  mandatory: boolean;
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  updateInfo: UpdateInfo | null;
  error?: string;
}

// URL file version.json — đổi thành URL thật khi publish
// Mặc định trỏ về GitHub releases của dự án
const DEFAULT_UPDATE_URL = 'https://raw.githubusercontent.com/trongnghiaaibuilder-coder/apk-russia/main/version.json';

const UPDATE_URL_KEY = 'app_update_url';
const LAST_CHECK_KEY = 'app_update_last_check';
const SKIP_VERSION_KEY = 'app_update_skip_version';

function getUpdateUrl(): string {
  try {
    const saved = localStorage.getItem(UPDATE_URL_KEY);
    if (saved) return saved;
  } catch {}
  return DEFAULT_UPDATE_URL;
}

export function setUpdateUrl(url: string): void {
  try {
    localStorage.setItem(UPDATE_URL_KEY, url);
  } catch {}
}

/** Version hiện tại của app (đồng bộ với versionName trong build) */
export const CURRENT_VERSION_CODE = 30;
export const CURRENT_VERSION_NAME = '2.18.0';

export const updateService = {
  /** Kiểm tra có bản cập nhật mới không.
   * @param ignoreSkip - true khi người dùng bấm "Kiểm tra" thủ công (bỏ qua trạng thái đã ẩn)
   */
  async checkForUpdate(ignoreSkip = false): Promise<UpdateCheckResult> {
    const current = {
      hasUpdate: false,
      currentVersion: CURRENT_VERSION_NAME,
      updateInfo: null as UpdateInfo | null,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      // Thêm timestamp để tránh cache
      const url = `${getUpdateUrl()}?t=${Date.now()}`;
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return { ...current, error: 'Không kiểm tra được cập nhật lúc này.' };
      }

      const info: UpdateInfo = await response.json();

      if (!info || typeof info.versionCode !== 'number' || !info.apkUrl) {
        return { ...current, error: 'File cập nhật không hợp lệ.' };
      }

      // Kiểm tra người dùng đã bỏ qua bản này chưa
      let skipped = 0;
      try {
        skipped = parseInt(localStorage.getItem(SKIP_VERSION_KEY) || '0', 10);
      } catch {}

      const isSkipped = !ignoreSkip && info.versionCode === skipped;
      if (info.versionCode > CURRENT_VERSION_CODE && !isSkipped) {
        try {
          localStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
        } catch {}
        return { hasUpdate: true, currentVersion: CURRENT_VERSION_NAME, updateInfo: info };
      }

      try {
        localStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
      } catch {}
      return current;
    } catch {
      return { ...current, error: 'Không có mạng hoặc máy chủ cập nhật không phản hồi.' };
    }
  },

  /** Bỏ qua bản cập nhật này (không nhắc lại) */
  skipVersion(versionCode: number): void {
    try {
      localStorage.setItem(SKIP_VERSION_KEY, String(versionCode));
    } catch {}
  },

  /** Tải và cài đặt APK — dùng native bridge (tự động tải + mở màn hình cài đặt), fallback mở trình duyệt */
  async downloadAndInstall(apkUrl: string): Promise<{ success: boolean; error?: string }> {
    // Fallback mở trình duyệt — dùng khi native thất bại
    const openInBrowser = (): { success: boolean; error?: string } => {
      try {
        const updater = (window as any).AndroidUpdater;
        if (updater && typeof updater.openInBrowser === 'function') {
          updater.openInBrowser(apkUrl);
          return { success: true, error: 'Đã mở trình duyệt để tải. Tải xong bạn mở file để cài đặt nhé.' };
        }
        // Dự phòng: mở bằng thẻ a
        window.open(apkUrl, '_blank');
        return { success: true, error: 'Đã mở link tải. Tải xong bạn mở file để cài đặt nhé.' };
      } catch {
        return { success: false, error: 'Không mở được link tải.' };
      }
    };

    // Ưu tiên native bridge trên Android — tự động tải qua DownloadManager
    const updater = (window as any).AndroidUpdater;
    if (updater && typeof updater.downloadAndInstall === 'function') {
      return new Promise((resolve) => {
        let done = false;
        const finish = (r: { success: boolean; error?: string }) => {
          if (done) return;
          done = true;
          delete (window as any).__onUpdateDownloaded;
          delete (window as any).__onUpdateError;
          resolve(r);
        };
        (window as any).__onUpdateDownloaded = () => {
          finish({ success: true });
        };
        (window as any).__onUpdateError = (msg: string) => {
          // Native lỗi → tự động chuyển sang trình duyệt
          finish(openInBrowser());
        };
        try {
          updater.downloadAndInstall(apkUrl);
        } catch (err: any) {
          finish(openInBrowser());
          return;
        }
        // Nếu 30 giây native không phản hồi → tự chuyển sang trình duyệt
        setTimeout(() => {
          if (!done) {
            finish(openInBrowser());
          }
        }, 30000);
      });
    }

    return openInBrowser();

    // Fallback: mở URL để trình duyệt tải
    try {
      const a = document.createElement('a');
      a.href = apkUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return { success: true };
    } catch {
      return { success: false, error: 'Không mở được link tải. Bạn copy link này mở bằng trình duyệt nhé.' };
    }
  },

  /** Lấy thời gian kiểm tra lần cuối */
  getLastCheckTime(): string | null {
    try {
      return localStorage.getItem(LAST_CHECK_KEY);
    } catch {
      return null;
    }
  },
};
