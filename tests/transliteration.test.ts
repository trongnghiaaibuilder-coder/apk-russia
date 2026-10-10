/**
 * Tests cho transliterationService — phiên âm tiếng Nga cho người Việt.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transliterateRussian, containsCyrillic, transliterateLines } from '../src/services/transliterationService.ts';

describe('Transliteration Service — Vietsub tiếng Nga', () => {
  it('phiên âm câu chào cơ bản', () => {
    assert.equal(transliterateRussian('Привет'), 'Privyet');
  });

  it('phiên âm cảm ơn', () => {
    assert.equal(transliterateRussian('Спасибо'), 'Spasibo');
  });

  it('dùng đ cho chữ д thân thiện với người Việt', () => {
    assert.equal(transliterateRussian('Добрый день'), 'Đobryy đyen');
  });

  it('phiên âm х thành kh, ш thành sh', () => {
    assert.equal(transliterateRussian('Хорошо'), 'Khorosho');
  });

  it('phiên âm ж thành zh, ч thành ch', () => {
    assert.equal(transliterateRussian('Пожалуйста'), 'Pozhaluysta');
  });

  it('giữ nguyên số, dấu câu và chữ Latin', () => {
    assert.equal(transliterateRussian('Привет! 123 OK'), 'Privyet! 123 OK');
  });

  it('chuỗi rỗng trả về rỗng', () => {
    assert.equal(transliterateRussian(''), '');
  });

  it('containsCyrillic phát hiện chữ Nga', () => {
    assert.equal(containsCyrillic('Привет'), true);
    assert.equal(containsCyrillic('Hello'), false);
    assert.equal(containsCyrillic(''), false);
  });

  it('transliterateLines xử lý nhiều dòng', () => {
    assert.deepEqual(transliterateLines(['Привет', 'Спасибо']), ['Privyet', 'Spasibo']);
  });

  it('bỏ dấu mềm ь và dấu cứng ъ', () => {
    assert.equal(transliterateRussian('день'), 'đyen');
  });
});
