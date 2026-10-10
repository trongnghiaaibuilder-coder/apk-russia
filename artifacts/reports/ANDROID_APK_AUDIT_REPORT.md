# BÁO CÁO KIỂM TRA HIỆN TRẠNG DỰ ÁN & ĐÁNH GIÁ ĐÓNG GÓI ANDROID APK
**Dự án:** Russia AI Support  
**Nhà phát triển:** Xương Rồng AI developer  
**Thời điểm kiểm định:** 2026-10-09  

---

## 1. HIỆN TRẠNG CẤU HÌNH, FRAMEWORK & KIỂM THỬ

### 1.1. Framework & Phiên bản (`package.json`)
- **Frontend Framework:** React `^19.0.1` + React DOM `^19.0.1` (SPA).
- **Bundler / Build Tool:** Vite `^8.3.0` (`@vitejs/plugin-react` `^6.1.1`).
- **Styling:** Tailwind CSS `^4.3.3` (`@tailwindcss/vite` `^4.3.3`).
- **Ngôn ngữ & Kiểm tra kiểu:** TypeScript `^7.0.2`, thực thi script qua `tsx` `^4.21.0`.
- **Backend Proxy (Dev / Cloud Run):** Express `^4.21.2` (`server.ts`), tích hợp `@google/genai` `^2.4.0` (`gemini-2.5-flash`).
- **UI Icons & Animation:** `lucide-react` `^0.546.0`, `motion` `^12.23.24`.
- **Testing & Coverage:** Node.js built-in test runner (`tsx --test tests/*.test.ts`) + `c8` `^12.0.0`.

### 1.2. Cấu hình Build & Thư mục đầu ra (`vite.config.ts`, `index.html`)
- **Lệnh build production:** `npm run build` (thực thi `vite build`).
- **Thư mục đầu ra:** `dist/`
  - `dist/index.html`
  - `dist/assets/` (JS/CSS bundle đã minify)
  - `dist/manifest.json` (PWA manifest)
  - `dist/sw.js` (Service Worker lưu đệm ngoại tuyến)
- **Lưu ý trong `vite.config.ts`:** Chưa thiết lập `base: './'` (mặc định là `base: '/'`), khiến `dist/index.html` sinh đường dẫn tuyệt đối `/assets/...`. Nếu chạy qua `file:///android_asset/` sẽ không tải được JS/CSS, nhưng nếu chạy qua Capacitor (`https://localhost` local server) thì hoạt động bình thường.

### 1.3. Kết quả chạy thực tế TypeScript, Lint, Build & Test
Đã thực thi trực tiếp các lệnh kiểm định và lưu bằng chứng tại `artifacts/test-results/audit-test-coverage.txt`:
- **Typecheck / Lint (`npm run typecheck` / `tsc --noEmit`):** `PASS` (0 lỗi).
- **Production Build (`npm run build` & `compile_applet`):** `PASS` (0 lỗi).
- **Automated Tests (`npm run test:all`):** `PASS` — **182 / 182 bài kiểm thử đạt** trên **68 test suites**, **0 thất bại**.
- **Độ phủ mã nguồn thực tế (`npx c8 --reporter=text npm run test:all`):**
  - Toàn cục (tính cả các file giao diện `.tsx` chưa render DOM trong Node): **Statements: 67.04% | Branches: 77.47% | Functions: 83.20% | Lines: 67.04%**.
  - Các mô-đun dữ liệu & logic lõi đạt độ phủ cao:
    - `src/data/dictionary/**`: **88.39% – 100%**
    - `src/modules/learning/data/**`: **100%**
    - `src/modules/learning/services/**`: **95.02%**
    - `src/modules/reallife/services/**`: **97.89%**
    - `src/services/**`: **86.05%**

---

## 2. ĐÁNH GIÁ CHI TIẾT CÁC CHỨC NĂNG, MOCK PROVIDER & RỦI RO KỸ THUẬT

