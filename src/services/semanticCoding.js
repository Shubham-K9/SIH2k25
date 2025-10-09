// SNOMED-CT and LOINC semantic coding support for India's 2016 EHR Standards
// Implements standardized medical terminology and coding

export class SemanticCodingService {
  constructor() {
    this.snomedCT = new Map()
    this.loinc = new Map()
    this.icd10 = new Map()
    this.icd11 = new Map()
    
    this.initializeCodingSystems()
  }

  // Initialize coding systems with common Indian healthcare codes
  initializeCodingSystems() {
    this.initializeSNOMEDCT()
    this.initializeLOINC()
    this.initializeICD10()
    this.initializeICD11()
  }

  // SNOMED-CT codes for Indian healthcare
  initializeSNOMEDCT() {
    // Demographics
    this.snomedCT.set('male', {
      system: 'http://snomed.info/sct',
      code: '248153007',
      display: 'Male',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('female', {
      system: 'http://snomed.info/sct',
      code: '248152002',
      display: 'Female',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('other_gender', {
      system: 'http://snomed.info/sct',
      code: '32570681000036105',
      display: 'Other',
      version: '2023-03-01'
    })

    // Consent and privacy
    this.snomedCT.set('data_collection_consent', {
      system: 'http://snomed.info/sct',
      code: '225728007',
      display: 'Data collection consent',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('data_sharing_consent', {
      system: 'http://snomed.info/sct',
      code: '225729004',
      display: 'Data sharing consent',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('research_consent', {
      system: 'http://snomed.info/sct',
      code: '225730009',
      display: 'Research consent',
      version: '2023-03-01'
    })

    // Common Indian conditions
    this.snomedCT.set('diabetes_mellitus', {
      system: 'http://snomed.info/sct',
      code: '44054006',
      display: 'Diabetes mellitus',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('hypertension', {
      system: 'http://snomed.info/sct',
      code: '38341003',
      display: 'Hypertensive disorder, systemic arterial',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('tuberculosis', {
      system: 'http://snomed.info/sct',
      code: '56717001',
      display: 'Tuberculosis',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('malaria', {
      system: 'http://snomed.info/sct',
      code: '61462000',
      display: 'Malaria',
      version: '2023-03-01'
    })

    // Audit events
    this.snomedCT.set('patient_create', {
      system: 'http://snomed.info/sct',
      code: '225728007',
      display: 'Patient record creation',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('patient_update', {
      system: 'http://snomed.info/sct',
      code: '225729004',
      display: 'Patient record update',
      version: '2023-03-01'
    })
    
    this.snomedCT.set('patient_read', {
      system: 'http://snomed.info/sct',
      code: '225730009',
      display: 'Patient record access',
      version: '2023-03-01'
    })
  }

  // LOINC codes for laboratory and clinical observations
  initializeLOINC() {
    // Vital signs
    this.loinc.set('blood_pressure_systolic', {
      system: 'http://loinc.org',
      code: '8480-6',
      display: 'Systolic blood pressure',
      version: '2.75'
    })
    
    this.loinc.set('blood_pressure_diastolic', {
      system: 'http://loinc.org',
      code: '8462-4',
      display: 'Diastolic blood pressure',
      version: '2.75'
    })
    
    this.loinc.set('heart_rate', {
      system: 'http://loinc.org',
      code: '8867-4',
      display: 'Heart rate',
      version: '2.75'
    })
    
    this.loinc.set('body_temperature', {
      system: 'http://loinc.org',
      code: '8310-5',
      display: 'Body temperature',
      version: '2.75'
    })
    
    this.loinc.set('respiratory_rate', {
      system: 'http://loinc.org',
      code: '9279-1',
      display: 'Respiratory rate',
      version: '2.75'
    })

    // Laboratory tests
    this.loinc.set('glucose_fasting', {
      system: 'http://loinc.org',
      code: '1558-6',
      display: 'Glucose [Mass/volume] in Blood',
      version: '2.75'
    })
    
    this.loinc.set('hemoglobin', {
      system: 'http://loinc.org',
      code: '718-7',
      display: 'Hemoglobin [Mass/volume] in Blood',
      version: '2.75'
    })
    
    this.loinc.set('creatinine', {
      system: 'http://loinc.org',
      code: '2160-0',
      display: 'Creatinine [Mass/volume] in Serum or Plasma',
      version: '2.75'
    })
    
    this.loinc.set('cholesterol_total', {
      system: 'http://loinc.org',
      code: '2093-3',
      display: 'Cholesterol [Mass/volume] in Serum or Plasma',
      version: '2.75'
    })

    // Demographics
    this.loinc.set('age', {
      system: 'http://loinc.org',
      code: '30525-0',
      display: 'Age',
      version: '2.75'
    })
    
    this.loinc.set('gender', {
      system: 'http://loinc.org',
      code: '46098-0',
      display: 'Sex',
      version: '2.75'
    })
  }

  // ICD-10 codes for Indian healthcare
  initializeICD10() {
    this.icd10.set('diabetes_type2', {
      system: 'http://hl7.org/fhir/sid/icd-10',
      code: 'E11',
      display: 'Type 2 diabetes mellitus',
      version: '2023'
    })
    
    this.icd10.set('hypertension', {
      system: 'http://hl7.org/fhir/sid/icd-10',
      code: 'I10',
      display: 'Essential hypertension',
      version: '2023'
    })
    
    this.icd10.set('tuberculosis_pulmonary', {
      system: 'http://hl7.org/fhir/sid/icd-10',
      code: 'A15',
      display: 'Respiratory tuberculosis',
      version: '2023'
    })
    
    this.icd10.set('malaria', {
      system: 'http://hl7.org/fhir/sid/icd-10',
      code: 'B50',
      display: 'Plasmodium falciparum malaria',
      version: '2023'
    })
  }

  // ICD-11 codes for Indian healthcare
  initializeICD11() {
    this.icd11.set('diabetes_type2', {
      system: 'http://hl7.org/fhir/sid/icd-11',
      code: '5A11',
      display: 'Type 2 diabetes mellitus',
      version: '2023'
    })
    
    this.icd11.set('hypertension', {
      system: 'http://hl7.org/fhir/sid/icd-11',
      code: 'BA00',
      display: 'Essential hypertension',
      version: '2023'
    })
  }

  // Get coding for a specific term
  getCoding(term, system = 'snomed') {
    const systemMap = {
      'snomed': this.snomedCT,
      'loinc': this.loinc,
      'icd10': this.icd10,
      'icd11': this.icd11
    }
    
    return systemMap[system]?.get(term) || null
  }

  // Get all codings for a term across systems
  getAllCodings(term) {
    const codings = []
    
    for (const [system, map] of Object.entries({
      'snomed': this.snomedCT,
      'loinc': this.loinc,
      'icd10': this.icd10,
      'icd11': this.icd11
    })) {
      const coding = map.get(term)
      if (coding) {
        codings.push({
          ...coding,
          systemName: system
        })
      }
    }
    
    return codings
  }

  // Create FHIR coding object
  createFHIRCoding(term, system = 'snomed') {
    const coding = this.getCoding(term, system)
    if (!coding) return null
    
    return {
      system: coding.system,
      code: coding.code,
      display: coding.display,
      version: coding.version
    }
  }

  // Create FHIR CodeableConcept
  createCodeableConcept(term, system = 'snomed') {
    const coding = this.createFHIRCoding(term, system)
    if (!coding) return null
    
    return {
      coding: [coding],
      text: coding.display
    }
  }

  // Search for codes by display name
  searchByDisplay(searchTerm, system = 'snomed') {
    const systemMap = {
      'snomed': this.snomedCT,
      'loinc': this.loinc,
      'icd10': this.icd10,
      'icd11': this.icd11
    }
    
    const results = []
    const map = systemMap[system]
    
    if (map) {
      for (const [key, value] of map.entries()) {
        if (value.display.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            key,
            ...value,
            systemName: system
          })
        }
      }
    }
    
    return results
  }

  // Get gender coding
  getGenderCoding(gender) {
    const genderMap = {
      'male': 'male',
      'female': 'female',
      'other': 'other_gender'
    }
    
    const term = genderMap[gender.toLowerCase()]
    return this.createFHIRCoding(term, 'snomed')
  }

  // Get consent coding
  getConsentCoding(consentType) {
    const consentMap = {
      'data_collection': 'data_collection_consent',
      'data_sharing': 'data_sharing_consent',
      'research': 'research_consent'
    }
    
    const term = consentMap[consentType]
    return this.createFHIRCoding(term, 'snomed')
  }

  // Get audit event coding
  getAuditEventCoding(eventType) {
    const auditMap = {
      'create': 'patient_create',
      'update': 'patient_update',
      'read': 'patient_read'
    }
    
    const term = auditMap[eventType]
    return this.createFHIRCoding(term, 'snomed')
  }

  // Get vital signs coding
  getVitalSignsCoding(vitalSign) {
    const vitalMap = {
      'blood_pressure_systolic': 'blood_pressure_systolic',
      'blood_pressure_diastolic': 'blood_pressure_diastolic',
      'heart_rate': 'heart_rate',
      'body_temperature': 'body_temperature',
      'respiratory_rate': 'respiratory_rate'
    }
    
    const term = vitalMap[vitalSign]
    return this.createFHIRCoding(term, 'loinc')
  }

  // Get laboratory test coding
  getLaboratoryCoding(testType) {
    const labMap = {
      'glucose_fasting': 'glucose_fasting',
      'hemoglobin': 'hemoglobin',
      'creatinine': 'creatinine',
      'cholesterol_total': 'cholesterol_total'
    }
    
    const term = labMap[testType]
    return this.createFHIRCoding(term, 'loinc')
  }

  // Get diagnosis coding
  getDiagnosisCoding(condition, system = 'snomed') {
    const diagnosisMap = {
      'diabetes_mellitus': 'diabetes_mellitus',
      'hypertension': 'hypertension',
      'tuberculosis': 'tuberculosis',
      'malaria': 'malaria'
    }
    
    const term = diagnosisMap[condition]
    return this.createFHIRCoding(term, system)
  }

  // Validate coding
  validateCoding(coding) {
    if (!coding || !coding.system || !coding.code) {
      return { valid: false, error: 'Invalid coding structure' }
    }
    
    // Check if the coding exists in our systems
    const systemMap = {
      'http://snomed.info/sct': this.snomedCT,
      'http://loinc.org': this.loinc,
      'http://hl7.org/fhir/sid/icd-10': this.icd10,
      'http://hl7.org/fhir/sid/icd-11': this.icd11
    }
    
    const map = systemMap[coding.system]
    if (!map) {
      return { valid: false, error: 'Unknown coding system' }
    }
    
    // Check if code exists
    const found = Array.from(map.values()).find(item => item.code === coding.code)
    if (!found) {
      return { valid: false, error: 'Code not found in system' }
    }
    
    return { valid: true, coding: found }
  }

  // Get coding statistics
  getCodingStatistics() {
    return {
      snomedCT: this.snomedCT.size,
      loinc: this.loinc.size,
      icd10: this.icd10.size,
      icd11: this.icd11.size,
      total: this.snomedCT.size + this.loinc.size + this.icd10.size + this.icd11.size
    }
  }

  // Export all codings for a system
  exportCodings(system = 'snomed') {
    const systemMap = {
      'snomed': this.snomedCT,
      'loinc': this.loinc,
      'icd10': this.icd10,
      'icd11': this.icd11
    }
    
    const map = systemMap[system]
    if (!map) return null
    
    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      ...value
    }))
  }
}

// Export singleton instance
export const semanticCodingService = new SemanticCodingService()
