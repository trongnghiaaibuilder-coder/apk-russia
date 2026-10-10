# SECURITY & PRIVACY SPECIFICATION — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer**: Xương Rồng AI developer  
**Target**: Android Mobile-First Application  

---

## 1. Zero-Secrets Policy
1. **No Embedded Client Secrets**: Neither the frontend bundle, git repository, nor source files contain API keys, private tokens, passwords, or service credentials.
2. **Server-Side Proxy Requirement**: All calls to `@google/genai` or external translation providers are strictly routed through server-side handlers (`/api/assistant/chat`, `/api/translation/translate`) utilizing `process.env.GEMINI_API_KEY`.
3. **Environment Isolation**: `.env.example` contains only non-secret placeholders (`MY_GEMINI_API_KEY`, `MY_APP_URL`).

---

## 2. Runtime Hardware Permissions & Privacy
- **Microphone (`android.permission.RECORD_AUDIO`)**: Requested strictly when initiating voice translation or 2-way conversation. Transparent user guidance when permission is denied, with zero background recording.
- **Camera (`android.permission.CAMERA`)**: Requested strictly when opening the live OCR viewfinder. Users can alternatively pick an existing photo from device gallery or use built-in offline Russian signage presets.
- **On-Device OCR Processing**: Image processing and text recognition are executed locally on device canvases without unauthorized cloud photo uploads.

---

## 3. Threat Model & Mitigations
| Threat Vector | Mitigation Strategy |
| :--- | :--- |
| **API Key Theft** | Zero API keys in client bundle; proxy architecture via Node/Express backend |
| **Data Leakage in Logs** | `logger.ts` filters out credentials, tokens, and PII from memory and console logs |
| **Offline Tampering** | Schemas validated at runtime with fallback to safe defaults if corruption detected |
| **Input Exploitation** | Length constraints (500 chars on translation, 1500 chars on assistant), prompt sanitization |
| **Eavesdropping** | All transport over HTTPS; no telemetry or unconsented tracking |

---

## 4. Sensitive Data Handling & User Privacy
- **Zero Account Obligation**: The application does not require user registration, passwords, phone numbers, or emails to learn Russian, translate, or use emergency guides.
- **User Data Storage**: Learning progress, bookmarks, and translation history are stored strictly on the local device via `safeStorage` (HTML5 localStorage with in-memory fallback).
- **Clear Data Controls**: Users can clear translation history, conversation history, and quiz progress at any time with a single tap.

---

## 5. Network Communication & Error Sanitization
- **Network Boundaries**: Only two API endpoints exist (`/api/assistant/chat` and `/api/translation/translate`).
- **Error Messages**: User-facing error messages are sanitized into friendly, actionable Vietnamese instructions without exposing internal system stack traces, database strings, or environment variables.

---

## 6. Secret Scanning & Audit
- Continuous automated secret scanning verifies that no Google API keys (`AIza...`), bearer tokens, private keys, or passwords exist across the repository.
