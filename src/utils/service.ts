// SERVICE
// SECTION 1
if (originalPlaceholder === 'title') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'title_1') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'service_owners') {
  let serviceOwners = retrievedValue || [];
  finalValue = serviceOwners.map((item: any) => ({
    name: item?.name || ' ',
    phone: this.processValueToPersian(item?.phone || ' '),
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      name: ' ',
      phone: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'form_completed_by') {
  let formCompleter = retrievedValue || [];
  finalValue = formCompleter.map((item: any) => ({
    name: item?.name || ' ',
    phone: this.processValueToPersian(item?.phone || ' '),
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
else if (originalPlaceholder === 'service_unique_code') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'service_provider') {
  transformedResult[originalPlaceholder] = retrievedValue.name || ' ';
} else if (originalPlaceholder === 'service_desc') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'regions') {
  console.log("retrievedValue:", retrievedValue);
  let regions = retrievedValue || [];
  finalValue = regions.map((item: any) => ({
    region: item?.region.map((item: any) => (
      item.name
    )),
    subregion: item?.subregion.map((item: any) => (
      item.name
    ))
  }));

  if (finalValue.length === 0) {
    finalValue = {
      regions: {
        region: [' '],
        subregion: [' '],
      }
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_type') {
  let serviceType = retrievedValue || {};
  finalValue = {
    service_type_C2G: serviceType?.C2G,
    service_type_B2G: serviceType?.B2G,
    service_type_G2G: serviceType?.G2G,
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_level') {
  finalValue = {
    service_level_national: false,
    service_level_regional: false,
    service_level_provincial: false,
    service_level_urban: false,
    service_level_rural: false,
  };

  if (retrievedValue === 'regional' || retrievedValue?.option === 'regional') {
    finalValue.service_level_regional = true;
  } else if (retrievedValue === 'provincial' || retrievedValue?.option === 'provincial') {
    finalValue.service_level_provincial = true;
  } else if (retrievedValue === 'urban' || retrievedValue?.option === 'urban') {
    finalValue.service_level_rural = true;
  } else if (retrievedValue === 'rural' || retrievedValue?.option === 'rural') {
    finalValue.service_level_urban = true;
  } else {
    finalValue.service_level_national = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_initiation') {
  finalValue = {
    service_initiation_user_request: false,
    service_initiation_specific_time: false,
    service_initiation_specific_event: false,
    service_initiation_other: false,
  };

  if (retrievedValue === 'specific_time' || retrievedValue?.option === 'specific_time') {
    finalValue.service_initiation_specific_time = true;
  } else if (retrievedValue === 'specific_event' || retrievedValue?.option === 'specific_event') {
    finalValue.service_initiation_specific_event = true;
  } else if (retrievedValue === 'other' || retrievedValue?.option === 'other') {
    finalValue.service_initiation_other = true;
  } else {
    finalValue.service_initiation_user_request = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'strategic_importance') {
  finalValue = {
    strategic_importance_low: false,
    strategic_importance_medium: false,
    strategic_importance_high: false,
  };

  if (retrievedValue === 'low') {
    finalValue.strategic_importance_low = true;
  } else if (retrievedValue === 'medium') {
    finalValue.strategic_importance_medium = true;
  } else if (retrievedValue === 'high') {
    finalValue.strategic_importance_high = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'required_documents') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'average_service_time') {
  transformedResult[originalPlaceholder] = retrievedValue || ' ';
} else if (originalPlaceholder === 'service_frequency') {
  finalValue = {
    service_frequency_one_time: false,
    service_frequency_periodic: false,
  };

  if (retrievedValue === 'one_time') {
    finalValue.service_frequency_one_time = true;
  } else if (retrievedValue === 'periodic') {
    finalValue.service_frequency_periodic = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'related_laws_regulations') {
  let relatedLawsRegulations = retrievedValue || [];

  finalValue = relatedLawsRegulations.map((item: any) => ({
    law_details: item?.lawDetails.title || ' ',
    description: item?.description || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      law_details: ' ',
      description: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 3
else if (originalPlaceholder === 'service_partners') {
  let servicePartner = retrievedValue || [];
  finalValue = servicePartner.map((item: any) => ({
    organization_name: item?.organizationName.name || ' ',
    contact_info: item?.contactInfo || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      organization_name: ' ',
      contact_info: ' ',
    }]
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 4
else if (originalPlaceholder === 'recipient_groups') {
  let recipientsGroups = retrievedValue || [];
  finalValue = recipientsGroups.map((item: any) => ({
    group_name: item?.groupName || ' ',
    requirements: item?.requirements || ' ',
    additional_notes: item?.additionalNotes || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      group_name: ' ',
      requirements: ' ',
      additional_notes: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_satisfaction_level') {
  finalValue = {
    service_satisfaction_level_very_poor: false,
    service_satisfaction_level_poor: false,
    service_satisfaction_level_average: false,
    service_satisfaction_level_good: false,
    service_satisfaction_level_excellent: false,
  };

  if (retrievedValue === 'Very poor' || retrievedValue?.option === 'Very poor') {
    finalValue.service_satisfaction_level_very_poor = true;
  } else if (retrievedValue === 'Poor' || retrievedValue?.option === 'Poor') {
    finalValue.service_satisfaction_level_poor = true;
  } else if (retrievedValue === 'Average' || retrievedValue?.option === 'Average') {
    finalValue.service_satisfaction_level_average = true;
  } else if (retrievedValue === 'Good' || retrievedValue?.option === 'Good') {
    finalValue.service_satisfaction_level_good = true;
  } else if (retrievedValue === 'Excellent' || retrievedValue?.option === 'Excellent') {
    finalValue.service_satisfaction_level_excellent = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 5
else if (originalPlaceholder === 'supporting_systems') {
  let supportingSystems = retrievedValue || [];
  finalValue = supportingSystems.map((item: any) => ({
    system_name: item?.systemName || ' ',
    supported_features: item?.supportedFeatures || ' ',
    limitations: item?.limitations || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      system_name: ' ',
      supported_features: ' ',
      limitations: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'system_support_level') {
  finalValue = {
    system_support_level_partial: false,
    system_support_level_nonintegrated: false,
    system_support_level_integrated: false,
    system_support_level_full_integrated: false,
  };

  if (retrievedValue === 'partial') {
    finalValue.system_support_level_partial = true;
  } else if (retrievedValue === 'nonintegrated') {
    finalValue.system_support_level_nonintegrated = true;
  } else if (retrievedValue === 'integrated') {
    finalValue.system_support_level_integrated = true;
  } else if (retrievedValue === 'full-integrated') {
    finalValue.system_support_level_full_integrated = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 6
else if (originalPlaceholder === 'service_data') {
  let serviceData = retrievedValue || [];
  finalValue = serviceData.map((item: any) => ({
    exchanged_data: item?.exchangedData.title || ' ',
    service_parameters: item?.serviceParameters.map((parameter: any) => (parameter.name)) || [],
    instance_values: item?.instanceValues.map((value: any) => (value.typeTitle)) || [],
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      exchanged_data: ' ',
      service_parameters: [],
      instance_values: [],
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'data_integration_level') {
  finalValue = {
    data_integration_level_some: false,
    data_integration_level_desired: false,
    data_integration_level_service: false,
    data_integration_level_supported: false,
  };

  if (typeof retrievedValue === 'string') {
    if (retrievedValue.startsWith('Some')) {
      finalValue.data_integration_level_some = true;
    } else if (retrievedValue.endsWith('service.')) {
      finalValue.data_integration_level_desired = true;
    } else if (retrievedValue.endsWith('insufficient.')) {
      finalValue.data_integration_level_service = true;
    } else if (retrievedValue.endsWith('mechanism.')) {
      finalValue.data_integration_level_supported = true;
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 7
else if (originalPlaceholder === 'specialized_human_resources') {
  let humanResources = retrievedValue || [];
  finalValue = humanResources.map((item: any) => ({
    specialization: item?.specialization || ' ',
    characteristics: item?.characteristics || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      specialization: ' ',
      characteristics: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'human_roles') {
  let humanRoles = retrievedValue || [];
  finalValue = humanRoles.map((item: any) => ({
    role: item?.role || ' ',
    responsibilities: {
      responsibilities_service_provider: item?.responsibilities?.service_provider,
      responsibilities_service_approver: item?.responsibilities?.service_approver,
      responsibilities_service_supervisor: item?.responsibilities?.service_supervisor,
    },
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      role: ' ',
      responsibilities: {
        responsibilities_service_provider: false,
        responsibilities_service_approver: false,
        responsibilities_service_supervisor: false,
      },
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'hr_assessment') {
  finalValue = {
    is_staff_sufficient: [{
      is_staff_sufficient_yes: retrievedValue.isStaffSufficient === 'yes',
      is_staff_sufficient_no: retrievedValue.isStaffSufficient === 'no',
    }],
    are_skills_available: [{
      are_skills_available_yes: retrievedValue.areSkillsAvailable === 'yes',
      are_skills_available_no: retrievedValue.areSkillsAvailable === 'no',
    }],
  }

  if (!retrievedValue) {
    finalValue = {
      is_staff_sufficient: {},
      are_skills_available: {},
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'related_processes') {
  let relatedProcesses = retrievedValue || [];
  finalValue = relatedProcesses.map((item: any) => (
    item?.formData.title
  ));
  if (!retrievedValue) {
    finalValue = [];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'process_coverage_status') {
  finalValue = {
    process_coverage_status_yes: false,
    process_coverage_status_no: false,
  };

  if (retrievedValue === "Yes" || retrievedValue.option === "Yes") {
    finalValue.process_coverage_status_yes = true;
  } else if (retrievedValue === "No" || retrievedValue.option === "No") {
    finalValue.process_coverage_status_no = true;
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 8
else if (originalPlaceholder === 'service_delivery_channels') {
  let deliveryChannels = retrievedValue || [];
  finalValue = deliveryChannels.map((item: any) => ({
    channel_type: item?.channelType || ' ',
    address: item?.address || ' ',
    description: item?.description || ' ',
  }));

  if (finalValue.length === 0) {
    finalValue = [{
      channel_type: ' ',
      address: ' ',
      description: ' ',
    }];
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 9
else if (originalPlaceholder === 'service_delivery_platform') {
  finalValue = {
    service_delivery_platform_mpls_tehran: retrievedValue.mpls_tehran || false,
    service_delivery_platform_mpls_provinces: retrievedValue.mpls_provinces || false,
    service_delivery_platform_national_network: retrievedValue.national_network || false,
    service_delivery_platform_government_network: retrievedValue.government_network || false,
    service_delivery_platform_apn_network: retrievedValue.apn_network || false,
    service_delivery_platform_ptp_lines: retrievedValue.ptp_lines || false,
    service_delivery_platform_other: retrievedValue.other || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 10
else if (originalPlaceholder === 'communication_type') {
  finalValue = {
    communication_type_electronic: retrievedValue.electronic || false,
    communication_type_non_electronic: retrievedValue.non_electronic || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'electronic_types') {
  finalValue = {
    electronic_types_internet: retrievedValue.internet || false,
    electronic_types_email: retrievedValue.email || false,
    electronic_types_sms: retrievedValue.sms || false,
    electronic_types_mobile_app: retrievedValue.mobile_app || false,
    electronic_types_postal: retrievedValue.postal || false,
    electronic_types_other: retrievedValue.other || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_type_status') {
  finalValue = {
    service_type_status_electronic: retrievedValue.electronic || false,
    service_type_status_non_electronic: retrievedValue.non_electronic || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'electronic_methods') {
  finalValue = {
    electronic_methods_portal: retrievedValue.portal || false,
    electronic_methods_internet: retrievedValue.internet || false,
    electronic_methods_email: retrievedValue.email || false,
    electronic_methods_other: retrievedValue.other || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'service_delivery_type') {
  finalValue = {
    service_delivery_type_electronic: retrievedValue.electronic || false,
    service_delivery_type_non_electronic: retrievedValue.non_electronic || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'electronic_service_methods') {
  finalValue = {
    electronic_service_methods_internet: retrievedValue.internet || false,
    electronic_service_methods_email: retrievedValue.email || false,
    electronic_service_methods_phone_sms: retrievedValue.phone_sms || false,
    electronic_service_methods_mobile_app: retrievedValue.mobile_app || false,
    electronic_service_methods_postal: retrievedValue.postal || false,
    electronic_service_methods_other: retrievedValue.other || false,
  };

  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'additional_information') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'electronic_service_status') {
  finalValue = {
    information_phase: [{
      information_phase_electronic: retrievedValue.informationPhase === 'electronic',
      information_phase_non_electronic: retrievedValue.informationPhase === 'non_electronic',
    }],
    production_phase: [{
      production_phase_electronic: retrievedValue.productionPhase === 'electronic',
      production_phase_non_electronic: retrievedValue.productionPhase === 'non_electronic',
    }],
    delivery_phase: [{
      delivery_phase_electronic: retrievedValue.deliveryPhase === 'electronic',
      delivery_phase_non_electronic: retrievedValue.deliveryPhase === 'non_electronic',
    }],
  }

  if (!retrievedValue) {
    finalValue = {
      information_phase: {},
      production_phase: {},
      delivery_phase: {},
    }
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 11
else if (originalPlaceholder === 'authentication_issues') {
  finalValue = {
    authentication_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    authentication_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'document_authentication_issues') {
  finalValue = {
    document_authentication_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    document_authentication_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'infrastructure_issues') {
  finalValue = {
    infrastructure_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    infrastructure_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'database_issues') {
  finalValue = {
    database_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    database_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'process_complexity_issues') {
  finalValue = {
    process_complexity_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    process_complexity_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'skills_issues') {
  finalValue = {
    skills_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    skills_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'system_quality_issues') {
  finalValue = {
    system_quality_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    system_quality_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'user_support_issues') {
  finalValue = {
    user_support_issues_has_issues: retrievedValue === 'has_issues' || retrievedValue.option === 'has_issues',
    user_support_issues_no_issues: retrievedValue === 'no_issues' || retrievedValue.option === 'no_issues',
  };
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 12
else if (originalPlaceholder === 'suggestions') {
  finalValue = {
    service_nature_change: retrievedValue.serviceNatureChange || ' ',
    service_merger: retrievedValue.serviceMerger || ' ',
    new_service_definition: retrievedValue.newServiceDefinition || ' ',
    owner_unit_notes: retrievedValue.ownerUnitNotes || ' ',
    other_suggestions: retrievedValue.otherSuggestions || ' ',
  };
  transformedResult[originalPlaceholder] = finalValue;
}