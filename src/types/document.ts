// src/types.ts

/**
 * Configuration for the DocumentGenerator.
 */
export interface DocumentGeneratorConfig {
  templatePath: string;
  outputPath: string;
}

/**
 * Configuration for font styling.
 */
export interface FontConfig {
  persian: string;
  english: string;
  default: string;
  systemTitleFirst?: string;
}

/**
 * Options for text normalization.
 */
export interface NormalizationOptions {
  convertNumbers: boolean;
  convertPunctuation: boolean;
  convertBrackets: boolean;
  preserveEnglishInMixed: boolean;
}

/**
 * Represents any data object to be inserted into the template.
 */
export type TemplateData = Record<string, any>;

