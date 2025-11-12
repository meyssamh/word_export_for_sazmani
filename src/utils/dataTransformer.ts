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

    for (const placeholder of allPlaceholders) {
      const originalPlaceholder = placeholder.trim();
      let retrievedValue: any = '';
      let finalValue: any = '';
      const jsonPath = this.findJsonPath(originalPlaceholder);
      if (jsonPath) {
        retrievedValue = this.getValueFromJsonPath(rawData, jsonPath);
      }

      // SECTION 1
      if (originalPlaceholder === 'system_title') {
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'system_title_1') {
        // Copy the same data as system_title for system_title_1
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'systemUrls') {
        let urls = retrievedValue || [];
        if (!Array.isArray(urls)) urls = [urls];
        transformedResult[originalPlaceholder] = urls
          .map((item: any) => (item && typeof item === 'object' ? item.url || '' : item))
          .filter(Boolean);
      } else if (originalPlaceholder === 'system_type') {
        finalValue = [
          {
            specialized: retrievedValue === 'Specialized',
            'non-specialized': retrievedValue === 'non-specialized',
            'out-of-scope': retrievedValue === 'out-of-scope',
          },
        ] as SystemType;
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'system_user') {
        if (Array.isArray(retrievedValue)) {
          finalValue = retrievedValue.map((item: any) => ({ name: item.name?.name || '' })) as SystemUser[];
        } else {
          finalValue = [];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'system_owner') {
        let owners = retrievedValue || [];
        finalValue = owners.map((item: any) => ({
          name: item?.name || ' ',
          department: item?.department?.name || ' ',
          mobile: this.processValueToPersian(item?.mobile || ' '),
        })) as SystemOwner[];
        if (finalValue.length === 0) {
          finalValue = [{ name: ' ', department: ' ', mobile: ' ' }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'filler_name') {
        if (retrievedValue && typeof retrievedValue === 'object') {
          const { firstname = '', lastname = '' }: FillerName = retrievedValue;
          transformedResult[originalPlaceholder] = `${firstname} ${lastname}`.trim();
        } else {
          transformedResult[originalPlaceholder] = '';
        }
      }

      // SECTION 2
      else if (originalPlaceholder === 'systemMission') {
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'mainFunctions') {
        transformedResult[originalPlaceholder] = (retrievedValue && Array.isArray(retrievedValue) && retrievedValue.length > 0) ? retrievedValue : [];
      } else if (originalPlaceholder === 'supported_services' || originalPlaceholder === 'unsupported_services') {
        let services = retrievedValue || [];
        if (!Array.isArray(services)) services = [services];
        finalValue = services
          .map((service: any) => typeof service === 'string' ? service : service?.serviceId?.title || service?.title || '')
          .filter(Boolean);
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'legals_table') {
        let legals = retrievedValue || [];
        if (!Array.isArray(legals)) legals = [legals];
        finalValue = legals.map((item: any) => ({
          legal_material: item?.lawDetails?.title || '',
          legal_description: item?.description || '',
        })) as LegalItem[];
        if (finalValue.length === 0) {
          finalValue = [{ legal_material: ' ', legal_description: ' ' }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'acquisition_method') {
        const value = retrievedValue;
        finalValue = [
          {
            internal_development: value === 'internal_development',
            package_purchase: value === 'package_purchase',
            outsourced_development: value === 'outsourced_development',
            hybrid_purchase: value === 'hybrid_purchase',
            other: value === 'other',
          },
        ] as AcquisitionMethod;
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'contractorInfo') {
        transformedResult[originalPlaceholder] = retrievedValue;
      } else if (originalPlaceholder === 'current_status') {
        const keys: (keyof SystemStatus[0])[] = ['work_referral', 'analysis', 'design', 'implementation', 'deployment', 'operational', 'maintenance', 'future_development', 'retired'];
        const rv = retrievedValue && typeof retrievedValue === 'object' ? retrievedValue : {};
        const statusObj: Partial<SystemStatus[0]> = {};
        keys.forEach(key => {
          statusObj[key] = !!rv[key];
        });
        transformedResult[originalPlaceholder] = [statusObj] as SystemStatus;
      } else if (originalPlaceholder === 'system_start_date') {
        transformedResult[originalPlaceholder] = this.convertToSolarHijri(retrievedValue);
      } else if (originalPlaceholder === 'subsystem') {
        finalValue = {
          is_subsystem: retrievedValue === 'is_subsystem',
          has_subsystems: retrievedValue === 'has_subsystems',
          no: retrievedValue === 'no',
        } as SubsystemStatus;
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'duplicate_systems') {
        let dupArr = retrievedValue || [];
        if (!Array.isArray(dupArr)) dupArr = [dupArr];
        const sysTitlePath = this.findJsonPath('system_title');

        const dsValue: DuplicateSystem[] = dupArr.map((item: any) => {
          const duplicate_system = this.getValueFromJsonPath(item.systemName || {}, sysTitlePath) || '';
          const duplicate_functions = Array.isArray(item.duplicateFunctions)
            ? item.duplicateFunctions.map((f: any) => f.name || '').filter(Boolean).join(', ')
            : '';
          const duplicateSystems_reason = item.reason || '';
          return { duplicate_system, duplicate_functions, duplicateSystems_reason };
        });

        if (dsValue.length === 0) {
          dsValue.push({ duplicate_system: ' ', duplicate_functions: ' ', duplicateSystems_reason: ' ' });
        }
        transformedResult[originalPlaceholder] = dsValue;
      }

      // SECTION 3
      else if (originalPlaceholder === 'data_table') {
        if (Array.isArray(retrievedValue) && retrievedValue.length > 0) {
          finalValue = retrievedValue.map((item: any) => ({
            data_name: item.dataName?.title || ' ',
            system_role: [{
              data_steward: !!item.systemRole?.data_steward,
              data_entry_point: !!item.systemRole?.data_entry_point,
              data_producer: !!item.systemRole?.data_producer,
            }],
            data_source: [{
              user_input: !!item.dataSource?.user_input,
              operations: !!item.dataSource?.operations,
              internal_system: !!item.dataSource?.internal_system,
              external_org: !!item.dataSource?.external_org,
              import: !!item.dataSource?.import,
              hardware: !!item.dataSource?.hardware,
            }],
            description: item.description || ' ',
          })) as DataTableItem[];
        } else {
          finalValue = [{
            data_name: ' ',
            system_role: [{ data_steward: false, data_entry_point: false, data_producer: false }],
            data_source: [{ user_input: false, operations: false, internal_system: false, external_org: false, import: false, hardware: false }],
            description: ' ',
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'unsupportedData_table') {
        if (Array.isArray(retrievedValue) && retrievedValue.length > 0) {
          finalValue = retrievedValue.map((row: any) => ({
            unsupportedData: row.dataName?.title || ' ',
            description: row.description || ' ',
          })) as UnsupportedDataItem[];
        } else {
          finalValue = [{ unsupportedData: ' ', description: ' ' }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 4
      else if (originalPlaceholder === 'systemInteraction_table') {
        const arr = retrievedValue || [];
        finalValue = arr.map((row: any): SystemInteractionItem => {
          const systemName = Array.isArray(row.systemNames) ? row.systemNames.map((s: any) => s.formData?.system_title || s.name || '') : [];
          const exchangeData = Array.isArray(row.exchangedData) ? row.exchangedData.map((d: any) => d.formData?.title || d.title || '') : [];
          const exType = typeof row.exchangeType === 'string' ? row.exchangeType : '';
          const exchangeType = [{ send: exType === 'send', receive: exType === 'receive' }];
          const method = row.exchangeMethod && typeof row.exchangeMethod === 'object' ? row.exchangeMethod : {};
          const exchangeMethod = [{ api: !!method.api, mech_file: !!method.mech_file, manual_file: !!method.manual_file, db_connection: !!method.db_connection }];
          const serviceParameters = Array.isArray(row.serviceParameters) ? row.serviceParameters.map((sp: any) => sp.formData?.title || sp.title || sp.name || '') : [];
          return { systemName, exchangeData, exchangeType, exchangeMethod, serviceParameters, exchangeReason: row.exchangeReason || '' };
        });

        if (finalValue.length === 0) {
          finalValue = [{
            systemName: [], exchangeData: [],
            exchangeType: [{ send: false, receive: false }],
            exchangeMethod: [{ api: false, mech_file: false, manual_file: false, db_connection: false }],
            serviceParameters: [], exchangeReason: ' ',
          }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'desiredSystemRelations_table') {
        const arr = retrievedValue || [];
        finalValue = arr.map((row: any): DesiredSystemRelation => {
          let desired_systemName = '';
          if (row.systemName && typeof row.systemName === 'object') {
            desired_systemName = row.systemName.formData?.system_title || row.systemName.name || '';
          } else if (typeof row.systemName === 'string') {
            desired_systemName = row.systemName;
          }
          let desired_exchangeData = '';
          if (Array.isArray(row.exchangedData)) {
            desired_exchangeData = row.exchangedData.map((d: any) => d.formData?.title || d.title || d).join(', ');
          } else if (row.exchangedData && typeof row.exchangedData === 'object') {
            desired_exchangeData = row.exchangedData.formData?.title || row.exchangedData.title || '';
          } else if (typeof row.exchangedData === 'string') {
            desired_exchangeData = row.exchangedData;
          }
          return { desired_systemName, desired_exchangeData };
        });
        if (finalValue.length === 0) {
          finalValue = [{ desired_systemName: ' ', desired_exchangeData: ' ' }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'systemRelationIssues_table') {
        const arr = retrievedValue;
        if (Array.isArray(arr) && arr.length > 0) {
          finalValue = arr as SystemRelationIssue[];
        } else {
          finalValue = [{ system: ' ', issue: ' ', solution: ' ' }];
        }
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 5
      else if (originalPlaceholder === 'unauthorizedUsers_table') {
        const arr = retrievedValue || [];
        finalValue = arr.map((item: any) => ({
          user: item.userGroup || ' ',
          reason: item.reason || ' ',
        })) as UnauthorizedUser[];
        if (finalValue.length === 0) {
          finalValue.push({ user: ' ', reason: ' ' });
        }
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 6
      else if (originalPlaceholder === 'architecture') {
        const value = retrievedValue;
        finalValue = [{
          service_oriented: value === 'service_oriented', serverless: value === 'serverless',
          single_tier: value === 'single_tier', multi_tier: value === 'multi_tier',
          microservices: value === 'microservices', other: value === 'other'
        }] as Architecture;
        transformedResult[originalPlaceholder] = finalValue;
      } else if (['operating_system', 'programming_languages', 'frameworks', 'database', 'infrastructure', 'monitoring_tools', 'authentication_methods', 'backup_method', 'backup_type', 'backup_schedule', 'backup_storage', 'backup_testing', 'retention_policy', 'penetration_testing', 'hardening', 'security_certification'].includes(originalPlaceholder)) {
        const optionsMap: { [key: string]: string[] } = {
          operating_system: ['windows', 'linux', 'other', 'unix', 'mac', 'cloud_os', 'embedded_os'],
          programming_languages: ['java', 'dotnet', 'dotnetcore', 'python', 'javascript', 'typescript', 'ruby', 'php', 'go', 'swift', 'other'],
          frameworks: ['spring', 'rails', 'dotnet', 'react', 'angular', 'vue', 'flask', 'laravel', 'django', 'express', 'other'],
          database: ['sqlserver', 'mysql', 'postgresql', 'oracle', 'mongodb', 'redis', 'cassandra', 'access', 'other'],
          infrastructure: ['none', 'docker', 'kubernetes', 'ansible', 'terraform', 'aws', 'google_cloud', 'azure', 'other'],
          monitoring_tools: ['none', 'grafana', 'prometheus', 'elk', 'datadog', 'new_relic', 'zabbix', 'other'],
          authentication_methods: ['username_password', 'mfa', 'biometric'],
          backup_method: ['automatic', 'manual'],
          backup_type: ['continuous', 'differential', 'incremental', 'full'],
          backup_schedule: ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'],
          backup_storage: ['offsite', 'network', 'cloud', 'local'],
          backup_testing: ['none', 'emergency', 'regular'],
          retention_policy: ['none', 'one_year', 'six_months', 'three_months', 'one_month'],
          penetration_testing: ['black', 'white', 'gray', 'not_done'],
          hardening: ['done', 'not_done'],
          security_certification: ['has_afta', 'has_other', 'no_certification']
        };
        const options = optionsMap[originalPlaceholder];
        const value = retrievedValue;
        const result: { [key: string]: boolean } = {};
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          options.forEach(opt => { result[opt] = value[opt] === true; });
        } else if (typeof value === 'string') {
          options.forEach(opt => { result[opt] = value === opt; });
        } else {
          options.forEach(opt => { result[opt] = false; });
        }
        transformedResult[originalPlaceholder] = [result];
      }
      else if (originalPlaceholder === 'third_party_tools') {
        let value = retrievedValue;
        if (Array.isArray(value)) {
          finalValue = value.map(v => (typeof v === 'object' && v.tool) ? v : { tool: v }) as ThirdPartyTool[];
        } else if (typeof value === 'string' && value.trim() !== '') {
          finalValue = [{ tool: value }];
        } else {
          finalValue = [];
        }
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'db_constraints') {
        const value = retrievedValue;
        finalValue = [{ good: value === 'good', medium: value === 'medium', weak: value === 'weak' }] as DbConstraints;
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'load_balancing') {
        const value = retrievedValue;
        finalValue = [{ application_level: value === 'application_level', database_level: value === 'database_level', both: value === 'both', none: value === 'none' }] as LoadBalancing;
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'pki_implementation') {
        const value = retrievedValue;
        finalValue = [{ on_premises: value === 'on_premises', cloud_based: value === 'cloud_based', hybrid: value === 'hybrid' }] as PkiImplementation;
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'pki_usage') {
        finalValue = [{
          encryption: _.get(retrievedValue, 'encryption', false),
          digital_signing: _.get(retrievedValue, 'digital_signing', false),
          authentication: _.get(retrievedValue, 'authentication', false),
        }] as PkiUsage;
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'centralization') {
        const value = retrievedValue;
        if (!value || typeof value !== 'object') {
          finalValue = false;
        } else {
          finalValue = [{
            database_distribution: _.get(value, 'database_distribution') === 'distributed',
            application_distribution: _.get(value, 'application_distribution') === 'distributed',
          }] as Centralization;
        }
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (['db_dev_limits', 'app_dev_limits', 'service_dev_limits'].includes(originalPlaceholder)) {
        const keyMap: { [key: string]: string } = { db_dev_limits: 'database_development', app_dev_limits: 'application_development', service_dev_limits: 'service_development' };
        const key = keyMap[originalPlaceholder];
        const value = (retrievedValue && typeof retrievedValue === 'object') ? retrievedValue[key] : undefined;
        finalValue = [{
          free_no_cost: value === 'free_no_cost',
          free_with_cost: value === 'free_with_cost',
          limited: value === 'limited',
        }] as DevelopmentLimits;
        transformedResult[originalPlaceholder] = finalValue;
      }
      else if (originalPlaceholder === 'development_challenges') {
        let value = retrievedValue;
        let result: Partial<DevelopmentChallenges[0]> = { none: false, high_cost_time: false, contract_issues: false, technical_complexity: false, no_access_to_developer: false };
        if (Array.isArray(value)) {
          value.forEach((key: string) => { if (key in result) (result as any)[key] = true; });
        } else if (value && typeof value === 'object') {
          Object.keys(result).forEach((key) => { (result as any)[key] = !!(value as any)[key]; });
        }
        transformedResult[originalPlaceholder] = [result] as DevelopmentChallenges;
      }

      // SECTION 7
      else if (originalPlaceholder === 'current_hardware') {
        const hardwareArray = _.get(rawData, 'formData.current_hardware', []);
        finalValue = hardwareArray.map((hw: any): CurrentHardwareItem => ({
          machineName: hw.machineName || ' ', 
          ipAddress: this.processValueToPersian(hw.ipAddress || ' '),
          current_server_type: { physical_server: hw.server_type === 'physical_server', virtual_server: hw.server_type === 'virtual_server', cloud_server: hw.server_type === 'cloud_server' },
          current_cpu: { '2_cores': hw.cpu_cores === '2_cores', '8_cores': hw.cpu_cores === '8_cores', '16_cores': hw.cpu_cores === '16_cores', '32_cores': hw.cpu_cores === '32_cores', '64_cores_plus': hw.cpu_cores === '64_cores_plus' },
          current_memory: { 'less_than_8gb': hw.memory === 'less_than_8gb', '8_to_16gb': hw.memory === '8_to_16gb', '16_to_32gb': hw.memory === '16_to_32gb', '32_to_64gb': hw.memory === '32_to_64gb', '64_to_128gb': hw.memory === '64_to_128gb', '128_to_512gb': hw.memory === '128_to_512gb', 'more_than_512gb': hw.memory === 'more_than_512gb' },
          current_storage: { 'less_than_500gb': hw.storage === 'less_than_500gb', '500gb_to_1tb': hw.storage === '500gb_to_1tb', '1tb_to_5tb': hw.storage === '1_to_5tb', more_than_5tb: hw.storage === 'more_than_5tb' },
          current_gpu: { not_required: hw.gpu === 'not_required', standard_card: hw.gpu === 'standard_card', advanced_card: hw.gpu === 'advanced_card' },
          current_backup_space: { '1_to_5tb': hw.backup_space === '1_to_5tb', '5_to_10tb': hw.backup_space === '5_to_10tb', '10_to_25tb': hw.backup_space === '10_to_25tb', '25_to_50tb': hw.backup_space === '25_to_50tb', 'more_than_50tb': hw.backup_space === 'more_than_50tb' },
          description: hw.server_desc || hw.description || ' ',
        }));
        if (finalValue.length === 0) {
          finalValue.push({
            machineName: ' ', ipAddress: ' ',
            current_server_type: { physical_server: false, virtual_server: false, cloud_server: false },
            current_cpu: { '2_cores': false, '8_cores': false, '16_cores': false, '32_cores': false, '64_cores_plus': false },
            current_memory: { 'less_than_8gb': false, '8_to_16gb': false, '16_to_32gb': false, '32_to_64gb': false, '64_to_128gb': false, '128_to_512gb': false, 'more_than_512gb': false },
            current_storage: { 'less_than_500gb': false, '500gb_to_1tb': false, '1tb_to_5tb': false, more_than_5tb: false },
            current_gpu: { not_required: false, standard_card: false, advanced_card: false },
            current_backup_space: { '1_to_5tb': false, '5_to_10tb': false, '10_to_25tb': false, '25_to_50tb': false, 'more_than_50tb': false },
            description: ' ',
          });
        }
        transformedResult[originalPlaceholder] = finalValue;
      } else if (originalPlaceholder === 'future_hardware') {
        const hardwareArray = _.get(rawData, 'formData.future_hardware', []);
        finalValue = hardwareArray.map((hw: any): FutureHardwareItem => ({
          future_server_type: { physical_server: hw.future_server_type === 'physical_server', virtual_server: hw.future_server_type === 'virtual_server', cloud_server: hw.future_server_type === 'cloud_server' },
          future_cpu: { '2_cores': hw.future_cpu_cores === '2_cores', '8_cores': hw.future_cpu_cores === '8_cores', '16_cores': hw.future_cpu_cores === '16_cores', '32_cores': hw.future_cpu_cores === '32_cores', '64_cores_plus': hw.future_cpu_cores === '64_cores_plus' },
          future_memory: { 'less_than_8gb': hw.future_memory === 'less_than_8gb', '8_to_16gb': hw.future_memory === '8_to_16gb', '16_to_32gb': hw.future_memory === '16_to_32gb', '32_to_64gb': hw.future_memory === '32_to_64gb', '64_to_128gb': hw.future_memory === '64_to_128gb', '128_to_512gb': hw.future_memory === '128_to_512gb', 'more_than_512gb': hw.future_memory === 'more_than_512gb' },
          future_storage: { 'less_than_500gb': hw.future_storage === 'less_than_500gb', '500gb_to_1tb': hw.future_storage === '500gb_to_1tb', '1tb_to_5tb': hw.future_storage === '1_to_5tb', more_than_5tb: hw.future_storage === 'more_than_5tb' },
          future_gpu: { not_required: hw.future_gpu === 'not_required', standard_card: hw.future_gpu === 'standard_card', advanced_card: hw.future_gpu === 'advanced_card' },
          future_backup_space: { '1_to_5tb': hw.future_backup_space === '1_to_5tb', '5_to_10tb': hw.future_backup_space === '5_to_10tb', '10_to_25tb': hw.future_backup_space === '10_to_25tb', '25_to_50tb': hw.future_backup_space === '25_to_50tb', 'more_than_50tb': hw.future_backup_space === 'more_than_50tb' },
          description: hw.description || ' ',
        }));
        if (finalValue.length === 0) {
          finalValue.push({
            future_server_type: { physical_server: false, virtual_server: false, cloud_server: false },
            future_cpu: { '2_cores': false, '8_cores': false, '16_cores': false, '32_cores': false, '64_cores_plus': false },
            future_memory: { 'less_than_8gb': false, '8_to_16gb': false, '16_to_32gb': false, '32_to_64gb': false, '64_to_128gb': false, '128_to_512gb': false, 'more_than_512gb': false },
            future_storage: { 'less_than_500gb': false, '500gb_to_1tb': false, '1tb_to_5tb': false, more_than_5tb: false },
            future_gpu: { not_required: false, standard_card: false, advanced_card: false },
            future_backup_space: { '1_to_5tb': false, '5_to_10tb': false, '10_to_25tb': false, '25_to_50tb': false, 'more_than_50tb': false },
            description: ' ',
          });
        }
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 8 & 9
      else if (['support_method', 'support_quality', 'intellectual_property', 'user_satisfaction'].includes(originalPlaceholder)) {
        const value = retrievedValue;
        const map: { [key: string]: any } = {
          support_method: { contractor: value === 'contractor', organization: value === 'organization', both: value === 'both', none: value === 'none' },
          support_quality: { good: value === 'good', medium: value === 'medium', weak: value === 'weak' },
          intellectual_property: { organization: value === 'organization', other_organization: value === 'other_organization', developer: value === 'developer' },
          user_satisfaction: { low: value === 'low', medium: value === 'medium', high: value === 'high', very_high: value === 'very_high' },
        };
        transformedResult[originalPlaceholder] = [map[originalPlaceholder]];
      }

      // SECTION 10
      else if (['requirements_docs', 'analysis_docs', 'architecture_docs', 'implementation_docs', 'test_docs', 'user_manual', 'operation_manual', 'source_code', 'security_docs', 'risk_assessment'].includes(originalPlaceholder)) {
        const value = retrievedValue;
        finalValue = [{ not_exists: value === 'not_exists', exists_outdated: value === 'exists_outdated', exists_updated: value === 'exists_updated' }] as DocumentStatus;
        transformedResult[originalPlaceholder] = finalValue;
      } else if ([
        'authentication', 'access_control', 'activity_logging', 'data_encryption', 'standard_protocols', 'data_format', 'data_import',
        'data_export', 'data_recovery', 'error_prevention', 'error_free', 'requirement_coverage', 'change_time', 'ui_consistency',
        'ui_attractiveness', 'terminology', 'ui_customization', 'workflow_match', 'operation_speed', 'resource_usage', 'user_impact', 'scalability'
      ].includes(originalPlaceholder)) {
        const value = retrievedValue;
        finalValue = [{ never: value === 'never', often: value === 'often', sometimes: value === 'sometimes', rarely: value === 'rarely' }] as QualityFrequency;
        transformedResult[originalPlaceholder] = finalValue;
      }

      // SECTION 11
      else if (['ai_usage', 'blockchain', 'pki', 'directDbAccess', 'recovery_mechanism', 'replacementPlan', 'reports_status', 'local_backup_by_admin', 'systemInteraction'].includes(originalPlaceholder)) {
        const value = retrievedValue;
        finalValue = [{ yes: value === 'yes', no: value === 'no' }] as YesNoChoice;
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
