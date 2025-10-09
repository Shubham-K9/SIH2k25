// Consent metadata management system for India's 2016 EHR Standards
// Implements ISO 22600 and FHIR R4 consent management

import { ConsentResource, CodingSystem, auditLogManager } from './fhirModels.js'

export class ConsentManager {
  constructor() {
    this.consents = new Map() // patientId -> consent records
  }

  // Create initial consent for new patient
  createInitialConsent(patientId, patientData, doctorInfo) {
    const consent = new ConsentResource({
      patient: {
        reference: `Patient/${patientId}`,
        display: patientData.name
      },
      performer: [{
        type: {
          coding: [{
            system: 'http://hl7.org/fhir/ValueSet/consent-performer',
            code: 'PRCP',
            display: 'Performer'
          }]
        },
        who: {
          reference: `Practitioner/${doctorInfo.id}`,
          display: doctorInfo.name
        }
      }],
      organization: [{
        reference: 'Organization/healthcare-provider',
        display: 'Healthcare Provider'
      }],
      provision: {
        type: 'permit',
        period: {
          start: new Date().toISOString(),
          end: this.calculateConsentExpiry()
        },
        actor: [{
          role: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
              code: 'IRCP',
              display: 'Information Recipient'
            }]
          },
          reference: {
            reference: `Patient/${patientId}`,
            display: patientData.name
          }
        }],
        action: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/consentaction',
            code: 'access',
            display: 'Access'
          }]
        }],
        securityLabel: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
            code: 'N',
            display: 'Normal'
          }]
        }],
        purpose: [{
          coding: [{
            system: CodingSystem.SNOMED_CT,
            code: '225728007',
            display: 'Data collection consent'
          }]
        }],
        class: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
            code: 'INFA',
            display: 'Information Access'
          }]
        }],
        code: [{
          coding: [{
            system: CodingSystem.SNOMED_CT,
            code: '225728007',
            display: 'Data collection consent'
          }]
        }]
      }
    })

    this.consents.set(patientId, consent)
    
    // Log consent creation
    const auditEvent = {
      type: 'rest',
      typeDisplay: 'Consent Management',
      action: 'C',
      outcome: '0',
      outcomeDesc: 'Consent created successfully',
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
          reference: `Consent/${consent.id}`
        },
        detail: [{
          type: 'Consent',
          valueString: `Consent created for patient ${patientData.name}`
        }]
      }]
    }
    
    auditLogManager.addAuditEvent(auditEvent)
    
    return consent
  }

  // Update existing consent
  updateConsent(patientId, updatedData, doctorInfo) {
    const existingConsent = this.consents.get(patientId)
    if (!existingConsent) {
      throw new Error('No consent found for patient')
    }

    const updatedConsent = existingConsent.updateConsent(updatedData, doctorInfo)
    this.consents.set(patientId, updatedConsent)

    // Log consent update
    const auditEvent = {
      type: 'rest',
      typeDisplay: 'Consent Management',
      action: 'U',
      outcome: '0',
      outcomeDesc: 'Consent updated successfully',
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
          reference: `Consent/${updatedConsent.id}`
        },
        detail: [{
          type: 'Consent',
          valueString: `Consent updated for patient ${patientId}`
        }]
      }]
    }
    
    auditLogManager.addAuditEvent(auditEvent)
    
    return updatedConsent
  }

  // Withdraw consent
  withdrawConsent(patientId, reason, doctorInfo) {
    const existingConsent = this.consents.get(patientId)
    if (!existingConsent) {
      throw new Error('No consent found for patient')
    }

    const withdrawnConsent = existingConsent.updateConsent({
      status: 'inactive',
      provision: {
        ...existingConsent.provision,
        type: 'deny',
        period: {
          ...existingConsent.provision.period,
          end: new Date().toISOString()
        }
      }
    }, doctorInfo)

    this.consents.set(patientId, withdrawnConsent)

    // Log consent withdrawal
    const auditEvent = {
      type: 'rest',
      typeDisplay: 'Consent Management',
      action: 'U',
      outcome: '0',
      outcomeDesc: `Consent withdrawn: ${reason}`,
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
          reference: `Consent/${withdrawnConsent.id}`
        },
        detail: [{
          type: 'Consent',
          valueString: `Consent withdrawn for patient ${patientId}. Reason: ${reason}`
        }]
      }]
    }
    
    auditLogManager.addAuditEvent(auditEvent)
    
    return withdrawnConsent
  }

  // Check if consent is valid
  isConsentValid(patientId) {
    const consent = this.consents.get(patientId)
    if (!consent) return false
    
    const now = new Date()
    const consentStart = new Date(consent.provision.period.start)
    const consentEnd = consent.provision.period.end ? new Date(consent.provision.period.end) : null
    
    return consent.status === 'active' && 
           now >= consentStart && 
           (!consentEnd || now <= consentEnd)
  }

  // Get consent details
  getConsent(patientId) {
    return this.consents.get(patientId)
  }

  // Get all consents
  getAllConsents() {
    return Array.from(this.consents.values())
  }

  // Calculate consent expiry (default 1 year from creation)
  calculateConsentExpiry() {
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    return expiryDate.toISOString()
  }

  // Get consent summary for patient
  getConsentSummary(patientId) {
    const consent = this.getConsent(patientId)
    if (!consent) {
      return {
        hasConsent: false,
        status: 'No consent found',
        valid: false,
        created: null,
        expires: null
      }
    }

    return {
      hasConsent: true,
      status: consent.status,
      valid: this.isConsentValid(patientId),
      created: consent.dateTime,
      expires: consent.provision.period.end,
      version: consent.meta.versionId,
      lastUpdated: consent.meta.lastUpdated
    }
  }

  // Export consent data for compliance reporting
  exportConsentData(patientId = null) {
    if (patientId) {
      const consent = this.getConsent(patientId)
      return consent ? [consent] : []
    }
    
    return this.getAllConsents()
  }
}

// Export singleton instance
export const consentManager = new ConsentManager()
