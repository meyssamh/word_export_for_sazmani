import _ from 'lodash';
import { promises as fs } from 'fs';
import path from 'path';
import { convertToPersianDigits, isPurelyNumerical } from './language-processor';
import {
  DataTransformerOptions,
  Mapping,
  MappingFile,
  RawData,
  TransformedData,
  SystemType,
  SystemUser,
  SystemOwner,
  FillerName,
  LegalItem,
  AcquisitionMethod,
  SystemStatus,
  SubsystemStatus,
  DuplicateSystem,
  DataTableItem,
  UnsupportedDataItem,
  SystemInteractionItem,
  DesiredSystemRelation,
  SystemRelationIssue,
  UnauthorizedUser,
  Architecture,
  OperatingSystem,
  ProgrammingLanguage,
  Framework,
  ThirdPartyTool,
  Database,
  DbConstraints,
  Infrastructure,
  MonitoringTool,
  LoadBalancing,
  AuthenticationMethod,
  PkiImplementation,
  PkiUsage,
  Centralization,
  DevelopmentLimits,
  DevelopmentChallenges,
  CurrentHardwareItem,
  FutureHardwareItem,
  SupportMethod,
  SupportQuality,
  BackupMethod,
  BackupType,
  BackupSchedule,
  BackupStorage,
  BackupTesting,
  RetentionPolicy,
  DocumentStatus,
  IntellectualProperty,
  UserSatisfaction,
  QualityFrequency,
  PenetrationTest,
  Hardening,
  SecurityCertification,
  YesNoChoice,
  UsedFeatures,
  getDefaultValue,
} from '../types/dataTransformer.js';

/**
 * A class to transform raw JSON data into a format suitable for a template engine
 * like docxtemplater, based on a flexible mapping file.
 */

type ImpactFlags = {
  hasImpact: boolean;
  noImpact: boolean;
};
export default class DataTransformer {
  private mappingFilePath: string;
  private mappings: MappingFile | null = null;
  private isMappingLoaded: boolean = false;
  private outputPath: string;

  /**
   * Initializes the DataTransformer.
   * @param mappingFilePath - Absolute or relative path to the mapping JSON file.
   * @param options - Optional configuration object.
   */
  constructor(mappingFilePath: string, options: DataTransformerOptions = {}) {
    this.mappingFilePath = mappingFilePath;
    this.outputPath =
      options.outputPath ||
      path.join(
        path.dirname(this.mappingFilePath),
        '..',
        'transformed_data_output.json',
      );
  }

  /**
   * Loads the mapping configuration from the JSON file.
   * Caches the result to avoid redundant file reads.
   * @returns True if mappings were loaded successfully, false otherwise.
   */
  async loadMappings(): Promise<boolean> {
    if (this.isMappingLoaded) {
      return true; // Already loaded
    }
    if (this.mappings !== null) {
      this.isMappingLoaded = true; // Mappings were loaded previously in this instance lifecycle
      return true;
    }

    try {
      const content = await fs.readFile(this.mappingFilePath, 'utf8');
      const parsedMappings: MappingFile = JSON.parse(content);

      if (!parsedMappings || !Array.isArray(parsedMappings.mappings)) {
        console.error(
          'Invalid mapping file structure. Expected an object with a "mappings" array.',
        );
        this.mappings = { mappings: [] };
        this.isMappingLoaded = false;
        return false;
      }

      this.mappings = parsedMappings;
      this.isMappingLoaded = true;
      console.log(
        `Mapping file loaded successfully. Found ${this.mappings.mappings.length} mappings.`,
      );
      return true;
    } catch (error) {
      console.error(
        `Error loading or parsing mapping file at ${this.mappingFilePath}:`,
        error,
      );
      this.mappings = { mappings: [] };
      this.isMappingLoaded = false;
      return false;
    }
  }

