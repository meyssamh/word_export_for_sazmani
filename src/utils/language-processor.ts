// src/utils/language-processor.ts

import { NormalizationOptions } from '../types/document';

// Using a simplified language detection for this example.
// In a real-world scenario, you would use a more robust library.
const PERSIAN_REGEX = /[\u0600-\u06FF]/;

/**
 * Detects if the text is predominantly Persian.
 * @param text The input string.
 * @returns 'persian' or 'english'.
 */
export function detectLanguage(text: string): 'persian' | 'english' {
  if (typeof text !== 'string' || text.trim() === '') {
    return 'english'; // Default to English for empty or non-string content
  }
  const persianChars = (text.match(new RegExp(PERSIAN_REGEX.source, 'g')) || []).length;
  const totalChars = text.replace(/\s/g, '').length;

  if (totalChars === 0) {
    return 'english';
  }

  // If more than 30% of characters are Persian, classify as Persian.
  return (persianChars / totalChars) > 0.3 ? 'persian' : 'english';
}

/**
 * Converts English/Latin digits (0-9) to Persian digits (۰-۹).
 * @param text The input string containing digits.
 * @returns The string with Persian digits.
 */
export function convertToPersianDigits(text: string): string {
  if (typeof text !== 'string') {
    return text;
  }
  
  const englishToPersian: { [key: string]: string } = {
    '0': '۰',
    '1': '۱', 
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹'
  };
  
  return text.replace(/[0-9]/g, (digit) => englishToPersian[digit] || digit);
}

/**
 * Checks if a string contains only digits, spaces, dashes, slashes, and basic punctuation.
 * This is used to identify purely numerical data like phone numbers, dates, etc.
 * @param text The input string to check.
 * @returns True if the string is purely numerical/date format.
 */
export function isPurelyNumerical(text: string): boolean {
  if (typeof text !== 'string' || text.trim() === '') {
    return false;
  }
  
  // Allow digits, spaces, dashes, slashes, colons, dots, parentheses, plus signs
  // This covers phone numbers, dates, times, etc.
  const numericalPattern = /^[0-9\s\-\/\:\.\(\)\+]+$/;
  return numericalPattern.test(text.trim());
}

/**
 * A placeholder for text normalization logic.
 * In a real application, this would convert numbers, punctuation, etc.
 * @param text The input string.
 * @param options Normalization options.
 * @returns The normalized text.
 */
export function normalizeText(text: string, options: NormalizationOptions): string {
    // This is a placeholder. The actual implementation would be complex.
    // For demonstration, we'll just return the text.
    console.log(`Normalizing text with options:`, options);
    return text;
}
