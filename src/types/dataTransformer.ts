//
// --- Core and Configuration Types ---
//

/**
 * Defines the optional configuration for the DataTransformer constructor.
 */
export interface DataTransformerOptions {
  outputPath?: string;
}

/**
 * Represents a single mapping from a template placeholder to a JSON path in the raw data.
 */
export interface Mapping {
  placeholder: string;
  jsonPath: string;
}

/**
 * Defines the structure of the JSON mapping file.
 */
export interface MappingFile {
  mappings: Mapping[];
}

/**
 * Type for used_features fields that should always be arrays
 */
export type UsedFeatures = Array<{ name: string }>;

/**
 * Utility function to get default values for specific field types
 */
export function getDefaultValue(fieldName: string, fieldType: string): any {
  // Fields that should default to empty arrays
  if (fieldName.endsWith('_used_features')) {
    return [] as UsedFeatures;
  }
  
  // Fields that should default to empty string arrays
  if (fieldName === 'supported_services' || fieldName === 'unsupported_services' || fieldName === 'systemUrls') {
    return [];
  }
  
  // Fields that should default to empty object arrays
  if (fieldName.endsWith('_table') || fieldName === 'mainFunctions' || fieldName === 'third_party_tools') {
    return [];
  }
  
  // Description fields default to empty string
  if (fieldName.endsWith('_description')) {
    return '';
  }
  
  // Default fallback
  return '';
}

/**
 * Represents the final transformed data object, ready for a template engine.
 * This defines the complete structure with proper typing.
 */
export interface TransformedData {
  // System Information
  system_title?: string;
  systemUrls?: string[];
  system_type?: SystemType;
  system_user?: SystemUser[];
  system_owner?: SystemOwner[];
  filler_name?: string;
  
  // System Details
  systemMission?: string;
  mainFunctions?: Array<{ name: string }>;
  supported_services?: string[];
  unsupported_services?: string[];
  legals_table?: LegalItem[];
  acquisition_method?: AcquisitionMethod;
  contractorInfo?: string;
  current_status?: SystemStatus;
  system_start_date?: string;
  subsystem?: SubsystemStatus;
  duplicate_systems?: DuplicateSystem[];
  
  // Data Tables
  data_table?: DataTableItem[];
  unsupportedData_table?: UnsupportedDataItem[];
  
  // System Interactions
  systemInteraction?: YesNoChoice;
  systemInteraction_table?: SystemInteractionItem[];
  desiredSystemRelations_table?: DesiredSystemRelation[];
  systemRelationIssues_table?: SystemRelationIssue[];
  directDbAccess?: YesNoChoice;
  
  // User Domains - these should always be arrays, never empty strings
  headquarters_unit_name?: string;
  headquarters_estimated_users?: string;
  headquarters_time_limit?: string;
  headquarters_peak_time?: string;
  headquarters_used_features?: UsedFeatures; // Always an array
  
  tax_offices_unit_name?: string;
  tax_offices_estimated_users?: string;
  tax_offices_time_limit?: string;
  tax_offices_peak_time?: string;
  tax_offices_used_features?: UsedFeatures; // Always an array
  
  other_orgs_unit_name?: string;
  other_orgs_estimated_users?: string;
  other_orgs_time_limit?: string;
  other_orgs_peak_time?: string;
  other_orgs_used_features?: UsedFeatures; // Always an array
  
  taxpayers_unit_name?: string;
  taxpayers_estimated_users?: string;
  taxpayers_time_limit?: string;
  taxpayers_peak_time?: string;
  taxpayers_used_features?: UsedFeatures; // Always an array
  
  businesses_unit_name?: string;
  businesses_estimated_users?: string;
  businesses_time_limit?: string;
  businesses_peak_time?: string;
  businesses_used_features?: UsedFeatures; // Always an array
  
  // Technical Properties
  architecture?: Architecture;
  operating_system?: OperatingSystem;
  programming_languages?: ProgrammingLanguage;
  frameworks?: Framework;
  third_party_tools?: ThirdPartyTool[];
  database?: Database;
  infrastructure?: Infrastructure;
  monitoring_tools?: MonitoringTool;
  
  // Security
  authentication_methods?: AuthenticationMethod;
  pki?: YesNoChoice;
  pki_implementation?: PkiImplementation;
  pki_usage?: PkiUsage;
  
