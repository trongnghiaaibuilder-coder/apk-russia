/**
 * Russia AI Support - Real-Life Russia Support Types
 * Developer: Xương Rồng AI developer
 * Phase: P7 — REAL-LIFE RUSSIA SUPPORT
 */

export type RealLifeCategory = 
  | 'emergency'
  | 'transportation'
  | 'food'
  | 'shopping'
  | 'accommodation'
  | 'directions'
  | 'administrative'
  | 'medical'
  | 'communication';

export interface EmergencyContact {
  id: string;
  nameVi: string;
  nameRu: string;
  phone: string;
  descriptionVi: string;
  isNationalEmergency?: boolean;
}

export interface RealLifePhrase {
  id: string;
  category: RealLifeCategory;
  russian: string;
  vietnamese: string;
  pronunciation: string;
  context?: string;
  importance: 'critical' | 'high' | 'normal';
}

export interface RealLifeScenario {
  id: string;
  titleVi: string;
  titleRu: string;
  category: RealLifeCategory;
  categoryLabelVi: string;
  descriptionVi: string;
  iconName: string;
  phrases: RealLifePhrase[];
  tipsVi: string[];
}
