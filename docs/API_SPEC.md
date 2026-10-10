# API SPECIFICATION — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer**: Xương Rồng AI developer  

---

## 1. Internal Abstraction Contracts

### 1.1 Translation Provider Interface (`ITranslationProvider`)
```typescript
export interface ITranslationProvider {
  translate(request: {
    text: string;
    sourceLang: 'vi' | 'ru';
    targetLang: 'vi' | 'ru';
  }): Promise<{
    success: boolean;
    result?: {
      sourceText: string;
      translatedText: string;
      sourceLanguage: 'vi' | 'ru';
      targetLanguage: 'vi' | 'ru';
      provider: string;
      timestamp: string;
      isFallback: boolean;
    };
    error?: string;
  }>;
}
```

### 1.2 Speech Recognition Interface (`ISpeechRecognitionService`)
```typescript
export interface ISpeechRecognitionService {
  isSupported(): boolean;
  isListening(): boolean;
  getTranscript(): string;
  startListening(
    language: string,
    onResult: (e: { transcript: string; isFinal: boolean }) => void,
    onError: (code: string, message: string) => void,
    onEnd: () => void
  ): Promise<void>;
  stopListening(): Promise<void>;
  cancelListening(): Promise<void>;
}
```

### 1.3 Text-To-Speech Interface (`ITextToSpeechService`)
```typescript
export interface ITextToSpeechService {
  isSupported(): boolean;
  isSpeaking(): boolean;
  resolveLanguageTag(lang: 'vi' | 'ru' | string): string;
  speak(
    text: string,
    language: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<boolean>;
  stop(): Promise<void>;
}
```

### 1.4 Camera & OCR Interface (`IOcrService`)
```typescript
export interface IOcrService {
  isSupported(): boolean;
  recognizeCyrillic(imageSource: string | HTMLCanvasElement | Blob): Promise<{
    success: boolean;
    text: string;
    confidence: number;
    lines: string[];
    error?: string;
  }>;
}
```

### 1.5 AI Assistant Interface (`IAIAssistantProvider`)
```typescript
export interface IAIAssistantProvider {
  askAssistant(request: {
    message: string;
    context?: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{
    success: boolean;
    reply: string;
    source: 'gemini_server' | 'local_knowledge_base' | 'offline_fallback';
    error?: string;
  }>;
}
```

---

## 2. Server-Side Endpoints (Proxy API)

### 2.1 Assistant Chat Route (`POST /api/assistant`)
- **Body**: `{ "message": string, "history": [{ "role": "user"|"assistant", "content": string }] }`
- **Headers**: `Content-Type: application/json`
- **Response**:
  ```json
  {
    "success": true,
    "reply": "Theo quy định tại Nga, sau khi nhập cảnh bạn cần đăng ký tạm trú trong 7 ngày...",
    "source": "gemini-3.8-flash"
  }
  ```
- **Security**: GEMINI_API_KEY is kept strictly on the backend (`process.env.GEMINI_API_KEY`) and never sent to the client.
