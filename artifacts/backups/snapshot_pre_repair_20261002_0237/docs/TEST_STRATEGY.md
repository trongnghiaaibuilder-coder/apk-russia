# TEST STRATEGY & QUALITY GATES — RUSSIA AI SUPPORT

**Application**: Russia AI Support  
**Developer**: Xương Rồng AI developer  

---

## 1. Testing Philosophy: "No Evidence = No Pass"
Every phase must execute automated unit, integration, and UI acceptance suites.
Statuses allowed:
- `PASS`: Tests executed, criteria fulfilled, evidence recorded.
- `FAIL`: Execution failed, regression detected, or threshold missed.
- `BLOCKED`: Physical device or external API unavailable (must NOT be faked as PASS).
- `NOT_TESTED`: Phase pending execution.

---

## 2. Test Execution Commands & Structure
The master test command executes all automated test suites:
```bash
npm run test:all
```
Comprising:
1. `npm run test:p1`: Application foundation, storage, error boundary, connectivity.
2. `npm run test:p2`: Alphabet (33 letters), vocabulary (112+), phrases (55+), lessons (16), quiz engine, progress.
3. `npm run test:p2-dictionary`: Russian 6 cases, declensions, conjugations, morphology index, search ranking.
4. `npm run test:p3`: Bidirectional translation, input validation, character limits, history lifecycle.
5. `npm run test:p4`: Speech recognition abstraction, TTS abstraction, 2-way conversation turns.
6. `npm run test:p5`: Camera & OCR client abstraction, image input handling, Cyrillic text extraction.
7. `npm run test:p6`: AI Assistant provider abstraction, local knowledge base (27 topics), context injection.
8. `npm run test:p7`: Real-life scenarios, emergency helplines (112, 103, 102, 101), embassy contacts.
9. `npm run test:p8`: Offline fallback, connectivity transitions, degradation handling.
10. `npm run test:p9`: Security audit, zero hardcoded secret scan, permission guards.
11. `npm run test:p10`: Full integration cross-feature flows.
12. `npm run test:p11`: Full regression suite and typechecking (`tsc --noEmit`).

---

## 3. Coverage Thresholds
- **Critical domain & application services**: Statements ≥ 90%, Lines ≥ 90%, Functions ≥ 90%, Branches ≥ 80%.
- **Overall codebase**: Statements ≥ 80%, Lines ≥ 80%, Functions ≥ 80%, Branches ≥ 75%.
- **Secret scanning**: 100% required pass rate.
