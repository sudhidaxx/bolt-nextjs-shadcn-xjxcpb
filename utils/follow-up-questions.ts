export const generateFollowUpQuestions = (category: string, responses: string[]): string[] => {
  const questions: string[] = [];

  // Generate follow-up questions based on category and previous responses
  switch (category) {
    case 'general':
      if (responses[3]?.toLowerCase().includes('accident')) {
        questions.push('Were there any witnesses to the accident?');
        questions.push('Have you obtained a police report?');
      }
      if (responses[4]?.toLowerCase().includes('document')) {
        questions.push('When did you receive these documents?');
        questions.push('Have you responded to any of these documents?');
      }
      break;

    case 'family':
      if (responses[2]?.toLowerCase().includes('children')) {
        questions.push('What are the current living arrangements for the children?');
        questions.push('Are there any special needs or medical conditions to consider?');
      }
      if (responses[3]?.toLowerCase().includes('property')) {
        questions.push('Are there any joint bank accounts or shared debts?');
        questions.push('Have you obtained valuations for any major assets?');
      }
      break;

    case 'tax':
      if (responses[2]?.toLowerCase().includes('ato')) {
        questions.push('What was the date of the last correspondence from the ATO?');
        questions.push('Have you retained copies of all relevant tax documents?');
      }
      if (responses[3]?.toLowerCase().includes('debt')) {
        questions.push('Have you previously entered into any payment arrangements?');
        questions.push('What is your current capacity to pay?');
      }
      break;
  }

  return questions;
}