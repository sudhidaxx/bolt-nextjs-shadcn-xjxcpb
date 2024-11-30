export interface LegalMatter {
  scenarios: string[];
  vocabulary: string[];
}

export interface ValidationResult {
  isValid: boolean;
  strength: 'Weak' | 'Moderate' | 'Strong';
  missingDetails: string[];
}

export interface InterviewData {
  id: string;
  partyName: string;
  category: string;
  responses: string[];
  followUpQuestions: string[];
}