| Phân hệ | Trạng thái thực tế | Chi tiết kỹ thuật & Rủi ro khi lên Android APK |
| :--- | :--- | :--- |
| **P2. Học tập & Từ điển Việt - Nga** | **Hoàn thiện 100% (Offline)** | 33 chữ cái Cyrillic, 10 bài hướng dẫn phát âm, 303 từ vựng (23 chủ đề), 305 mục từ điển Việt-Nga (456 dạng biến cách), 55+ câu giao tiếp sinh tồn, 16 bài học, Flashcard, Quiz, Tiến độ cá nhân. |
| **P3. Dịch thuật (`translationService.ts`)** | **Bán phần (Local Fallback + Proxy)** | 1) Đang đọc `process.env.VITE_TRANSLATION_API_ENDPOINT` thay vì `import.meta.env.VITE_...`, dẫn tới trên trình duyệt luôn rơi về `Local Fallback (Demo Only)`.<br>2) Chưa nối mặc định vào endpoint `/api/translation/translate` đã viết sẵn trong `server.ts`.<br>3) Khi offline chỉ dịch được câu mẫu và từ đơn có trong từ điển nội bộ (305 từ). |
| **P4. Giọng nói STT & TTS (`speechRecognitionService.ts`, `textToSpeechService.ts`)** | **Phụ thuộc Web Speech API** | Dùng `window.SpeechRecognition` / `webkitSpeechRecognition` và `window.speechSynthesis`. **Rủi ro cao trên Android:** `android.webkit.WebView` trên nhiều máy Android không hỗ trợ `webkitSpeechRecognition` hoặc `speechSynthesis` nếu không qua plugin Native TTS/STT của Capacitor. |
| **P5. Camera + OCR (`ocrService.ts`)** | **Đang dùng Template giả lập cho Live Canvas** | Quét từ mẫu có sẵn (`recognizeFromSample`) và nhập văn bản (`recognizeText`) hoạt động thật. Tuy nhiên hàm `recognizeFromCanvas(canvas)` (dòng 258–358) chỉ kiểm tra ảnh có trắng/đen hoàn toàn không rồi **trả về cứng mẫu số 0** (`СТАНЦИЯ ПЛОЩАДЬ РЕВОЛЮЦИИ`), **chưa có engine OCR thực sự** (như Gemini Vision OCR, ML Kit hoặc Tesseract). |
| **P6. Trợ lý AI (`geminiAssistantProvider.ts`)** | **Phụ thuộc Backend `/api/assistant/chat`** | Gọi `fetch('/api/assistant/chat')` tới `server.ts`. Khi đóng gói thành APK chạy độc lập trên điện thoại, `server.ts` không chạy bên trong APK nên `fetch('/api/...')` sẽ lỗi 404/network và luôn rơi về `localKnowledgeProvider` (tĩnh), trừ khi cấu hình URL tuyệt đối tới server Cloud Run. |
| **P7. Hỗ trợ thực tế tại Nga (`reallife`)** | **Hoàn thiện 100% (Offline)** | Kịch bản khẩn cấp, tổng đài 112/103/102/101, Đại sứ quán Việt Nam tại Moscow hoạt động đầy đủ ngoại tuyến. |

---

## 3. KIỂM TRA BẢO MẬT, API KEY & BIẾN MÔI TRƯỜNG

1. **Quét khóa bí mật (Secret Scan):** `PASS` — Không có `GEMINI_API_KEY` thật hay thông tin nhạy cảm nào bị lộ trong mã nguồn, git hoặc `.env.example`.
2. **Kiến trúc khóa API:** `GEMINI_API_KEY` hiện chỉ nằm ở phía server (`server.ts`), rất an toàn cho môi trường Web/Cloud Run.
3. **Vấn đề khi đóng gói APK:**
   - Tuyệt đối **không nhúng `GEMINI_API_KEY` vào bundle frontend** của APK.
   - Cần sử dụng biến môi trường chuẩn Vite (`import.meta.env.VITE_API_BASE_URL`) trong frontend để khi chạy trên Android APK, ứng dụng gọi HTTPS tới Backend Proxy (`https://<cloud-run-domain>/api/assistant/chat` và `/api/translation/translate`), đồng thời cấu hình CORS trên `server.ts` cho phép origin `https://localhost` và `capacitor://localhost`.

---

## 4. KIỂM TRA CAPACITOR, THƯ MỤC `android/` & FILE APK HIỆN TẠI

1. **Capacitor:** **CHƯA ĐƯỢC CÀI ĐẶT** (không có `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` trong `package.json`, chưa có `capacitor.config.ts`).
2. **Thư mục `android/`:** Đã có cấu trúc project Android/Gradle cơ bản (`android/build.gradle`, `android/app/build.gradle`, `AndroidManifest.xml`, `MainActivity.kt`).
3. **Đánh giá trung thực về `scripts/package-apk.ts` và `artifacts/builds/russia-ai-support-v1.0.0.apk`:**
   - **CẢNH BÁO NGHIÊM TRỌNG:** Script `scripts/package-apk.ts` hiện tại chỉ tạo một file nén **ZIP** chứa các file mã nguồn dạng text (`AndroidManifest.xml` chưa biên dịch nhị phân, `MainActivity.kt` chưa biên dịch ra bytecode, `build.gradle`, `assets/public`) rồi đổi đuôi thành `.apk`.
   - File `artifacts/builds/russia-ai-support-v1.0.0.apk` hiện tại **THIẾU `classes.dex`**, **THIẾU `resources.arsc`**, `AndroidManifest.xml` ở dạng văn bản thuần thay vì Binary XML (`aapt2`), và **CHƯA ĐƯỢC KÝ SỐ (`apksigner`)**.
   - **Kết luận:** File `.apk` do `scripts/package-apk.ts` sinh ra là **APK giả lập (renamed ZIP)** và **CHẮC CHẮN KHÔNG THỂ CÀI ĐẶT** trên thiết bị Android thật (Android Package Installer sẽ từ chối ngay với lỗi `INSTALL_PARSE_FAILED_NOT_APK`).
   - Ngoài ra, `MainActivity.kt` hiện dùng `webView.loadUrl("file:///android_asset/public/index.html")`. Giao thức `file://` trong Android WebView chặn `<script type="module">` của Vite do chính sách CORS, khiến màn hình bị trắng nếu không dùng `WebViewAssetLoader` hoặc máy chủ cục bộ của **Capacitor**.

