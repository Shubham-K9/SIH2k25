// FHIR R4 compliant data models for India's 2016 EHR Standards
// Includes version tracking, consent metadata, and audit capabilities

export const FHIR_VERSION = '4.0.1'

// Patient resource with version tracking
export class PatientResource {
  constructor(data) {
    this.resourceType = 'Patient'
    this.id = data.id || crypto.randomUUID()
    this.meta = {
      versionId: data.meta?.versionId || '1',
      lastUpdated: data.meta?.lastUpdated || new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/Patient']
    }
    this.identifier = data.identifier || []
    this.name = data.name || []
    this.gender = data.gender
    this.birthDate = data.birthDate
    this.telecom = data.telecom || []
    this.address = data.address || []
    this.extension = data.extension || []
    
    // India-specific extensions
    this.extension.push({
      url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
      valueCodeableConcept: {
        coding: [{
          system: 'urn:iso:std:iso:3166',
          code: 'IN',
          display: 'India'
        }]
      }
    })
  }

  // Create new version
  createVersion(updatedData, updatedBy) {
    const newVersion = new PatientResource({
      ...this,
      ...updatedData,
      meta: {
        versionId: String(parseInt(this.meta.versionId) + 1),
        lastUpdated: new Date().toISOString(),
        profile: this.meta.profile
      }
    })
    
    // Add version history extension
    if (!newVersion.extension) newVersion.extension = []
    newVersion.extension.push({
      url: 'http://hl7.org/fhir/StructureDefinition/patient-version-history',
      valueReference: {
        reference: `Patient/${this.id}/_history/${this.meta.versionId}`
      }
    })
    
    return newVersion
  }
}

// Consent resource for patient consent management
export class ConsentResource {
  constructor(data) {
    this.resourceType = 'Consent'
    this.id = data.id || crypto.randomUUID()
    this.meta = {
      versionId: data.meta?.versionId || '1',
      lastUpdated: data.meta?.lastUpdated || new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/Consent']
    }
    this.status = data.status || 'active' // active, inactive, entered-in-error
    this.scope = {
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/consentscope',
        code: 'patient-privacy',
        display: 'Patient Privacy'
      }]
    }
    this.category = data.category || [{
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
        code: 'INFA',
        display: 'Information Access'
      }]
    }]
    this.patient = data.patient
    this.dateTime = data.dateTime || new Date().toISOString()
    this.performer = data.performer || []
    this.organization = data.organization || []
    this.sourceAttachment = data.sourceAttachment || []
    this.policy = data.policy || []
    this.provision = data.provision || {
      type: 'permit',
      period: {
        start: new Date().toISOString()
      },
      actor: [],
      action: [],
      securityLabel: [],
      purpose: [],
      class: [],
      code: []
    }
  }

  // Update consent
  updateConsent(updatedData, updatedBy) {
    return new ConsentResource({
      ...this,
      ...updatedData,
      meta: {
        versionId: String(parseInt(this.meta.versionId) + 1),
        lastUpdated: new Date().toISOString(),
        profile: this.meta.profile
      }
    })
  }
}

// AuditEvent resource for comprehensive audit logging
export class AuditEventResource {
  constructor(data) {
    this.resourceType = 'AuditEvent'
    this.id = data.id || crypto.randomUUID()
    this.meta = {
      versionId: '1',
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/AuditEvent']
    }
    this.type = {
      system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
      code: data.type || 'rest',
      display: data.typeDisplay || 'RESTful Operation'
    }
    this.subtype = data.subtype || []
    this.action = data.action || 'E' // C=Create, R=Read, U=Update, D=Delete, E=Execute
    this.recorded = data.recorded || new Date().toISOString()
    this.outcome = data.outcome || '0' // 0=Success, 4=Minor failure, 8=Serious failure, 12=Major failure
    this.outcomeDesc = data.outcomeDesc
    this.purposeOfEvent = data.purposeOfEvent || []
    this.agent = data.agent || []
    this.source = data.source || {
      site: 'EMR Portal',
      observer: {
        reference: 'Device/emr-portal'
      }
    }
    this.entity = data.entity || []
  }

