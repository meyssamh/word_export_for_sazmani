// src/utils/document-generator.ts

import * as fs from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { wrapDataWithLanguageMarkers, applyFontStyles } from './font-styler';
import { DocumentGeneratorConfig, TemplateData, FontConfig } from '../types/document';

export class DocumentGenerator {
  private config: DocumentGeneratorConfig;
  private fontConfig: FontConfig;

  constructor(config: DocumentGeneratorConfig) {
    this.config = config;
    this.fontConfig = {
      persian: 'B Nazanin',
      english: 'Times New Roman',
      default: 'Times New Roman',
    };
  }

  public setFonts(fonts: Partial<FontConfig>): void {
      this.fontConfig = { ...this.fontConfig, ...fonts };
  }

  /**
   * Generates the document.
   * @param data The data to be injected into the template.
   */
  public async generate(data: TemplateData): Promise<void> {
    try {
      console.log('Loading template...');
      const template = await fs.readFile(this.config.templatePath, 'binary');
      const zip = new PizZip(template);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      console.log('Wrapping data with language markers...');
      const wrappedData = wrapDataWithLanguageMarkers(data);

      console.log('Rendering document...');
      doc.render(wrappedData);

      console.log('Post-processing document to apply fonts...');
      const outputZip = doc.getZip();

      // Iterate over the files in the zip to apply fonts
      for (const fileName in outputZip.files) {
          if (fileName.endsWith('.xml')) {
              let xmlContent = outputZip.files[fileName].asText();
              xmlContent = applyFontStyles(xmlContent, this.fontConfig);
              outputZip.file(fileName, xmlContent);
          }
      }

      console.log('Generating final buffer...');
      const buffer = outputZip.generate({ type: 'nodebuffer' });

      console.log(`Saving document to ${this.config.outputPath}...`);
      await fs.writeFile(this.config.outputPath, buffer);

      console.log('Document generated successfully! 🎉');
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  }
}