---

## 5. PHƯƠNG ÁN TÍCH HỢP CAPACITOR & CÁC BƯỚC TẠO APK CÀI ĐẶT ĐƯỢC TRÊN THIẾT BỊ THẬT

### 5.1. Tại sao nên chuyển sang Capacitor chính quy?
- **Giải quyết triệt để lỗi trắng trang `file://` của Vite:** Capacitor dùng `WebViewAssetLoader` phục vụ bundle `dist/` qua origin `https://localhost`, tương thích 100% với `<script type="module">`, Service Worker, Web Audio và Fetch API.
- **Hỗ trợ phần cứng Android ổn định:** Có thể gắn thêm `@capacitor-community/text-to-speech`, `@capacitor-community/speech-recognition`, `@capacitor/camera` để gọi thẳng hệ thống TTS/STT và Camera gốc của Android khi WebView không hỗ trợ.

### 5.2. Quy trình 6 bước thực hiện để tạo APK thật có thể cài đặt
1. **Bước 1 — Sao lưu bắt buộc (Backup & Manifest):**
   - Sao lưu toàn bộ `package.json`, `vite.config.ts`, `src/`, `android/`, `scripts/` vào `artifacts/backups/` và cập nhật `artifacts/backups/BACKUP_MANIFEST.json`.
2. **Bước 2 — Chuẩn hóa kết nối API & OCR trước khi đóng gói:**
   - Cập nhật `src/services/config.ts`, `translationService.ts`, `geminiAssistantProvider.ts` sử dụng `import.meta.env.VITE_API_BASE_URL` (mặc định nối với `/api/translation/translate` và `/api/assistant/chat`), hỗ trợ cấu hình URL máy chủ Cloud Run cho bản APK.
   - Bổ sung endpoint `/api/ocr/recognize` (sử dụng Gemini 2.5 Flash Vision trên `server.ts`) cho `ocrService.recognizeFromCanvas` để ảnh chụp từ Camera được nhận diện chữ Nga thật sự khi có mạng, chỉ dùng mẫu khi offline/test.
3. **Bước 3 — Tích hợp Capacitor vào dự án:**
   - Cài đặt `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` (và `@capacitor-community/text-to-speech` nếu cần phát âm Native Android).
   - Tạo `capacitor.config.ts` với:
     - `appId: 'com.xuongrong.russiaai'`
     - `appName: 'Russia AI Support'`
     - `webDir: 'dist'`
     - `server: { androidScheme: 'https' }`
4. **Bước 4 — Build Web Bundle & Đồng bộ sang Android (`npx cap sync android`):**
   - Chạy `npm run build` để xuất bản `dist/`.
   - Đồng bộ `dist/` vào `android/app/src/main/assets/public/` và cấu hình `BridgeActivity` của Capacitor (kèm các quyền `INTERNET`, `RECORD_AUDIO`, `CAMERA` trong `AndroidManifest.xml`).
5. **Bước 5 — Biên dịch APK thực sự bằng Android SDK & Gradle (`./gradlew assembleDebug` / `assembleRelease`):**
   - Sử dụng JDK 17 + Android SDK (`platforms;android-34`, `build-tools;34.0.0`).
   - Chạy `./gradlew assembleDebug` (hoặc `assembleRelease` kèm keystore signing) để biên dịch Kotlin -> `classes.dex`, đóng gói `resources.arsc`, biên dịch `AndroidManifest.xml` nhị phân, `zipalign` và ký số `apksigner` v1/v2.
   - Kiểm tra cấu trúc APK đầu ra bằng `unzip -l` / `apksigner verify` (phải có `classes.dex`, `resources.arsc`, `AndroidManifest.xml` nhị phân, chữ ký hợp lệ).
6. **Bước 6 — Kiểm thử cài đặt thực tế (`adb install`):**
   - Cài đặt file `app-debug.apk` / `russia-ai-support-v1.0.0.apk` lên thiết bị Android thật hoặc máy ảo (AVD) và nghiệm thu P12–P16.
