/**
 * Camera Stream & Capture Service
 *
 * Manages device media streams, camera switching, frame captures,
 * permission states, and fallback file uploads.
 * Prefers native AndroidCamera bridge when available (reliable in WebView).
 */

import { CameraFacingMode, CameraPermissionState, CameraStatus } from '../types';
import { logger } from '../../../services/logger';

declare global {
  interface Window {
    AndroidCamera?: {
      isAvailable(): boolean;
      capturePhoto(): void;
    };
    __onNativePhotoCaptured?: (base64Jpeg: string) => void;
    __onNativePhotoError?: (message: string) => void;
  }
}

export function getNativeCamera(): Window['AndroidCamera'] | null {
  if (typeof window !== 'undefined' && window.AndroidCamera && typeof window.AndroidCamera.capturePhoto === 'function') {
    try {
      if (window.AndroidCamera.isAvailable()) return window.AndroidCamera;
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Capture a photo using the native camera app.
 * Resolves with an HTMLCanvasElement containing the photo, or rejects on error/cancel.
 */
export function captureNativePhoto(): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const bridge = getNativeCamera();
    if (!bridge) {
      reject(new Error('Camera native không khả dụng trên thiết bị này.'));
      return;
    }
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Hết thời gian chờ chụp ảnh.'));
    }, 120000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.__onNativePhotoCaptured = undefined;
      window.__onNativePhotoError = undefined;
    };

    window.__onNativePhotoCaptured = (base64Jpeg: string) => {
      cleanup();
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không thể xử lý ảnh chụp.'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('Không đọc được ảnh vừa chụp.'));
      img.src = `data:image/jpeg;base64,${base64Jpeg}`;
    };
    window.__onNativePhotoError = (message: string) => {
      cleanup();
      reject(new Error(message || 'Không chụp được ảnh.'));
    };

    try {
      bridge.capturePhoto();
    } catch (err: any) {
      cleanup();
      reject(err);
    }
  });
}

export class CameraService {
  private currentStream: MediaStream | null = null;
  private currentFacingMode: CameraFacingMode = 'environment';
  private permissionState: CameraPermissionState = 'prompt';

  /**
   * Check whether camera hardware and mediaDevices are available
   */
  isSupported(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
  }

  /**
   * Get current camera stream
   */
  getStream(): MediaStream | null {
    return this.currentStream;
  }

  /**
   * Current facing mode (back = environment, front = user)
   */
  getFacingMode(): CameraFacingMode {
    return this.currentFacingMode;
  }

  /**
   * Current permission state
   */
  getPermissionState(): CameraPermissionState {
    return this.permissionState;
  }

  /**
   * Request and start the camera stream
   */
  async startCamera(facingMode: CameraFacingMode = 'environment'): Promise<{
    success: boolean;
    stream?: MediaStream;
    status: CameraStatus;
    error?: string;
  }> {
    if (!this.isSupported()) {
      this.permissionState = 'unsupported';
      return {
        success: false,
        status: 'unsupported',
        error: 'Thiết bị hoặc trình duyệt hiện tại không hỗ trợ truy cập camera trực tiếp qua WebRTC.'
      };
    }

    // Stop any existing stream first
    this.stopCamera();
    this.currentFacingMode = facingMode;

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentStream = stream;
      this.permissionState = 'granted';
      logger.info('CameraService', 'Camera stream started successfully', { facingMode });

      return {
        success: true,
        stream,
        status: 'active'
      };
    } catch (err: any) {
      logger.warn('CameraService', 'Camera access error', { name: err.name, message: err.message });

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.permissionState = 'denied';
        return {
          success: false,
          status: 'permission_denied',
          error: 'Ứng dụng chưa được cấp quyền truy cập Camera. Vui lòng cho phép quyền Camera trong cài đặt để quét biển hiệu Nga.'
        };
      }

      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        this.permissionState = 'unsupported';
        return {
          success: false,
          status: 'unsupported',
          error: 'Không tìm thấy phần cứng camera trên thiết bị.'
        };
      }

      return {
        success: false,
        status: 'error',
        error: `Không thể khởi động camera: ${err.message || 'Lỗi không xác định'}`
      };
    }
  }

  /**
   * Stop active camera stream and release hardware
   */
  stopCamera(): void {
    if (this.currentStream) {
      try {
        this.currentStream.getTracks().forEach(track => {
          track.stop();
        });
      } catch (err) {
        logger.error('CameraService', 'Error stopping media tracks', err);
      }
      this.currentStream = null;
    }
  }

  /**
   * Toggle between back (environment) and front (user) camera
   */
  async switchCamera(): Promise<{ success: boolean; stream?: MediaStream; status: CameraStatus; error?: string }> {
    const nextMode: CameraFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
    return this.startCamera(nextMode);
  }

  /**
   * Capture single video frame onto an offscreen canvas
   */
  captureSnapshot(videoElement: HTMLVideoElement): HTMLCanvasElement | null {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      logger.warn('CameraService', 'Cannot capture frame: video element not ready');
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  /**
   * Load uploaded or selected image file into canvas
   */
  async loadImageFileToCanvas(file: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Tệp tải lên không phải là định dạng hình ảnh hợp lệ.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Không thể khởi tạo môi trường vẽ canvas.'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = () => reject(new Error('Không thể đọc dữ liệu tệp hình ảnh.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Lỗi khi đọc tệp tin.'));
      reader.readAsDataURL(file);
    });
  }
}

export const cameraService = new CameraService();
