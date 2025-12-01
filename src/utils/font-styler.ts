// src/utils/font-styler.ts

import { detectLanguage } from './language-processor';
import { TemplateData, FontConfig } from '../types/document';

const MARKERS = {
  START: '___LANG_START___',
  END: '___LANG_END___',
  SPECIAL_START: '___SPECIAL_START___',
  SPECIAL_END: '___SPECIAL_END___',
};

/**
 * Processes multi-line text to ensure consistent font styling across line breaks.
 * Splits text by newlines and wraps each segment with appropriate markers.
 * @param text The input text that may contain line breaks.
 * @param language The detected language for this text.
 * @param specialConfig Optional special font configuration.
 * @returns Processed text with proper font markers for each line.
 */
function processMultiLineText(text: string, language: string, specialConfig?: { fontName: string; fontSize: number }): string {
  // Split by newlines and process each line separately
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    if (line.trim() === '') {
      // Preserve empty lines without markers
      return '';
    }

    if (specialConfig) {
      // Wrap each non-empty line with special font markers
      return `${MARKERS.SPECIAL_START}${specialConfig.fontName}|${specialConfig.fontSize}|${line}${MARKERS.SPECIAL_END}`;
    } else {
      // Wrap each non-empty line with language markers
      return `${MARKERS.START}${language}|${line}${MARKERS.END}`;
    }
  });

  // Join back with newlines
  return processedLines.join('\n');
}

/**
 * Checks if a placeholder key requires special font styling.
 * @param key The placeholder key to check.
 * @returns The special font configuration if applicable, null otherwise.
 */
function getSpecialFontConfig(key: string): { fontName: string; fontSize: number } | null {
  const specialConfigs: { [key: string]: { fontName: string; fontSize: number } } = {
    'system_title_1': { fontName: 'B Titr', fontSize: 26 },
    'title_1': { fontName: 'B Titr', fontSize: 26 },
  };

  return specialConfigs[key] || null;
}

/**
 * Recursively wraps string values in the data object with language markers.
 * Handles multi-line text by ensuring each line gets proper font styling.
 * Also handles special placeholders with specific font requirements.
 * Example: "some text" becomes "___LANG_START___english|some text___LANG_END___"
 * Special example: system_title_1 becomes "___SPECIAL_START___B Titr|26|some text___SPECIAL_END___"
 * Multi-line example: "line1\nline2" becomes "___LANG_START___persian|line1___LANG_END___\n___LANG_START___persian|line2___LANG_END___"
 * @param data The data object to process.
 * @param currentKey The current key being processed (for special font handling).
 * @returns A new data object with wrapped strings.
 */
export function wrapDataWithLanguageMarkers(data: TemplateData, currentKey?: string): TemplateData | string {
  if (typeof data === 'string') {
    // Check if this is a special placeholder requiring specific font styling
    const specialConfig = currentKey ? getSpecialFontConfig(currentKey) : null;

    if (specialConfig) {
      // Handle special font styling
      if ((data as string).indexOf('\n') !== -1) {
        // Multi-line special text
        return processMultiLineText(data as string, '', specialConfig);
      } else {
        // Single line special text
        return `${MARKERS.SPECIAL_START}${specialConfig.fontName}|${specialConfig.fontSize}|${data}${MARKERS.SPECIAL_END}`;
      }
    } else {
      // Regular language detection and processing
      const language = detectLanguage(data);

      // Check if the text contains newlines
      if ((data as string).indexOf('\n') !== -1) {
        return processMultiLineText(data as string, language);
      }

      // Single line text - process normally
      return `${MARKERS.START}${language}|${data}${MARKERS.END}`;
    }
  }

  if (Array.isArray(data)) {
    return data.map(item => wrapDataWithLanguageMarkers(item, currentKey));
  }

  if (data && typeof data === 'object') {
    const newObj: TemplateData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key] = wrapDataWithLanguageMarkers(data[key], key);
      }
    }
    return newObj;
  }

  return data;
}

/**
 * Post-processes the generated XML to apply the correct fonts.
 * Enhanced to handle multi-line text with consistent font styling and special font configurations.
 * It finds the language markers and replaces them with the appropriate <w:rFonts> tags.
 * @param xmlContent The XML content from a file within the .docx zip.
 * @param fontConfig The font configuration.
 * @returns The modified XML content with fonts applied.
 */
export function applyFontStyles(xmlContent: string, fontConfig: FontConfig): string {
  const startRegex = new RegExp(MARKERS.START + '([a-z]+)\\|', 'g');
  const endRegex = new RegExp(MARKERS.END, 'g');
  const specialStartRegex = new RegExp(MARKERS.SPECIAL_START + '([^|]+)\\|([0-9]+)\\|', 'g');
  const specialEndRegex = new RegExp(MARKERS.SPECIAL_END, 'g');

  let result = xmlContent;

  // Handle special font styling first
  result = result.replace(specialStartRegex, (match, fontName, fontSize) => {
    // Special font styling with specific font name and size
    return `</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}" w:cs="${fontName}" w:eastAsia="${fontName}"/><w:sz w:val="${fontSize * 2}"/><w:szCs w:val="${fontSize * 2}"/></w:rPr><w:t xml:space="preserve">`;
  });

  // Close the special font styling run
  result = result.replace(specialEndRegex, '</w:t></w:r><w:r><w:rPr></w:rPr><w:t xml:space="preserve">');

  // Handle regular language-based font styling
  result = result.replace(startRegex, (match, language) => {
    const fontName = fontConfig[language as keyof FontConfig] || fontConfig.default;

    // Enhanced XML structure for better font consistency
    // Includes both complex script (w:cs) and high ANSI (w:hAnsi) for Persian support
    // And adds RTL support for right-to-left languages
    const isRtl = language === 'persian';
    const rtlAttribute = isRtl ? '<w:rtl/>' : '';

    return `</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}" w:cs="${fontName}" w:eastAsia="${fontName}"/>${rtlAttribute}</w:rPr><w:t xml:space="preserve">`;
  });

  // Close the regular font styling run and return to default
  result = result.replace(endRegex, '</w:t></w:r><w:r><w:rPr></w:rPr><w:t xml:space="preserve">');

  return result;
}
