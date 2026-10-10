# SYSTEM ARCHITECTURE — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer Credit**: Xương Rồng AI developer  
**Target**: Android Mobile-First Application  

---

## 1. Architectural Layers & Separation of Concerns

The codebase enforces a 5-layer clean architecture with unidirectional dependencies:

```
┌─────────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER (UI)                     │
│  Pages, Shell, BottomNav, Header, Modals, Touch Components  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (calls use cases / hooks)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 APPLICATION / USE CASES                     │
│   LearningOrchestrator, TranslationManager, VoiceDirector,  │
│   AssistantSession, OcrProcessor, HistoryCoordinator        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (business rules & models)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                           │
│  Entities: Letter, Word, Phrase, Lesson, HistoryItem,       │
│  KnowledgeArticle, VoiceTurn, TranslationResult, CaseRule   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (abstract interfaces)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE / ADAPTERS                  │
│  ITranslationProvider, ISpeechService, ITextToSpeechService,│
│  IOcrService, IAIAssistantProvider, ISafeStorage            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (concrete drivers)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA & EXTERNAL PLATFORM                   │
│  LocalStorage, Web Speech API, SpeechSynthesis, Tesseract/  │
│  Canvas OCR, Gemini Server Proxy (/api/assistant), Datasets │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure Mapping

```
src/
├── app/                  # Top-level AppShell, Providers, Route Config
├── presentation/         # Shared UI components, Design tokens, Icons
│   ├── components/       # Button, Card, Modal, SectionHeader, LoadingState, etc.
│   └── layout/           # AppShell, Header, BottomNav
├── domain/               # Core entities, interfaces, value types
├── application/          # Service facades and state hooks
├── data/                 # Static datasets (alphabet, vocabulary, phrases, lessons, knowledge)
│   └── dictionary/       # 6 Cases, Declension, Conjugations, Lexicon, Morphology
├── infrastructure/       # Concrete adapters for External APIs, Storage, Audio, OCR
│   ├── ai/               # Gemini AI Server Proxy adapter
│   ├── translation/      # Translation provider abstraction & Local fallback
│   ├── speech/           # Web Speech Recognition & SpeechSynthesis
│   ├── ocr/              # Camera & Optical Character Recognition
│   ├── storage/          # SafeStorage with In-Memory fallback
│   └── network/          # ConnectivityObserver (Online/Offline)
├── features/             # Feature slices:
│   ├── learning/         # Alphabet, Vocab, Phrases, Lessons, Flashcard, Quiz, Progress
│   ├── translation/      # Bilingual translator & history
│   ├── voice/            # 1-way voice & 2-way dual-mic conversation
│   ├── camera/           # Viewfinder, photo capture, OCR extraction
│   ├── assistant/        # Local knowledge base & Gemini AI assistant
│   └── emergency/        # SOS 112, Police, Ambulance, Embassy hotline, Crisis cards
└── shared/               # Utilities (cn, formatters, logger, error boundary)
```

---

## 3. Data Flow & Integration Workflows

### 3.1 Voice → STT → Translation → TTS
1. User taps mic (VI or RU).
2. `speechRecognitionService` captures audio chunk and returns real-time transcript.
3. Upon end of speech, transcript is routed to `translationService.translate()`.
4. Translation result is rendered on screen and passed to `textToSpeechService.speak()`.
5. Turn is added to conversation timeline.

### 3.2 Camera → OCR → Translation → Voice
1. User snaps image or selects image in Camera module.
2. `ocrService` performs Cyrillic text extraction and bounding box detection.
3. Extracted text is displayed in an editable preview.
4. User taps "Dịch ngay" (Translate) → routes to `translationService`.
5. Translation is displayed with TTS playback option.

### 3.3 Learning → Flashcards → Quiz → Progress
1. User reviews Cyrillic alphabet and vocabulary items.
2. Taps "Đã thuộc" or "Cần ôn" → updates `learningStorage`.
3. Quiz engine generates 10 deterministic questions based on vocabulary and phrases.
4. Accuracy percentage is computed and permanently stored in local progress metrics.