  /**
   * Finds the JSON path corresponding to a given placeholder.
   * @param placeholder - The placeholder name from the template.
   * @returns The JSON path string or null if not found.
   */
  findJsonPath(placeholder: string): string | null {
    if (!this.mappings || !this.isMappingLoaded) {
      console.warn('Attempted to find JSON path before mappings were loaded.');
      return null;
    }

    const placeholderLowerTrimmed = placeholder.toLowerCase().trim();

    let mapping = this.mappings.mappings.find(
      (m: Mapping) => m.placeholder === placeholder,
    );

    if (!mapping) {
      mapping = this.mappings.mappings.find(
        (m: Mapping) => m.placeholder.toLowerCase().trim() === placeholderLowerTrimmed,
      );
    }

    return mapping ? mapping.jsonPath : null;
  }

  /**
   * Safely retrieves a value from the data object using a JSON path string.
   * @param data - The raw data object.
   * @param jsonPath - The JSON path (e.g., "formData.user.name").
   * @returns The value found at the path, or an empty string ('') if the path is invalid or not found.
   */
  getValueFromJsonPath(data: RawData, jsonPath: string | null): any {
    if (!jsonPath) {
      return '';
    }

    if (jsonPath.includes('[]')) {
      const idx = jsonPath.indexOf('[]');
      const basePath = jsonPath.substring(0, idx);
      const cleanBase = basePath.endsWith('.') ? basePath.slice(0, -1) : basePath;
      const restPath = jsonPath.substring(idx + 3); // skip [].
      const array = _.get(data, cleanBase, []);
      if (!Array.isArray(array)) return [];
      return array
        .map((item) => {
          if (restPath.includes('[]')) {
            return this.getValueFromJsonPath(item, restPath);
          } else if (restPath) {
            return _.get(item, restPath, '');
          } else {
            return item;
          }
        })
        .flat()
        .filter(Boolean);
    }

    return _.get(data, jsonPath, '');
  }