  // Create audit event for patient operations
  static createPatientAuditEvent(operation, patientId, doctorInfo, outcome = '0', details = {}) {
    return new AuditEventResource({
      type: 'rest',
      typeDisplay: 'RESTful Operation',
      action: operation, // C, R, U, D, E
      outcome,
      outcomeDesc: details.outcomeDesc,
      agent: [{
        type: {
          coding: [{
            system: 'http://dicom.nema.org/resources/terminologies/DICOM',
            code: 'humanuser',
            display: 'Human User'
          }]
        },
        who: {
          reference: `Practitioner/${doctorInfo.id}`,
          display: doctorInfo.name
        },
        requestor: true
      }],
      entity: [{
        type: {
          coding: [{
            system: 'http://hl7.org/fhir/audit-entity-type',
            code: '2',
            display: 'System Object'
          }]
        },
        role: {
          coding: [{
            system: 'http://dicom.nema.org/resources/terminologies/DICOM',
            code: '1',
            display: 'Patient'
          }]
        },
        what: {
          reference: `Patient/${patientId}`
        },
        detail: details.entityDetails || []
      }]
    })
  }
}

// SNOMED-CT and LOINC coding utilities
export class CodingSystem {
  static SNOMED_CT = 'http://snomed.info/sct'
  static LOINC = 'http://loinc.org'
  static ICD_10 = 'http://hl7.org/fhir/sid/icd-10'
  static ICD_11 = 'http://hl7.org/fhir/sid/icd-11'
  
  // Common SNOMED-CT codes for Indian healthcare
  static GENDER_CODES = {
    'male': { system: this.SNOMED_CT, code: '248153007', display: 'Male' },
    'female': { system: this.SNOMED_CT, code: '248152002', display: 'Female' },
    'other': { system: this.SNOMED_CT, code: '32570681000036105', display: 'Other' }
  }
  
  static CONSENT_CODES = {
    'data_collection': { system: this.SNOMED_CT, code: '225728007', display: 'Data collection consent' },
    'data_sharing': { system: this.SNOMED_CT, code: '225729004', display: 'Data sharing consent' },
    'research': { system: this.SNOMED_CT, code: '225730009', display: 'Research consent' }
  }
  
  static AUDIT_CODES = {
    'patient_create': { system: this.SNOMED_CT, code: '225728007', display: 'Patient record creation' },
    'patient_update': { system: this.SNOMED_CT, code: '225729004', display: 'Patient record update' },
    'patient_read': { system: this.SNOMED_CT, code: '225730009', display: 'Patient record access' },
    'consent_given': { system: this.SNOMED_CT, code: '225731008', display: 'Consent given' },
    'consent_withdrawn': { system: this.SNOMED_CT, code: '225732001', display: 'Consent withdrawn' }
  }
}

// Version history management
export class VersionManager {
  constructor() {
    this.versions = new Map() // patientId -> version history
  }

  addVersion(patientId, version) {
    if (!this.versions.has(patientId)) {
      this.versions.set(patientId, [])
    }
    this.versions.get(patientId).push(version)
  }

  getVersionHistory(patientId) {
    return this.versions.get(patientId) || []
  }

  getLatestVersion(patientId) {
    const history = this.getVersionHistory(patientId)
    return history[history.length - 1] || null
  }

  getVersion(patientId, versionId) {
    const history = this.getVersionHistory(patientId)
    return history.find(v => v.meta.versionId === versionId) || null
  }
}

// Audit log manager
export class AuditLogManager {
  constructor() {
    this.auditLogs = []
  }

  addAuditEvent(event) {
    this.auditLogs.push(event)
    // In production, this would be sent to a secure audit log service
    console.log('Audit Event:', JSON.stringify(event, null, 2))
  }

  getAuditLogs(patientId = null, doctorId = null, startDate = null, endDate = null) {
    let filtered = this.auditLogs

    if (patientId) {
      filtered = filtered.filter(log => 
        log.entity.some(entity => 
          entity.what?.reference?.includes(`Patient/${patientId}`)
        )
      )
    }

    if (doctorId) {
      filtered = filtered.filter(log => 
        log.agent.some(agent => 
          agent.who?.reference?.includes(`Practitioner/${doctorId}`)
        )
      )
    }

    if (startDate) {
      filtered = filtered.filter(log => new Date(log.recorded) >= new Date(startDate))
    }

    if (endDate) {
      filtered = filtered.filter(log => new Date(log.recorded) <= new Date(endDate))
    }

    return filtered.sort((a, b) => new Date(b.recorded) - new Date(a.recorded))
  }

  getPatientAuditSummary(patientId) {
    const logs = this.getAuditLogs(patientId)
    const summary = {
      totalEvents: logs.length,
      lastUpdated: logs[0]?.recorded || null,
      lastUpdatedBy: logs[0]?.agent[0]?.who?.display || 'Unknown',
      eventTypes: {}
    }

    logs.forEach(log => {
      const eventType = log.type.code
      summary.eventTypes[eventType] = (summary.eventTypes[eventType] || 0) + 1
    })

    return summary
  }
}

// Export singleton instances
export const versionManager = new VersionManager()
export const auditLogManager = new AuditLogManager()
