# OFFLINE SPECIFICATION — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer**: Xương Rồng AI developer  

---

## 1. Offline Philosophy
The application strictly enforces **Core Principle 3.1: Offline-First**.
Users traveling, riding the deep Moscow/Saint Petersburg Metro, or in emergency situations cannot rely on continuous internet connectivity.

---

## 2. Capability Matrix

| Feature | Behavior Online | Behavior Offline | Fallback Mechanism |
| :--- | :--- | :--- | :--- |
| **Cyrillic Alphabet (33)** | Full access with pronunciation | Full access with pronunciation | 100% bundled locally |
| **Vocabulary (112+)** | Full access with audio & categories | Full access with categories | 100% bundled locally |
| **Phrases (55+)** | Full access with situation context | Full access with situation context | 100% bundled locally |
| **Lessons (16)** | Full access with practice quizzes | Full access with practice quizzes | 100% bundled locally |
| **Bilingual Translation** | Online provider (if configured) | Local deterministic fallback dictionary | Transparent fallback notice |
| **Voice Translation** | Device STT / TTS | Device STT / TTS (if local voice installed) | Fallback notice if engine needs cloud |
| **Camera & OCR** | Live viewfinder & OCR | Client-side Canvas/OCR pattern matching | Fallback notice & manual edit |
| **Assistant / Knowledge** | Gemini 3.8-Flash server answers | 27 curated offline knowledge articles | Local keyword & category search |
| **SOS & Emergency (112)** | Helplines & direct dial | Helplines & offline show-to-local cards | 100% bundled locally |

---

## 3. Strict No-Fake-AI Policy
When network is unavailable:
1. Online-only functions clearly notify the user of network requirements.
2. The app never pretends to fetch online translation or generate synthetic AI answers by showing fake loading spinners followed by fabricated text.
3. Offline status is prominently displayed in the top header (`Offline` pill).
