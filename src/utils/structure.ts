// INFRASTRUCTURE
// SECTION 1
if (originalPlaceholder === 'title') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'title_1') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'interviewees') {
  let interviewees = retrievedValue || [];
  finalValue = interviewees.map((item: any) => ({
    fullname: item?.fullname || ' ',
    phone: item?.phone || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      fullname: ' ',
      phone: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'form_completed_by') {
  let formCompletedBy = retrievedValue || [];
  finalValue = formCompletedBy.map((item: any) => ({
    name: item?.name || ' ',
    phone: item?.phone || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      name: ' ',
      phone: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 2
else if (originalPlaceholder === 'data_center') {
  let dataCenter = retrievedValue || [];
  finalValue = dataCenter.map((item: any) => {

    return ({
      type: {
        data_center: item.type === 'Data Center' || item.type.option === "Data Center" || false,
        server_room: item.type === 'Server Room' || item.type.option === "Server Room" || false,
      },
      owner: {
        organization: item.owner === 'Organization' || item.owner.option === 'Organization' || false,
        other_owner: item.owner === 'Other - specify:' || item.owner.option === 'Other - specify:' || false,
        other_owner_text: item.owner.otherText || ' ',
      },
      physical_location: item['physical-location'],
      status: {
        supplying: item.status === 'Supplying/Installing' || item.status.option === 'Supplying/Installing' || false,
        operational: item.status === 'Operational' || item.status.option === 'Operational' || false,
        replaced: item.status === 'Being Replaced (Removed)' || item.status.option === 'Being Replaced (Removed)' || false,
        other_status: item.status === 'Other - specify:' || item.status.option === 'Other - specify:' || false,
        other_status_text: item.status.otherText || ' ',
      },
      power_outage_resilience: fieldValueChecker(item.power_outage_resilience),
      temperature_monitoring: fieldValueChecker(item.temperature_monitoring),
      fire_suppression: fieldValueChecker(item.fire_suppression),
      access_control_data: fieldValueChecker(item.access_control),
      locked_cabinets: fieldValueChecker(item.locked_cabinets),
      network_redundancy: fieldValueChecker(item.network_redundancy),
      backup_and_recovery: fieldValueChecker(item.backup_and_recovery),
      change_management: fieldValueChecker(item.change_management),
      disaster_recovery_plan: fieldValueChecker(item.disaster_recovery_plan),
      services: item?.services,
      catalog: fieldValueChecker(item?.catalog),
      service_level_agreement: fieldValueChecker(item['service-level-agreement']),
    });
  });
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 3
else if (originalPlaceholder === 'network_diagrams') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'structured_cabling') {
  finalValue = fieldValueChecker(retrievedValue);
  console.log("fianlValue:", finalValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'vlan_implementation') {
  finalValue = fieldValueChecker(retrievedValue);
  console.log("fianlValue:", finalValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_inventory') {
  finalValue = fieldValueChecker(retrievedValue);
  console.log("fianlValue:", finalValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'redundancy') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 4
else if (originalPlaceholder === 'internet') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'local') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'custom') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'users') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'auth') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      centralized_auth: retrievedValue.startsWith('Centralized') || false,
      seperated_auth: retrievedValue.startsWith('Separate') || false,
      combined_auth: retrievedValue.startsWith('Combined') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      centralized_auth: retrievedValue.option.startsWith('Centralized') || false,
      seperated_auth: retrievedValue.option.startsWith('Separate') || false,
      combined_auth: retrievedValue.option.startsWith('Combined') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_rbac') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_scheduling') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_auth') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_monitoring') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_reports') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internet_alerts') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 5
else if (originalPlaceholder === 'monitoring_and_control') {
  let monitoringAndControl = retrievedValue || [];
  finalValue = monitoringAndControl.map((item: any) => ({
    monitoring_name: item?.name || ' ',
    monitoring_open_source: {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    monitoring_policies: item?.policies || ' ',
    monitoring_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      monitoring_name: ' ',
      monitoring_open_source: {
        open_no: false,
        open_yes: false,
      },
      monitoring_policies: ' ',
      monitoring_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'access') {
  finalValue = {
    access_bandwidth: retrievedValue?.Bandwidth === true,
    access_latency: retrievedValue?.Latency === true,
    access_availability: retrievedValue?.['Availability percentage'] === true,
    access_packet: retrievedValue?.['Packet loss'] === true,
    access_port: retrievedValue?.['Port/Interface errors'] === true,
    access_device: retrievedValue?.['Device temperature'] === true,
    access_cpu: retrievedValue?.['CPU and network memory usage'] === true,
    access_unusual: retrievedValue?.['Unusual or suspicious traffic'] === true,
    access_link: retrievedValue?.['Link and connection status'] === true,
    access_number: retrievedValue?.['Number of concurrent users'] === true,
    access_traffic: retrievedValue?.['Traffic by protocol or application'] === true,
    access_security: retrievedValue?.['Security and access logs'] === true,
    access_health: retrievedValue?.['Health of key services (DNS, DHCP, AD, etc.)'] === true,
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'backup') {
  let backup = retrievedValue || [];
  finalValue = backup.map((item: any) => ({
    backup_name: item?.name || ' ',
    'backup_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    backup_policies: item?.policies || ' ',
    backup_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      backup_name: ' ',
      'backup_open-source': {
        open_no: false,
        open_yes: false,
      },
      backup_policies: ' ',
      backup_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'remote_connection') {
  let remoteConnection = retrievedValue || [];
  finalValue = remoteConnection.map((item: any) => ({
    remote_connection_name: item?.name || ' ',
    'remote_connection_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    remote_connection_policies: item?.policies || ' ',
    remote_connection_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      remote_connection_name: ' ',
      'remote_connection_open-source': {
        open_no: false,
        open_yes: false,
      },
      remote_connection_policies: ' ',
      remote_connection_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'server_infrastructure_monitoring') {
  let serverInfrastructureMonitoring = retrievedValue || [];
  finalValue = serverInfrastructureMonitoring.map((item: any) => ({
    server_infrastructure_monitoring_name: item?.name || ' ',
    'server_infrastructure_monitoring_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    server_infrastructure_monitoring_policies: item?.policies || ' ',
    server_infrastructure_monitoring_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      server_infrastructure_monitoring_name: ' ',
      'server_infrastructure_monitoring_open-source': {
        open_no: false,
        open_yes: false,
      },
      server_infrastructure_monitoring_policies: ' ',
      server_infrastructure_monitoring_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'configuration_change_management') {
  let configurationChangeManagement = retrievedValue || [];
  finalValue = configurationChangeManagement.map((item: any) => ({
    configuration_change_management_name: item?.name || ' ',
    'configuration_change_management_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    configuration_change_management_policies: item?.policies || ' ',
    configuration_change_management_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      configuration_change_management_name: ' ',
      'configuration_change_management_open-source': {
        open_no: false,
        open_yes: false,
      },
      configuration_change_management_policies: ' ',
      configuration_change_management_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'ipam_documentation') {
  let ipamDocumentation = retrievedValue || [];
  finalValue = ipamDocumentation.map((item: any) => ({
    ipam_documentation_name: item?.name || ' ',
    'ipam_documentation_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    ipam_documentation_policies: item?.policies || ' ',
    ipam_documentation_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      ipam_documentation_name: ' ',
      'ipam_documentation_open-source': {
        open_no: false,
        open_yes: false,
      },
      ipam_documentation_policies: ' ',
      ipam_documentation_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'ticketing_helpdesk') {
  let ticketingHelpdesk = retrievedValue || [];
  finalValue = ticketingHelpdesk.map((item: any) => ({
    ticketing_helpdesk_name: item?.name || ' ',
    'ticketing_helpdesk_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    ticketing_helpdesk_policies: item?.policies || ' ',
    ticketing_helpdesk_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      ticketing_helpdesk_name: ' ',
      'ticketing_helpdesk_open-source': {
        open_no: false,
        open_yes: false,
      },
      ticketing_helpdesk_policies: ' ',
      ticketing_helpdesk_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'security_ids_ips_siem') {
  let securityIdsIpsSiem = retrievedValue || [];
  finalValue = securityIdsIpsSiem.map((item: any) => ({
    security_ids_ips_siem_name: item?.name || ' ',
    'security_ids_ips_siem_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    security_ids_ips_siem_policies: item?.policies || ' ',
    security_ids_ips_siem_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      security_ids_ips_siem_name: ' ',
      'security_ids_ips_siem_open-source': {
        open_no: false,
        open_yes: false,
      },
      security_ids_ips_siem_policies: ' ',
      security_ids_ips_siem_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'traffic_analysis_troubleshooting') {
  let trafficAnalysisTroubleshooting = retrievedValue || [];
  finalValue = trafficAnalysisTroubleshooting.map((item: any) => ({
    traffic_analysis_troubleshooting_name: item?.name || ' ',
    'traffic_analysis_troubleshooting_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    traffic_analysis_troubleshooting_policies: item?.policies || ' ',
    traffic_analysis_troubleshooting_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      traffic_analysis_troubleshooting_name: ' ',
      'traffic_analysis_troubleshooting_open-source': {
        open_no: false,
        open_yes: false,
      },
      traffic_analysis_troubleshooting_policies: ' ',
      traffic_analysis_troubleshooting_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'automation_orchestration') {
  let automationOrchestration = retrievedValue || [];
  finalValue = automationOrchestration.map((item: any) => ({
    automation_orchestration_name: item?.name || ' ',
    'automation_orchestration_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    automation_orchestration_policies: item?.policies || ' ',
    automation_orchestration_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      automation_orchestration_name: ' ',
      'automation_orchestration_open-source': {
        open_no: false,
        open_yes: false,
      },
      automation_orchestration_policies: ' ',
      automation_orchestration_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'reporting_dashboard') {
  let reportingDashboard = retrievedValue || [];
  finalValue = reportingDashboard.map((item: any) => ({
    reporting_dashboard_name: item?.name || ' ',
    'reporting_dashboard_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    reporting_dashboard_policies: item?.policies || ' ',
    reporting_dashboard_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      reporting_dashboard_name: ' ',
      'reporting_dashboard_open-source': {
        open_no: false,
        open_yes: false,
      },
      reporting_dashboard_policies: ' ',
      reporting_dashboard_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'access_identity_management') {
  let accessIdentityManagement = retrievedValue || [];
  finalValue = accessIdentityManagement.map((item: any) => ({
    access_identity_management_name: item?.name || ' ',
    'access_identity_management_open-source': {
      open_no: item?.['open-source'] === undefined || item?.['open-source'] === 'No' || item?.['open-source'].option === 'No',
      open_yes: item?.['open-source'] === 'Yes' || item?.['open-source'].option === 'Yes',
    },
    access_identity_management_policies: item?.policies || ' ',
    access_identity_management_documentation: {
      documentation_not: item?.documentation === undefined || item?.documentation === 'Not suitable' || item?.documentation.option === 'Not suitable',
      documentation_suitable: item?.documentation === 'Suitable' || item?.documentation.option === 'Suitable',
    },
  }));

  if (finalValue.length === 0) {
    finalValue = {
      access_identity_management_name: ' ',
      'access_identity_management_open-source': {
        open_no: false,
        open_yes: false,
      },
      access_identity_management_policies: ' ',
      access_identity_management_documentation: {
        documentation_not: false,
        documentation_suitable: false,
      },
    };
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'public_key_infrastructure') {
  let publicKeyInfrastructure = retrievedValue || [];
  finalValue = publicKeyInfrastructure.map((item: any) => ({
    ca_count: buildCountObject(item?.ca_count, {
      ca_0: '0',
      ca_1: '1',
      ca_2: '2',
      ca_more: 'More',
    }),
    ra_count: buildCountObject(item?.ra_count, {
      ra_none: 'None',
      ra_1: '1',
      ra_2: '2',
      ra_more: 'More',
    }),
    ca_os: buildCountObject(item?.ca_os, {
      ca_os_windows: 'Windows',
      ca_os_linux: 'Linux',
      ca_os_mixed: 'Mixed',
    }),
    va_count: buildCountObject(item?.va_count, {
      va_none: 'None',
      va_1: '1',
      va_2: '2',
      va_more: 'More',
    }),
    key_length: buildCountObject(item?.key_length, {
      key_length_1024: '1024',
      key_length_2048: '2048',
      key_length_3072: '3072',
      key_length_other: 'Other',
    }),
    ca_redundancy: buildCountObject(item?.ca_redundancy, {
      ca_redundancy_no: 'No',
      ca_redundancy_backup: 'Yes - Backup',
      ca_redundancy_cluster: 'Yes - Active',
    }),
    key_recovery: buildCountObject(item?.key_recovery, {
      key_recovery_none: 'None',
      key_recovery_hsm: 'Yes - Keys are archived',
      key_recovery_backup: 'Yes - Keys are backed',
    }),
    certificate_validity: buildCountObject(item?.certificate_validity, {
      certificate_validity_less: 'Less',
      certificate_validity_1_2: '1-2',
      certificate_validity_more: 'More',
      certificate_validity_variable: 'Variable',
    }),
    pki_standards: buildCountObject(item?.pki_standards, {
      pki_standards_none: 'No',
      pki_standards_microsoft: 'Microsoft',
      pki_standards_nist: 'NIST',
      pki_standards_iso: 'ISO/IEC',
      pki_standards_etsi: 'ETSI',
      pki_standards_other: 'Other',
    }),
    key_management_policies: item?.key_management_policies || ' ',
    pki_systems: item?.pki_systems || ' ',
    pki_security_mechanisms: {
      pki_security_digital_signature: item?.pki_security_mechanisms?.['Support for digital signature mechanism - e.g., for electronic documents or transactions.'] === true,
      pki_security_timestamping: item?.pki_security_mechanisms?.['Support for timestamping mechanism - to record the time of digital signatures.'] === true,
      pki_security_ssh: item?.pki_security_mechanisms?.['Support for SSH strong authentication using certificates instead of passwords.'] === true,
      pki_security_2fa: item?.pki_security_mechanisms?.['Certificate-based two-factor authentication (2FA) - e.g., Smart Card or certificate-based MFA.'] === true,
      pki_security_ssl: item?.pki_security_mechanisms?.['Use of SSL/TLS certificates for websites and internal services - for encryption and server authentication.'] === true,
      pki_security_ipsec: item?.pki_security_mechanisms?.['Use of IPSec with certificates - for secure WAN/LAN tunnels.'] === true,
      pki_security_secure_email: item?.pki_security_mechanisms?.['Use of secure email certificates (S/MIME) - for email encryption and signing.'] === true,
      pki_security_code_signing: item?.pki_security_mechanisms?.['Code signing - to ensure integrity and authenticity of executable code.'] === true,
      pki_security_encrypted_data: item?.pki_security_mechanisms?.['Certificate-based encrypted data exchange - e.g., using XML Signature or PKCS#7.'] === true,
      pki_security_other: item?.pki_security_mechanisms?.['Other - please specify:'] === true,
    },
    wan_pki: buildCountObject(item?.wan_pki, {
      wan_pki_no: 'No',
      wan_pki_yes: 'Yes',
    }),
    key_generation: buildCountObject(item?.key_generation, {
      key_generation_no: 'No',
      key_generation_yes: 'Yes',
      key_generation_hybrid: 'Hybrid',
    }),
    pki_support_need: buildCountObject(item?.pki_support_need, {
      pki_support_need_no: 'No',
      pki_support_need_yes: 'Yes',
    }),
    support_quality: buildCountObject(item?.support_quality, {
      support_quality_weak: 'Weak',
      support_quality_average: 'Average',
      support_quality_good: 'Good',
    }),
    public_key: {
      public_key_digital_signature: item?.['public-key']?.['Support for digital signature mechanism.'] === true,
      public_key_timestamping: item?.['public-key']?.['Support for timestamping mechanism.'] === true,
      public_key_ssh: item?.['public-key']?.['Support for strong SSH authentication protocol.'] === true,
      public_key_2fa: item?.['public-key']?.['Capability for two-factor authentication based on PKI.'] === true,
      public_key_ssl: item?.['public-key']?.['Use of SSL/TLS certificates.'] === true,
      public_key_ipsec: item?.['public-key']?.['Use of Internet Protocol Security (IPSec).'] === true,
      public_key_secure_email: item?.['public-key']?.['Use of secure email certificates.'] === true,
      public_key_code_signing: item?.['public-key']?.['Code signing to ensure code integrity and authenticity.'] === true,
      public_key_encrypted_data: item?.['public-key']?.['Encrypted data exchange based on PKI using electronic certificates.'] === true,
    }
  }));
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 6
else if (originalPlaceholder === 'network_staff_count') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_staff_0: retrievedValue.startsWith('0') || false,
      network_staff_1: retrievedValue.startsWith('1') || false,
      network_staff_2_3: retrievedValue.startsWith('2') || false,
      network_staff_4_6: retrievedValue.startsWith('4') || false,
      network_staff_more: retrievedValue.startsWith('More') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_staff_0: retrievedValue.option.startsWith('0') || false,
      network_staff_1: retrievedValue.option.startsWith('1') || false,
      network_staff_2_3: retrievedValue.option.startsWith('2') || false,
      network_staff_4_6: retrievedValue.option.startsWith('4') || false,
      network_staff_more: retrievedValue.option.startsWith('More') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_team_certification') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_team_certification_no: retrievedValue.startsWith('No') || false,
      network_team_certification_basic: retrievedValue.startsWith('Basic') || false,
      network_team_certification_advanced: retrievedValue.startsWith('Advanced') || false,
      network_team_certification_specialized: retrievedValue.startsWith('Specialized') || false,
      network_team_certification_combination: retrievedValue.startsWith('Combination') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_team_certification_no: retrievedValue.option.startsWith('No') || false,
      network_team_certification_basic: retrievedValue.option.startsWith('Basic') || false,
      network_team_certification_advanced: retrievedValue.option.startsWith('Advanced') || false,
      network_team_certification_specialized: retrievedValue.option.startsWith('Specialized') || false,
      network_team_certification_combination: retrievedValue.option.startsWith('Combination') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_task_access_separation') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_task_access_separation_one: retrievedValue.startsWith('All') || false,
      network_task_access_separation_centralized: retrievedValue.startsWith('Tasks are divided,') || false,
      network_task_access_separation_rolebased: retrievedValue.startsWith('Tasks are divided –') || false,
      network_task_access_separation_fullrbac: retrievedValue.startsWith('Full') || false,
      network_task_access_separation_review: retrievedValue.startsWith('RBAC') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_task_access_separation_one: retrievedValue.option.startsWith('All') || false,
      network_task_access_separation_centralized: retrievedValue.option.startsWith('Tasks are divided,') || false,
      network_task_access_separation_rolebased: retrievedValue.option.startsWith('Tasks are divided –') || false,
      network_task_access_separation_fullrbac: retrievedValue.option.startsWith('Full') || false,
      network_task_access_separation_review: retrievedValue.option.startsWith('RBAC') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_emergency_availability') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_emergency_availability_none: retrievedValue.startsWith('No') || false,
      network_emergency_availability_one: retrievedValue.startsWith('Emergency') || false,
      network_emergency_availability_oncall: retrievedValue.startsWith('Defined') || false,
      network_emergency_availability_team: retrievedValue.startsWith('On-call') || false,
      network_emergency_availability_247: retrievedValue.startsWith('24/7') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_emergency_availability_none: retrievedValue.option.startsWith('No') || false,
      network_emergency_availability_one: retrievedValue.option.startsWith('Emergency') || false,
      network_emergency_availability_oncall: retrievedValue.option.startsWith('Defined') || false,
      network_emergency_availability_team: retrievedValue.option.startsWith('On-call') || false,
      network_emergency_availability_247: retrievedValue.option.startsWith('24/7') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_team_training') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_team_training_none: retrievedValue.startsWith('No') || false,
      network_team_training_reactive: retrievedValue.startsWith('Only') || false,
      network_team_training_yearly: retrievedValue.startsWith('Once') || false,
      network_team_training_6months: retrievedValue.startsWith('Every') || false,
      network_team_training_specialized: retrievedValue.startsWith('Quarterly') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_team_training_none: retrievedValue.option.startsWith('No') || false,
      network_team_training_reactive: retrievedValue.option.startsWith('Only') || false,
      network_team_training_yearly: retrievedValue.option.startsWith('Once') || false,
      network_team_training_6months: retrievedValue.option.startsWith('Every') || false,
      network_team_training_specialized: retrievedValue.option.startsWith('Quarterly') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_backup_roles') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_backup_roles_none: retrievedValue.startsWith('No') || false,
      network_backup_roles_few: retrievedValue.startsWith('Only') || false,
      network_backup_roles_technical: retrievedValue.startsWith('For') || false,
      network_backup_roles_assigned: retrievedValue.startsWith('Backup assigned') || false,
      network_backup_roles_full: retrievedValue.startsWith('Backup +') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_backup_roles_none: retrievedValue.option.startsWith('No') || false,
      network_backup_roles_few: retrievedValue.option.startsWith('Only') || false,
      network_backup_roles_technical: retrievedValue.option.startsWith('For') || false,
      network_backup_roles_assigned: retrievedValue.option.startsWith('Backup assigned') || false,
      network_backup_roles_full: retrievedValue.option.startsWith('Backup +') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_kpi_evaluation') {
  if (retrievedValue === undefined) {
    finalValue = undefined;
  } else if (typeof retrievedValue === 'string') {
    finalValue = {
      network_kpi_evaluation_none: retrievedValue.startsWith('No') || false,
      network_kpi_evaluation_qualitative: retrievedValue.startsWith('Qualitative') || false,
      network_kpi_evaluation_general: retrievedValue.startsWith('General') || false,
      network_kpi_evaluation_quantitative: retrievedValue.startsWith('Quantitative') || false,
      network_kpi_evaluation_full: retrievedValue.startsWith('KPIs') || false,
    }
  } else if (typeof retrievedValue.option === 'string') {
    finalValue = {
      network_kpi_evaluation_none: retrievedValue.option.startsWith('No') || false,
      network_kpi_evaluation_qualitative: retrievedValue.option.startsWith('Qualitative') || false,
      network_kpi_evaluation_general: retrievedValue.option.startsWith('General') || false,
      network_kpi_evaluation_quantitative: retrievedValue.option.startsWith('Quantitative') || false,
      network_kpi_evaluation_full: retrievedValue.option.startsWith('KPIs') || false,
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 7
else if (originalPlaceholder === 'access_control_security') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_access_control') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_segmentation') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'firewalls') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'ids_ips') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_traffic_analysis') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'patch_management') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'hardware_security') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'least_privilege') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'data_encryption') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'authentication_methods_current') {
  finalValue = {
    password: retrievedValue?.['Username and password only, without any additional security layer.'] === true,
    smartcard: retrievedValue?.['Smart card (e.g., HID, Smart Card) used as part of MFA or as password replacement.'] === true,
    biometric: retrievedValue?.['Fingerprint or biometric authentication, either standalone or combined with other methods.'] === true,
    authentication_methods_current_other: retrievedValue?.['Other'] === true,
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'authentication_types_supported') {
  finalValue = {
    authentication_types_supported_local: retrievedValue?.['Local authentication, e.g., local users on servers or devices.'] === true,
    authentication_types_supported_remote: retrievedValue?.['Remote authentication, e.g., VPN, RDP, SSH via RADIUS/LDAP.'] === true,
    authentication_types_supported_cascading: retrievedValue?.['Cascading authentication, e.g., AD authentication propagated to other services.'] === true,
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'sso_support') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'authentication_protocols') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'two_factor_authentication') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'authentication_capacity') {
  finalValue = buildCountObject(retrievedValue, {
    authentication_capacity_unknown: 'Unknown',
    authentication_capacity_lt100: 'Less',
    authentication_capacity_100_1000: '100',
    authentication_capacity_gt1000: 'More',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'pki_usage') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'auth_policies_standards') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'user_role_management_tools') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'isms_implementation') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'security_benchmark_usage') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'network_policy_documentation') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'drp') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'bcp') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'security_scans') {
  finalValue = fieldValueChecker(retrievedValue);
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 8
else if (originalPlaceholder === 'physical_logical_map_documentation') {
  finalValue = buildCountObject(retrievedValue, {
    physical_logical_map_none: 'Not',
    physical_logical_map_outdated: 'Available but',
    physical_logical_map_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'physical_network_map') {
  finalValue = buildCountObject(retrievedValue, {
    physical_network_map_none: 'Not',
    physical_network_map_outdated: 'Available but',
    physical_network_map_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'logical_network_map') {
  finalValue = buildCountObject(retrievedValue, {
    logical_network_map_none: 'Not',
    logical_network_map_outdated: 'Available but',
    logical_network_map_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'ip_addressing_documentation') {
  finalValue = buildCountObject(retrievedValue, {
    ip_addressing_documentation_none: 'Not',
    ip_addressing_documentation_outdated: 'Available but',
    ip_addressing_documentation_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'equipment_configuration_docs') {
  finalValue = buildCountObject(retrievedValue, {
    equipment_configuration_docs_none: 'Not',
    equipment_configuration_docs_outdated: 'Available but',
    equipment_configuration_docs_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'change_documentation') {
  finalValue = buildCountObject(retrievedValue, {
    change_documentation_none: 'Not',
    change_documentation_outdated: 'Available but',
    change_documentation_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'security_documentation') {
  finalValue = buildCountObject(retrievedValue, {
    security_documentation_none: 'Not',
    security_documentation_outdated: 'Available but',
    security_documentation_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'admin_and_access_docs') {
  finalValue = buildCountObject(retrievedValue, {
    admin_and_access_docs_none: 'Not',
    admin_and_access_docs_outdated: 'Available but',
    admin_and_access_docs_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'backup_and_recovery_docs') {
  finalValue = buildCountObject(retrievedValue, {
    backup_and_recovery_docs_none: 'Not',
    backup_and_recovery_docs_outdated: 'Available but',
    backup_and_recovery_docs_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'server_technical_docs') {
  finalValue = buildCountObject(retrievedValue, {
    server_technical_docs_none: 'Not',
    server_technical_docs_outdated: 'Available but',
    server_technical_docs_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'monitoring_and_reporting_docs') {
  finalValue = buildCountObject(retrievedValue, {
    monitoring_and_reporting_docs_none: 'Not',
    monitoring_and_reporting_docs_outdated: 'Available but',
    monitoring_and_reporting_docs_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'sop_documentation') {
  finalValue = buildCountObject(retrievedValue, {
    sop_documentation_none: 'Not',
    sop_documentation_outdated: 'Available but',
    sop_documentation_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'compliance_and_audit_docs_national') {
  finalValue = buildCountObject(retrievedValue, {
    compliance_and_audit_docs_national_none: 'Not',
    compliance_and_audit_docs_national_outdated: 'Available but',
    compliance_and_audit_docs_national_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'compliance_and_audit_docs_international') {
  finalValue = buildCountObject(retrievedValue, {
    compliance_and_audit_docs_international_none: 'Not',
    compliance_and_audit_docs_international_outdated: 'Available but',
    compliance_and_audit_docs_international_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'internal_wiki') {
  finalValue = buildCountObject(retrievedValue, {
    internal_wiki_none: 'Not',
    internal_wiki_outdated: 'Available but',
    internal_wiki_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'physical_equipment') {
  finalValue = buildCountObject(retrievedValue, {
    physical_equipment_none: 'Not',
    physical_equipment_outdated: 'Available but',
    physical_equipment_available: 'Available and',
  });
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 9
else if (originalPlaceholder === 'descs') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'problems_suggestions') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
}