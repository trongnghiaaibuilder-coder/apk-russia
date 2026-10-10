/**
 * Russia AI Support - Real-Life Support Service
 * Developer: Xương Rồng AI developer
 * Phase: P7 — REAL-LIFE RUSSIA SUPPORT
 */

import { 
  RealLifeScenario, 
  RealLifePhrase, 
  EmergencyContact, 
  RealLifeCategory 
} from '../types';
import { 
  REAL_LIFE_SCENARIOS, 
  EMERGENCY_CONTACTS 
} from '../data/scenariosData';
import { textToSpeechService } from '../../voice/services/textToSpeechService';
import { translationService } from '../../translator/services/translationService';

export class RealLifeService {
  getAllScenarios(): RealLifeScenario[] {
    return REAL_LIFE_SCENARIOS;
  }

  getScenarioById(id: string): RealLifeScenario | undefined {
    return REAL_LIFE_SCENARIOS.find(s => s.id === id);
  }

  getEmergencyContacts(): EmergencyContact[] {
    return EMERGENCY_CONTACTS;
  }

  getPhrasesByCategory(category: RealLifeCategory): RealLifePhrase[] {
    const sc = REAL_LIFE_SCENARIOS.find(s => s.category === category);
    return sc ? sc.phrases : [];
  }

  search(query: string): { 
    scenarios: RealLifeScenario[]; 
    phrases: RealLifePhrase[];
    contacts: EmergencyContact[];
  } {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return { 
        scenarios: REAL_LIFE_SCENARIOS, 
        phrases: [], 
        contacts: EMERGENCY_CONTACTS 
      };
    }

    const matchedScenarios = REAL_LIFE_SCENARIOS.filter(s => 
      s.titleVi.toLowerCase().includes(clean) ||
      s.titleRu.toLowerCase().includes(clean) ||
      s.descriptionVi.toLowerCase().includes(clean) ||
      s.category.toLowerCase().includes(clean) ||
      s.tipsVi.some(tip => tip.toLowerCase().includes(clean))
    );

    const allPhrases = REAL_LIFE_SCENARIOS.flatMap(s => s.phrases);
    const matchedPhrases = allPhrases.filter(p => 
      p.russian.toLowerCase().includes(clean) ||
      p.vietnamese.toLowerCase().includes(clean) ||
      p.pronunciation.toLowerCase().includes(clean)
    );

    const matchedContacts = EMERGENCY_CONTACTS.filter(c =>
      c.phone.includes(clean) ||
      c.nameVi.toLowerCase().includes(clean) ||
      c.nameRu.toLowerCase().includes(clean) ||
      c.descriptionVi.toLowerCase().includes(clean)
    );

    return {
      scenarios: matchedScenarios,
      phrases: matchedPhrases,
      contacts: matchedContacts
    };
  }

  async speakPhrase(phrase: RealLifePhrase): Promise<boolean> {
    if (!phrase || !phrase.russian) return false;
    return textToSpeechService.speak(phrase.russian, 'ru');
  }

  async translateCustom(text: string) {
    return translationService.translate({
      text,
      sourceLang: 'ru',
      targetLang: 'vi'
    });
  }
}

export const realLifeService = new RealLifeService();
