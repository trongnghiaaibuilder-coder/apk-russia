/**
 * Russia AI Support - Security & Privacy Service
 * Developer: Xương Rồng AI developer
 * Phase: P9 — SECURITY & PRIVACY
 */

export interface SecurityScanResult {
  passed: boolean;
  violations: Array<{
    type: string;
    description: string;
    fileOrSource?: string;
  }>;
}

export class SecurityService {
  // Regex patterns detecting potential leaked credentials or keys
  private readonly SENSITIVE_PATTERNS = [
    { type: 'GOOGLE_API_KEY', regex: /AIza[0-9A-Za-z-_]{35}/g },
    { type: 'OPENAI_KEY', regex: /sk-[a-zA-Z0-9]{32,}/g },
    { type: 'GENERIC_SECRET', regex: /(api_key|apikey|secret|password|token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/gi },
    { type: 'PRIVATE_KEY', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  ];

  /**
   * Scan content for embedded credentials
   */
  scanContent(content: string, sourceName?: string): SecurityScanResult {
    const violations: SecurityScanResult['violations'] = [];

    // Skip example placeholders
    if (content.includes('MY_GEMINI_API_KEY') || content.includes('MY_APP_URL')) {
      return { passed: true, violations: [] };
    }

    for (const pattern of this.SENSITIVE_PATTERNS) {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        // Filter out safe placeholder strings
        const realMatches = matches.filter(m => 
          !m.includes('MY_') && 
          !m.includes('YOUR_') && 
          !m.includes('example') &&
          !m.includes('placeholder')
        );

        if (realMatches.length > 0) {
          violations.push({
            type: pattern.type,
            description: `Phát hiện chuỗi nhạy cảm kiểu ${pattern.type}`,
            fileOrSource: sourceName
          });
        }
      }
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Redact sensitive information from text before logging or rendering
   */
  sanitizeText(text: string): string {
    if (!text) return '';
    let sanitized = text;

    for (const pattern of this.SENSITIVE_PATTERNS) {
      sanitized = sanitized.replace(pattern.regex, '[REDACTED_SECRET]');
    }

    return sanitized;
  }

  /**
   * Check whether storage key conforms to safe user preferences/history schema
   */
  isSafeStorageKey(key: string): boolean {
    const SAFE_PREFIXES = [
      'russia_ai_',
      'theme_',
      'language_',
      'test_'
    ];
    return SAFE_PREFIXES.some(prefix => key.startsWith(prefix));
  }
}

export const securityService = new SecurityService();
