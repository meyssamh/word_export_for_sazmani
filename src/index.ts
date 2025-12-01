// Main module exports for word-export-module
// This module provides functionality for generating Word documents from JSON data

import { DocumentGenerator } from './utils/document-generator';
import DataTransformer from './utils/dataTransformer';
import { DocumentGeneratorConfig, FontConfig } from './types/document';
import * as fs from 'fs/promises';
import * as path from 'path';
import JSZip from 'jszip';

export { DocumentGenerator } from './utils/document-generator';
export { default as DataTransformer } from './utils/dataTransformer';
export { wrapDataWithLanguageMarkers, applyFontStyles } from './utils/font-styler';
export { convertToPersianDigits, isPurelyNumerical } from './utils/language-processor';

// Export types for TypeScript users
export * from './types/document';
export * from './types/dataTransformer';

// Main convenience class that combines all functionality
export class WordExportModule {
  private transformer: DataTransformer;
  private generator: DocumentGenerator;

  constructor(options: {
    templatePath: string;
    mappingPath: string;
    outputPath: string;
    transformerOutputPath?: string;
  }) {
    this.transformer = new DataTransformer(options.mappingPath, {
      outputPath: options.transformerOutputPath || options.outputPath.replace('.docx', '_transformed.json')
    });

    // this.transformer = new DataTransformer(options.mappingPath);
    
    this.generator = new DocumentGenerator({
      templatePath: options.templatePath,
      outputPath: options.outputPath
    });
  }

  /**
   * Set custom fonts for Persian and English text
   */
  setFonts(fonts: { persian?: string; english?: string; default?: string }) {
    this.generator.setFonts(fonts);
  }

  /**
   * Transform raw JSON data and generate Word document in one call
   */
  async generateDocument(rawData: any): Promise<void> {
    console.log('Starting data transformation...');
    const transformedData = await this.transformer.transformDataForDocxtemplater(rawData, []);
    console.log('Data transformation complete.');

    console.log('Generating Word document...');
    await this.generator.generate(transformedData);
    console.log('Document generation complete.');
  }

  /**
   * Transform data only (without generating document)
   */
  async transformData(rawData: any): Promise<any> {
    return await this.transformer.transformDataForDocxtemplater(rawData, []);
  }

  /**
   * Generate document from already transformed data
   */
  async generateFromTransformedData(transformedData: any): Promise<void> {
    await this.generator.generate(transformedData);
  }

  /**
   * Export a single JSON file to Word document
   * The output filename will be based on system_title from the data
   */
  async exportSingle(jsonData: any, outputDir?: string): Promise<string> {
    // Transform the data first to get system_title
    const transformedData = await this.transformer.transformDataForDocxtemplater(jsonData, []);
    
    // Extract system_title for filename
    const systemTitle = transformedData.system_title || transformedData.system_title_1 || 'document';
    const sanitizedTitle = this.sanitizeFilename(systemTitle);
    const filename = `${sanitizedTitle}.docx`;
    
    // Determine output directory
    const finalOutputDir = outputDir || path.dirname(this.generator['config'].outputPath);
    await fs.mkdir(finalOutputDir, { recursive: true });
    
    // Set the output path with the system title filename
    const outputPath = path.join(finalOutputDir, filename);
    
    // Create a new generator instance with the correct output path
    const generator = new DocumentGenerator({
      templatePath: this.generator['config'].templatePath,
      outputPath
    });
    
    // Copy font settings
    generator.setFonts(this.generator['fontConfig']);
    
    // Generate the document
    await generator.generate(transformedData);
    
    console.log(`Document exported: ${outputPath}`);
    return outputPath;
  }

  /**
   * Export multiple JSON objects to Word documents and create a ZIP file
   * Each document will be named based on its system_title
   */
  async exportBatch(jsonDataArray: any[], outputDir?: string, zipFilename?: string): Promise<string> {
    if (!Array.isArray(jsonDataArray) || jsonDataArray.length === 0) {
      throw new Error('jsonDataArray must be a non-empty array');
    }

    // Determine output directory
    const finalOutputDir = outputDir || path.dirname(this.generator['config'].outputPath);
    await fs.mkdir(finalOutputDir, { recursive: true });
    
    // Create temporary directory for individual documents
    const tempDir = path.join(finalOutputDir, `temp_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    const generatedFiles: string[] = [];
    
    try {
      // Generate individual documents
      for (let i = 0; i < jsonDataArray.length; i++) {
        const jsonData = jsonDataArray[i];
        console.log(`Processing document ${i + 1}/${jsonDataArray.length}...`);
        
        // Transform the data to get system_title
        const transformedData = await this.transformer.transformDataForDocxtemplater(jsonData, []);
        
        // Extract system_title for filename
        const systemTitle = transformedData.system_title || transformedData.system_title_1 || `document_${i + 1}`;
        const sanitizedTitle = this.sanitizeFilename(systemTitle);
        const filename = `${sanitizedTitle}.docx`;
        const outputPath = path.join(tempDir, filename);
        
        // Create generator for this document
        const generator = new DocumentGenerator({
          templatePath: this.generator['config'].templatePath,
          outputPath
        });
        
        // Copy font settings
        generator.setFonts(this.generator['fontConfig']);
        
        // Generate the document
        await generator.generate(transformedData);
        generatedFiles.push(outputPath);
        
        console.log(`Generated: ${filename}`);
      }
      
      // Create ZIP file
      const zip = new JSZip();
      
      for (const filePath of generatedFiles) {
        const filename = path.basename(filePath);
        const fileBuffer = await fs.readFile(filePath);
        zip.file(filename, fileBuffer);
      }
      
      // Generate ZIP
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      
      // Determine ZIP filename
      const finalZipFilename = zipFilename || `batch_export_${new Date().toISOString().split('T')[0]}.zip`;
      const zipPath = path.join(finalOutputDir, finalZipFilename);
      
      // Write ZIP file
      await fs.writeFile(zipPath, zipBuffer);
      
      console.log(`Batch export complete: ${zipPath}`);
      console.log(`Generated ${generatedFiles.length} documents in ZIP file`);
      
      return zipPath;
      
    } finally {
      // Clean up temporary directory
      try {
        for (const filePath of generatedFiles) {
          await fs.unlink(filePath);
        }
        await fs.rmdir(tempDir);
      } catch (error) {
        console.warn('Failed to clean up temporary files:', error);
      }
    }
  }

  /**
   * Sanitize filename by removing/replacing invalid characters
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters with underscore
      .replace(/\s+/g, '_') // Replace spaces with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .substring(0, 100) // Limit length
      || 'document'; // Fallback if empty
  }
}