  // Other fields can be added as needed
  [key: string]: any; // Fallback for any unmapped fields
}

/**
 * A generic type for raw input data, as its structure is highly variable.
 */
export type RawData = Record<string, any>;


//
// --- Generic Structure Types ---
//

/**
 * Generic type for objects representing a set of boolean flags (e.g., from checkboxes).
 */
export type BooleanFlags<T extends string> = Array<Partial<Record<T, boolean>>>;

/**
 * Generic type for objects representing a single choice from a set (e.g., from radio buttons).
 */
export type Choice<T extends string> = Array<Record<T, boolean>>;

/**
 * Generic type for a tri-state status (good, medium, weak).
 */
export type TriStateStatus = Choice<'good' | 'medium' | 'weak'>;

/**
 * Generic type for document status.
 */
export type DocumentStatus = Choice<'not_exists' | 'exists_outdated' | 'exists_updated'>;

/**
 * Generic type for a simple Yes/No choice.
 */
export type YesNoChoice = Choice<'yes' | 'no'>;


//
// --- Transformed Object Types ---
//

// Section 1: General & System Information
export type SystemType = Choice<'specialized' | 'non-specialized' | 'out-of-scope'>;
export interface SystemUser { name: string; }
export interface SystemOwner { name: string; department: string; mobile: string; }
export interface FillerName { firstname: string; lastname: string; }

// Section 2: System Details
export interface LegalItem { legal_material: string; legal_description: string; }
export type AcquisitionMethod = Choice<'internal_development' | 'package_purchase' | 'outsourced_development' | 'hybrid_purchase' | 'other'>;
export type SystemStatus = BooleanFlags<'work_referral' | 'analysis' | 'design' | 'implementation' | 'deployment' | 'operational' | 'maintenance' | 'future_development' | 'retired'>;
export interface SubsystemStatus { is_subsystem: boolean; has_subsystems: boolean; no: boolean; }
export interface DuplicateSystem { duplicate_system: string; duplicate_functions: string; duplicateSystems_reason: string; }

// Section 3: Data Tables
export interface DataTableItem {
  data_name: string;
  system_role: BooleanFlags<'data_steward' | 'data_entry_point' | 'data_producer'>;
  data_source: BooleanFlags<'user_input' | 'operations' | 'internal_system' | 'external_org' | 'import' | 'hardware'>;
  description: string;
}
export interface UnsupportedDataItem { unsupportedData: string; description: string; }

// Section 4: System Interactions
export interface SystemInteractionItem {
  systemName: string[];
  exchangeData: string[];
  exchangeType: Choice<'send' | 'receive'>;
  exchangeMethod: BooleanFlags<'api' | 'mech_file' | 'manual_file' | 'db_connection'>;
  serviceParameters: string[];
  exchangeReason: string;
}
export interface DesiredSystemRelation { desired_systemName: string; desired_exchangeData: string; }
export interface SystemRelationIssue { system: string; issue: string; solution: string; }

// Section 5: User Access
export interface UnauthorizedUser { user: string; reason: string; }

// Section 6: Technical & Architectural Properties
export type Architecture = Choice<'service_oriented' | 'serverless' | 'single_tier' | 'multi_tier' | 'microservices' | 'other'>;
export type OperatingSystem = BooleanFlags<'windows' | 'linux' | 'other' | 'unix' | 'mac' | 'cloud_os' | 'embedded_os'>;
export type ProgrammingLanguage = BooleanFlags<'java' | 'dotnet' | 'dotnetcore' | 'python' | 'javascript' | 'typescript' | 'ruby' | 'php' | 'go' | 'swift' | 'other'>;
export type Framework = BooleanFlags<'spring' | 'rails' | 'dotnet' | 'react' | 'angular' | 'vue' | 'flask' | 'laravel' | 'django' | 'express' | 'other'>;
export interface ThirdPartyTool { tool: string; }
export type Database = BooleanFlags<'sqlserver' | 'mysql' | 'postgresql' | 'oracle' | 'mongodb' | 'redis' | 'cassandra' | 'access' | 'other'>;
export type DbConstraints = TriStateStatus;
export type Infrastructure = BooleanFlags<'none' | 'docker' | 'kubernetes' | 'ansible' | 'terraform' | 'aws' | 'google_cloud' | 'azure' | 'other'>;
export type MonitoringTool = BooleanFlags<'none' | 'grafana' | 'prometheus' | 'elk' | 'datadog' | 'new_relic' | 'zabbix' | 'other'>;
export type LoadBalancing = Choice<'application_level' | 'database_level' | 'both' | 'none'>;
export type AuthenticationMethod = BooleanFlags<'username_password' | 'mfa' | 'biometric'>;
export type PkiImplementation = Choice<'on_premises' | 'cloud_based' | 'hybrid'>;
export type PkiUsage = BooleanFlags<'encryption' | 'digital_signing' | 'authentication'>;
export type Centralization = boolean | Array<{ database_distribution: boolean; application_distribution: boolean; }>;
export type DevelopmentLimits = Choice<'free_no_cost' | 'free_with_cost' | 'limited'>;
export type DevelopmentChallenges = BooleanFlags<'none' | 'high_cost_time' | 'contract_issues' | 'technical_complexity' | 'no_access_to_developer'>;

