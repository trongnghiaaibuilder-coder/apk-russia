/**
 * Safe local storage service with in-memory fallback
 */
import { logger } from './logger';

// Native Android storage (SharedPreferences) — riêng từng máy, bền vững hơn localStorage
function getNativeStorage(): any | null {
  try {
    const bridge = (window as any).AndroidStorage;
    if (bridge && typeof bridge.isAvailable === 'function' && bridge.isAvailable()) {
      return bridge;
    }
  } catch {}
  return null;
}

class SafeStorageService {
  private memoryMap = new Map<string, string>();

  getItem<T>(key: string, defaultValue: T): T {
    // Ưu tiên native storage (riêng từng máy)
    try {
      const native = getNativeStorage();
      if (native) {
        const item = native.getItem(key);
        if (item !== null && item !== undefined) {
          return JSON.parse(item) as T;
        }
      }
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
    } catch (err) {
      logger.warn('StorageService', `Failed reading key "${key}" from localStorage, falling back to memory`, err);
    }
    const memoryVal = this.memoryMap.get(key);
    if (memoryVal !== undefined) {
      try {
        return JSON.parse(memoryVal) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  setItem<T>(key: string, value: T): boolean {
    const serialized = JSON.stringify(value);
    this.memoryMap.set(key, serialized);
    // Ghi vào native storage trước (riêng từng máy)
    try {
      const native = getNativeStorage();
      if (native) {
        native.setItem(key, serialized);
      }
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
        return true;
      }
    } catch (err) {
      logger.warn('StorageService', `Failed writing key "${key}" to localStorage`, err);
    }
    return false;
  }

  removeItem(key: string): void {
    this.memoryMap.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      logger.warn('StorageService', `Failed removing key "${key}"`, err);
    }
  }

  clear(): void {
    this.memoryMap.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (err) {
      logger.warn('StorageService', 'Failed clearing localStorage', err);
    }
  }
}

export const safeStorage = new SafeStorageService();
