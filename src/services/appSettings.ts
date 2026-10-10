/**
 * App settings: API keys and preferences (stored locally on device).
 */
import { safeStorage } from './storage';

const GEMINI_API_KEY_STORAGE_KEY = 'v2_settings_gemini_api_key';
const GROQ_API_KEY_STORAGE_KEY = 'v2_settings_groq_api_key';

class AppSettingsService {
  getGeminiApiKey(): string {
    try {
      return safeStorage.getItem<string>(GEMINI_API_KEY_STORAGE_KEY, '');
    } catch {
      return '';
    }
  }

  setGeminiApiKey(key: string): void {
    safeStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
  }

  hasGeminiApiKey(): boolean {
    return this.getGeminiApiKey().length > 10;
  }

  getGroqApiKey(): string {
    try {
      return safeStorage.getItem<string>(GROQ_API_KEY_STORAGE_KEY, '');
    } catch {
      return '';
    }
  }

  setGroqApiKey(key: string): void {
    safeStorage.setItem(GROQ_API_KEY_STORAGE_KEY, key.trim());
  }

  hasGroqApiKey(): boolean {
    return this.getGroqApiKey().length > 10;
  }
}

export const appSettings = new AppSettingsService();