// Section 7: Hardware
export interface HardwareItem { description: string; }
export interface CurrentHardwareItem extends HardwareItem {
  machineName: string;
  ipAddress: string;
  current_server_type: Choice<'physical_server' | 'virtual_server' | 'cloud_server'>[0];
  current_cpu: Choice<'2_cores' | '8_cores' | '16_cores' | '32_cores' | '64_cores_plus'>[0];
  current_memory: Choice<'less_than_8gb' | '8_to_16gb' | '16_to_32gb' | '32_to_64gb' | '64_to_128gb' | '128_to_512gb' | 'more_than_512gb'>[0];
  current_storage: Choice<'less_than_500gb' | '500gb_to_1tb' | '1tb_to_5tb' | 'more_than_5tb'>[0];
  current_gpu: Choice<'not_required' | 'standard_card' | 'advanced_card'>[0];
  current_backup_space: Choice<'1_to_5tb' | '5_to_10tb' | '10_to_25tb' | '25_to_50tb' | 'more_than_50tb'>[0];
}
export interface FutureHardwareItem extends HardwareItem {
  future_server_type: Choice<'physical_server' | 'virtual_server' | 'cloud_server'>[0];
  future_cpu: Choice<'2_cores' | '8_cores' | '16_cores' | '32_cores' | '64_cores_plus'>[0];
  future_memory: Choice<'less_than_8gb' | '8_to_16gb' | '16_to_32gb' | '32_to_64gb' | '64_to_128gb' | '128_to_512gb' | 'more_than_512gb'>[0];
  future_storage: Choice<'less_than_500gb' | '500gb_to_1tb' | '1tb_to_5tb' | 'more_than_5tb'>[0];
  future_gpu: Choice<'not_required' | 'standard_card' | 'advanced_card'>[0];
  future_backup_space: Choice<'1_to_5tb' | '5_to_10tb' | '10_to_25tb' | '25_to_50tb' | 'more_than_50tb'>[0];
}

// Section 8: Support and Backup
export type SupportMethod = Choice<'contractor' | 'organization' | 'both' | 'none'>;
export type SupportQuality = TriStateStatus;
export type BackupMethod = BooleanFlags<'automatic' | 'manual'>;
export type BackupType = BooleanFlags<'continuous' | 'differential' | 'incremental' | 'full'>;
export type BackupSchedule = BooleanFlags<'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily'>;
export type BackupStorage = BooleanFlags<'offsite' | 'network' | 'cloud' | 'local'>;
export type BackupTesting = BooleanFlags<'none' | 'emergency' | 'regular'>;
export type RetentionPolicy = BooleanFlags<'none' | 'one_year' | 'six_months' | 'three_months' | 'one_month'>;

// Section 9: Documentation and IP
export type IntellectualProperty = Choice<'organization' | 'other_organization' | 'developer'>;

// Section 10: Quality Attributes
export type UserSatisfaction = Choice<'low' | 'medium' | 'high' | 'very_high'>;
export type QualityFrequency = Choice<'never' | 'often' | 'sometimes' | 'rarely'>;

// Section 11: Security
export type PenetrationTest = BooleanFlags<'black' | 'white' | 'gray' | 'not_done'>;
export type Hardening = BooleanFlags<'done' | 'not_done'>;
export type SecurityCertification = BooleanFlags<'has_afta' | 'has_other' | 'no_certification'>;