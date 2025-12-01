// DATA
// SECTION 1
if (originalPlaceholder === 'title') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'title_1') {
  transformedResult[originalPlaceholder] = retrievedValue;
} else if (originalPlaceholder === 'data_type') {
  finalValue = [
    {
      'data_type_specialized': retrievedValue === 'Specialized' || retrievedValue.option === 'Specialized',
      'data_type_non-specialized': retrievedValue === 'non-specialized' || retrievedValue.option === 'non-specialized',
    }
  ];
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'data_owners') {
  let owners = retrievedValue || [];
  finalValue = owners.map((item: any) => ({
    name: item?.name || '',
    department: item?.department?.name || '',
    phone: this.processValueToPersian(item?.phone),
  }));
  if (finalValue.length === 0) {
    finalValue = [{ name: ' ', department: ' ', phone: ' ' }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'form_completed_by') {
  let completedBy = retrievedValue || [];
  finalValue = completedBy.map((item: any) => ({
    name: item?.name || '',
    phone: this.processValueToPersian(item?.phone),
  }));

  if (finalValue.length === 0) {
    finalValue = [{ name: ' ', phone: ' ' }];
  }

  if (retrievedValue.length === 0) {
    finalValue = [{ name: ' ', phone: ' ' }];
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 2
else if (originalPlaceholder === 'value_added_services') {
  finalValue = [
    {
      'value_added_services_no': retrievedValue === 'no',
      'value_added_services_yes': retrievedValue === 'yes',
    }
  ];
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 3
else if (originalPlaceholder === 'main_characteristics') {
  let characteristics = retrievedValue || [];
  finalValue = characteristics.map((item: any) => ({
    name: item?.name || ' ',
    desc: item?.desc || ' ',
  }));
  if (finalValue.length === 0) {
    finalValue = [{ name: ' ', desc: ' ' }];
  }
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'data_types') {
  let data_types = retrievedValue || [];
  finalValue = data_types.map((item: any) => ({
    'type_title': item?.typeTitle || ' ',
    'type_description': item?.typeDescription || ' '
  }));
  if (finalValue.length === 0) {
    finalValue = [{ 'type_title': ' ', 'type_description': ' ' }];
  }
  transformedResult[originalPlaceholder] = finalValue;
}

// SECTION 4
else if (originalPlaceholder === 'confidentiality') {
  finalValue = [{
    'confidentiality_low': retrievedValue === 'low' || retrievedValue.option === 'low',
    'confidentiality_medium': retrievedValue === 'medium' || retrievedValue.option === 'medium',
    'confidentiality_high': retrievedValue === 'high' || retrievedValue.option === 'high',
  }];
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'integrity') {
  finalValue = [{
    'integrity_low': retrievedValue === 'low' || retrievedValue.option === 'low',
    'integrity_medium': retrievedValue === 'medium' || retrievedValue.option === 'medium',
    'integrity_high': retrievedValue === 'high' || retrievedValue.option === 'high',
  }];
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'availability') {
  finalValue = [{
    'availability_low': retrievedValue === 'low' || retrievedValue.option === 'low',
    'availability_medium': retrievedValue === 'medium' || retrievedValue.option === 'medium',
    'availability_high': retrievedValue === 'high' || retrievedValue.option === 'high',
  }];
  transformedResult[originalPlaceholder] = finalValue;
} else if (originalPlaceholder === 'impact_assessment') {

  const convert = (val: any): ImpactFlags => {
    if (val === "no_impact") return { hasImpact: false, noImpact: true };
    if (val === "has_impact") return { hasImpact: true, noImpact: false };
    if (typeof val === "object" && val?.option) return convert(val.option);
    return { hasImpact: false, noImpact: false };
  };

  finalValue = retrievedValue.map((item: any) => {

    const reputation = convert(item.reputation);
    const businessFuture = convert(item.businessFuture);
    const employeeConcern = convert(item.employeeConcern);
    const stakeholderConcern = convert(item.stakeholderConcern);
    const financialHealth = convert(item.financialHealth);
    const operationalHealth = convert(item.operationalHealth);

    return {
      confidentiality_impact: item.id === "confidentialityImpact",
      integrity_impact: item.id === "integrityImpact",
      availability_impact: item.id === "availabilityImpact",

      reputation_has_impact: reputation.hasImpact,
      reputation_has_no_impact: reputation.noImpact,

      business_future_has_impact: businessFuture.hasImpact,
      business_future_has_no_impact: businessFuture.noImpact,

      employee_concern_has_impact: employeeConcern.hasImpact,
      employee_concern_has_no_impact: employeeConcern.noImpact,

      stakeholder_concern_has_impact: stakeholderConcern.hasImpact,
      stakeholder_concern_has_no_impact: stakeholderConcern.noImpact,

      financial_health_has_impact: financialHealth.hasImpact,
      financial_health_has_no_impact: financialHealth.noImpact,

      operational_health_has_impact: operationalHealth.hasImpact,
      operational_health_has_no_impact: operationalHealth.noImpact
    };
  });
  transformedResult[originalPlaceholder] = finalValue;
}