  /**
   * Formats a Date object into 'YYYY-MM-DD' string format.
   * @param date - The Date object or ISO string to format.
   * @returns The formatted date string, or "" if the input is invalid.
   */
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === 'year')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const day = parts.find((p) => p.type === 'day')?.value || '';
    return `${year}-${month}-${day}`;
  }

  /**
   * Converts a Gregorian date to Solar Hijri (Jalali) date.
   * @param date - The Date object or ISO string to convert.
   * @returns The formatted Solar Hijri date string in format 'YYYY/MM/DD' with Persian digits.
   */
  convertToSolarHijri(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === 'year')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const day = parts.find((p) => p.type === 'day')?.value || '';
    const dateString = `${year}/${month}/${day}`;
    // Convert to Persian digits
    return convertToPersianDigits(dateString);
  }

  /**
   * Processes a value and converts numerical data to Persian digits if appropriate.
   * @param value - The value to process.
   * @returns The processed value with Persian digits if applicable.
   */
  processValueToPersian(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Handle strings
    if (typeof value === 'string') {
      // If it's purely numerical (phone numbers, dates, etc.), convert to Persian digits
      if (isPurelyNumerical(value)) {
        return convertToPersianDigits(value);
      }
      return value;
    }

    // Handle numbers - convert to string with Persian digits
    if (typeof value === 'number') {
      return convertToPersianDigits(value.toString());
    }

    // Handle arrays recursively
    if (Array.isArray(value)) {
      return value.map(item => this.processValueToPersian(item));
    }

    // Handle objects recursively
    if (typeof value === 'object') {
      const processedObj: any = {};
      for (const [key, val] of Object.entries(value)) {
        processedObj[key] = this.processValueToPersian(val);
      }
      return processedObj;
    }

    return value;
  }

  /**
   * Transforms raw data into a key-value object suitable for docxtemplater.
   * @param rawData - The raw data object.
   * @param placeholders - An array of placeholder strings from the template.
   * @returns A promise that resolves to the transformed data object.
   */
  async transformDataForDocxtemplater(
    rawData: RawData,
    placeholders: string[],
  ): Promise<TransformedData> {
    const mappingsLoaded = await this.loadMappings();
    if (!mappingsLoaded) {
      console.error('Transformation failed: Mappings could not be loaded.');
      return {};
    }

    // Use all placeholders defined in the mapping file as ground truth
    const allPlaceholders = new Set<string>();
    if (this.mappings && Array.isArray(this.mappings.mappings)) {
      for (const mapping of this.mappings.mappings) {
        allPlaceholders.add(mapping.placeholder);
      }
    }

    const transformedResult: TransformedData = {};
    let filledCount = 0;
    const totalPlaceholders = allPlaceholders.size;

    console.log(
      `Starting transformation for ${totalPlaceholders} placeholders.`,
    );

    let isFieldChosen = (field: any, text: string) => {
      if (!field) return false;

      if (typeof field === 'string') {
        return field.startsWith(text);
      } else if (typeof field.option === 'string') {
        return field?.option.startsWith(text);
      } else {
        return false;
      }
    }

    const buildCountObject = (field: any, map: Record<string, string>) => {
      if (!field) return undefined;

      const result: any = {};
      for (const key in map) {
        result[key] = isFieldChosen(field, map[key]);
      }
      return result;
    };

    let fieldValueChecker = (field: any) => {
      console.log("field:", field);
      if (field === undefined) {
        return undefined;
      } else {
        return {
          no: isFieldChosen(field, 'No'),
          partially: isFieldChosen(field, 'Partially'),
          yes: isFieldChosen(field, 'Yes'),
        }
      }
    }

    for (const placeholder of allPlaceholders) {
      const originalPlaceholder = placeholder.trim();
      let retrievedValue: any = '';
      let finalValue: any = '';
      const jsonPath = this.findJsonPath(originalPlaceholder);
      if (jsonPath) {
        retrievedValue = this.getValueFromJsonPath(rawData, jsonPath);
      }

      // PROCESS
      // SECTION 1
      if (originalPlaceholder === 'title') {
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'title_1') {
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'owner') {
        finalValue = retrievedValue?.name || ' ';
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'unit') {
        finalValue = retrievedValue?.name || ' ';
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 2
      else if (originalPlaceholder === 'process_inputs') {
        let processInputs = retrievedValue || [];
        finalValue = processInputs.map((item: any) => item.input ?? ' ');
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'process_outputs') {
        let processOutputs = retrievedValue || [];
        finalValue = processOutputs.map((item: any) => item.output ?? ' ');
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'main_steps_of_the_process') {
        let mainStepsOfTheProcess = retrievedValue || [];
        finalValue = mainStepsOfTheProcess.map((item: any) => ({
          number: item?.number || ' ',
          description: item?.description || ' ',
          responsible: item?.responsible?.name || ' ',
          time: item?.time || ' ',
        }));
        if (finalValue.length === 0) {
          finalValue = [{
            number: ' ',
            description: ' ',
            responsible: ' ',
            time: ' ',
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'resources') {
        let resources = retrievedValue || [];
        finalValue = resources.map((item: any) => ({
          name: item?.name || ' ',
          description: item?.description || ' ',
        }));
        if (finalValue.length === 0) {
          finalValue = [{ name: ' ', description: ' ', }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'process_flow') {
        finalValue = [
          {
            'process_flow_no': retrievedValue === 'No' || retrievedValue?.option === 'No',
            'process_flow_yes': retrievedValue === 'Yes' || retrievedValue?.option === 'Yes',
          }
        ];
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 3
      else if (originalPlaceholder === 'key_performance_indicators') {
        let keyPerformanceIndicators = retrievedValue || [];
        finalValue = keyPerformanceIndicators.map((item: any) => ({
          'index_name': item?.['index-name'] || ' ',
          'calculation_formula': item?.['calculation-formula'] || ' ',
          'target_value': item?.['target-value'] || ' ',
        }));
        if (finalValue.length === 0) {
          finalValue = [{
            'index_name': ' ',
            'calculation_formula': ' ',
            'target_value': ' ',
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'possible_risks') {
        let possibleRisks = retrievedValue || [];
        finalValue = possibleRisks.map((item: any) => {
          const probRaw = item?.['probability-of-occurrence'];
          const impRaw = item?.['risk-impact'];
          const prob = typeof probRaw === 'string' ? probRaw : probRaw?.option;
          const imp = typeof impRaw === 'string' ? impRaw : impRaw?.option;

          const probability_of_occurrence = {
            probability_of_occurrence_low: false,
            probability_of_occurrence_medium: false,
            probability_of_occurrence_high: false,
          }

          const risk_impact = {
            risk_impact_low: false,
            risk_impact_medium: false,
            risk_impact_high: false,
          }

          if (prob === 'low') {
            probability_of_occurrence.probability_of_occurrence_low = true;
          } else if (prob === 'medium') {
            probability_of_occurrence.probability_of_occurrence_medium = true;
          } else if (prob === 'high') {
            probability_of_occurrence.probability_of_occurrence_high = true;
          } else {
            null;
          }

          if (imp === 'low') {
            risk_impact.risk_impact_low = true;
          } else if (imp === 'medium') {
            risk_impact.risk_impact_medium = true;
          } else if (imp === 'high') {
            risk_impact.risk_impact_high = true;
          } else {
            null;
          }

          return {
            'risk_name': item?.['risk-name'] || ' ',
            'probability_of_occurrence': probability_of_occurrence,
            'risk_impact': risk_impact,
            'control_measures': item?.['control-measures'] || ' ',
          };
        });

        if (finalValue.length === 0) {
          finalValue = [{
            'risk_name': ' ',
            'probability_of_occurrence': ' ',
            'risk_impact': ' ',
            'control_measures': ' ',
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'related_documents_and_forms') {
        let relatedDocumentsAndForms = retrievedValue || [];
        finalValue = relatedDocumentsAndForms.map((item: any) => ({
          document_and_form_name: item?.['document/form-name'],
          document_and_form_code: item?.['document/form-code'],
          link_or_attachment: {
            link_or_attachment_no: item?.['link-or-attachment'] === "No" || item?.['link-or-attachment'].option === "No",
            link_or_attachment_yes: item?.['link-or-attachment'] === "Yes" || item?.['link-or-attachment'].option === "Yes",
          }
        }));
        if (finalValue.length === 0) {
          finalValue = [{
            document_and_form_name: ' ',
            document_and_form_code: ' ',
            link_or_attachment: {}
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'process_maturity_level') {
        finalValue = [{
          process_maturity_level_identified: retrievedValue === 'The process has been identified, but its documentation (process profile) has not yet been developed.' || retrievedValue.option === 'The process has been identified, but its documentation (process profile) has not yet been developed.',
          process_maturity_level_developed: retrievedValue === 'The process documentation (process profile) has been developed.' || retrievedValue.option === 'The process documentation (process profile) has been developed.',
          process_maturity_level_recognized: retrievedValue === 'In addition to developing the process documentation, the process model has been created using recognized notations such as BPMN2.' || retrievedValue.option === 'In addition to developing the process documentation, the process model has been created using recognized notations such as BPMN2.',
          process_maturity_level_monitored: retrievedValue === 'Process performance indicators have been defined, and the process is continuously monitored based on these indicators.' || retrievedValue.option === 'Process performance indicators have been defined, and the process is continuously monitored based on these indicators.',
          process_maturity_level_mechanism: retrievedValue === 'A process improvement mechanism has been designed and is being implemented.' || retrievedValue.option === 'A process improvement mechanism has been designed and is being implemented.',
        }];

        if (!retrievedValue || finalValue.length === 0) {
          finalValue = [{
            process_maturity_level_identified: true,
            process_maturity_level_developed: false,
            process_maturity_level_recognized: false,
            process_maturity_level_monitored: false,
            process_maturity_level_mechanism: false,
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      }

      // FALLBACK
      else if (originalPlaceholder.toLowerCase().endsWith('_description')) {
        console.log(`[DEBUG] Description placeholder: ${originalPlaceholder}`);
        console.log(`[DEBUG] JSON Path: ${jsonPath}`);
        const value = jsonPath ? this.getValueFromJsonPath(rawData, jsonPath) : null;
        console.log(`[DEBUG] Retrieved value:`, value);
        console.log(`[DEBUG] Value type:`, typeof value);
        transformedResult[originalPlaceholder] = jsonPath ? this.getValueFromJsonPath(rawData, jsonPath) || '' : '';
      } else if (originalPlaceholder.endsWith('_used_features')) {
        // Handle *_used_features fields - they should default to empty arrays
        console.log(`[DEBUG] Used features placeholder: ${originalPlaceholder}`);
        console.log(`[DEBUG] JSON Path: ${jsonPath}`);
        const value = jsonPath ? this.getValueFromJsonPath(rawData, jsonPath) : null;
        console.log(`[DEBUG] Retrieved value:`, value);
        console.log(`[DEBUG] Value type:`, typeof value);

        if (!value || (Array.isArray(value) && value.length === 0)) {
          transformedResult[originalPlaceholder] = [];
        } else if (Array.isArray(value)) {
          transformedResult[originalPlaceholder] = value;
        } else {
          // Convert single value to array if it's not already an array
          transformedResult[originalPlaceholder] = [value];
        }
      } else {
        console.log(`[DEBUG] Generic placeholder: ${originalPlaceholder}`);
        console.log(`[DEBUG] JSON Path: ${jsonPath}`);
        if (jsonPath) {
          const value = this.getValueFromJsonPath(rawData, jsonPath);
          console.log(`[DEBUG] Retrieved value:`, value);
          console.log(`[DEBUG] Value type:`, typeof value);
          // Apply Persian digit conversion to generic values
          transformedResult[originalPlaceholder] = this.processValueToPersian(value);
        } else {
          console.log(`[DEBUG] No JSON path found for placeholder: ${originalPlaceholder}`);
        }
      }

      // Apply Persian digit conversion to description fields as well
      if (Object.prototype.hasOwnProperty.call(transformedResult, originalPlaceholder)) {
        if (originalPlaceholder.toLowerCase().endsWith('_description')) {
          transformedResult[originalPlaceholder] = this.processValueToPersian(transformedResult[originalPlaceholder]);
        }
        filledCount++;
      }
    }

    console.log(
      `Transformation complete. Successfully mapped ${filledCount} of ${totalPlaceholders} placeholders.`,
    );

    try {
      const outputDir = path.dirname(this.outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      const mappedPlaceholders = new Set(this.mappings?.mappings.map((m: Mapping) => m.placeholder) || []);
      const filteredResult: TransformedData = {};

      for (const key in transformedResult) {
        if (mappedPlaceholders.has(key)) {
          filteredResult[key] = transformedResult[key];
        }
      }

      const sortedResult = Object.keys(filteredResult)
        .sort()
        .reduce((acc: TransformedData, key: string) => {
          acc[key] = filteredResult[key];
          return acc;
        }, {} as TransformedData);

      const dataToWrite = JSON.stringify(sortedResult, null, 2);
      await fs.writeFile(this.outputPath, dataToWrite, 'utf8');
      console.log(`Write completed successfully to ${this.outputPath}`);
    } catch (error: any) {
      console.error('File write error details:');
      console.error('- Path:', this.outputPath);
      console.error('- Error:', error.message);
      console.error('- Stack:', error.stack);
    }

    return transformedResult;
  }
}
