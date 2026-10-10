# PRODUCT SPECIFICATION — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer Credit**: Xương Rồng AI developer  
**Target Platform**: Android Mobile Application / Responsive Mobile-First PWA  
**Language Focus**: Russian (Русский) ↔ Vietnamese (Tiếng Việt)  

---

## 1. Product Vision & Mission
Russia AI Support is an intelligent, offline-first mobile companion specifically tailored for Vietnamese expatriates, students, workers, business delegates, and tourists in the Russian Federation. 

It empowers users to:
1. **Master Core Russian**: Learn the 33 Cyrillic letters, foundational phonetics, 112+ practical words, 55+ survival phrases, and 16 situational lessons with quizzes and flashcards.
2. **Break Language Barriers**: Bidirectional Vietnamese ↔ Russian instant text translation with deterministic local offline fallback and online API integration.
3. **Communicate Naturally with Voice**: 1-way voice translation and 2-way live conversation (Vietnamese speaker ↔ Russian speaker) with Speech Recognition and Text-to-Speech (vi-VN & ru-RU).
4. **Read Signs & Documents via Camera + OCR**: Cyrillic optical character recognition for street signage, subway maps, train tickets, migration forms, and menus with 1-tap translation.
5. **Receive Real-Life Contextual Guidance**: Complete knowledge base spanning Metro/Subway systems, Migration card rules (7-day registration), Mir banking & currency exchange, cultural etiquette, and emergency protocols.
6. **Access Offline Safety (SOS 112)**: Critical helpline directory (112, 103, 102, 101), Vietnamese Embassy contacts in Moscow/Vladivostok/Yekaterinburg, and crisis show-to-local cards.

---

## 2. Target Audience & Personas
- **Persona 1: Expatriate / Worker (Lao động Việt Nam)**: Needs fast translation for daily survival, shopping, banking (Mir), police/registration compliance, and medical emergencies.
- **Persona 2: Vietnamese Student (Du học sinh tại Nga)**: Needs Cyrillic learning, grammar declension/conjugation guides, Metro navigation, and university paperwork assistance.
- **Persona 3: Tourist / Business Traveler (Du khách & Doanh nhân)**: Needs speech translation, OCR for signs/menus, airport/Aeroexpress guidance, and cultural etiquette.

---

## 3. Feature Scope Matrix

| Phase | Feature Module | Core Functionality | Offline Capable |
| :--- | :--- | :--- | :--- |
| **P1** | **Foundation Shell** | Mobile frame (360-440px), BottomNav (7 tabs), ErrorBoundary, SafeStorage, Connectivity | YES (100%) |
| **P2** | **Russian Learning** | 33 Cyrillic letters, 10 phonetics, 112+ vocabulary, 55+ phrases, 16 lessons, Flashcards, Quiz, Progress | YES (100%) |
| **P3** | **Text Translator** | VI ↔ RU translation, Swap languages, 500-char limit, History restore/clear, Offline fallback demo | YES (Fallback) / Online (Full) |
| **P4** | **Voice & 2-Way Chat**| Speech-to-text (vi-VN/ru-RU), TTS audio, 2-way dual-mic conversation with timeline replay | YES (Device STT/TTS) |
| **P5** | **Camera & OCR** | Live viewfinder, photo upload/capture, Cyrillic text extraction, Send to Translator/TTS | YES (Client OCR) |
| **P6** | **AI Assistant** | Gemini 3.8-Flash server-side assistant, context prompts, 27 offline knowledge articles, bookmarks | Partial (Knowledge offline) |
| **P7** | **Real-Life Russia** | Deep guides for Metro, Migration (115-FZ), Mir banking, Customs, Winter survival, Embassy SOS | YES (100%) |
| **P8** | **Offline Hardening** | Transparent offline indicator, automatic graceful fallback, zero simulated fake loaders | YES |
| **P9** | **Security & Privacy** | Strict secret isolation, zero API keys in client, safe local storage, permission checks | YES |
| **P10**| **Integration** | Cross-feature flows: OCR → Translate → TTS, Voice → Translate → History, Learn → Quiz → Progress | YES |

---

## 4. Non-Functional Requirements
- **Performance**: Startup time < 1.5s, local search < 30ms, touch response < 100ms.
- **Reliability**: ErrorBoundary recovery, zero unhandled promise rejections, memory safety.
- **Accessibility**: 44x44px minimum touch targets, high-contrast dark UI (WCAG AA), screen-reader friendly labels.
- **Ethical AI**: "Strict No-Fake-AI Guarantee" — never pretend simulated responses are real external provider results.
