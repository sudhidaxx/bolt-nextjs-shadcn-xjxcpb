import type { ValidationResult } from '@/types';

export const validateResponse = (category: string, questionIndex: number, response: string): ValidationResult => {
  const trimmedResponse = response.trim();
  
  if (!trimmedResponse) {
    return {
      isValid: false,
      strength: 'Weak',
      missingDetails: ['No response provided']
    };
  }

  const wordCount = trimmedResponse.split(/\s+/).length;
  const containsNumbers = /\d/.test(trimmedResponse);
  const containsDates = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(trimmedResponse);
  const containsNames = /[A-Z][a-z]+ [A-Z][a-z]+/.test(trimmedResponse);

  let strength: 'Weak' | 'Moderate' | 'Strong' = 'Weak';
  const missingDetails: string[] = [];

  // Basic validation based on question type
  if (questionIndex === 0 && !containsNames) {
    missingDetails.push('Full name required');
  }

  if (questionIndex === 1 && !containsDates) {
    missingDetails.push('Date required');
  }

  // Length-based validation
  if (wordCount < 3) {
    missingDetails.push('Response seems too brief');
  } else if (wordCount >= 3 && wordCount < 10) {
    strength = 'Moderate';
  } else {
    strength = 'Strong';
  }

  // Category-specific validation
  if (category === 'tax' && questionIndex > 2 && !containsNumbers) {
    missingDetails.push('Numerical details expected');
    strength = 'Moderate';
  }

  return {
    isValid: missingDetails.length === 0,
    strength,
    missingDetails: missingDetails.length > 0 ? missingDetails : ['Response looks good']
  };
}