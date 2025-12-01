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