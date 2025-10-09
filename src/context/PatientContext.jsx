import React, { createContext, useContext, useMemo, useState } from 'react'
import { PatientResource, versionManager, auditLogManager } from '../services/fhirModels.js'
import { auditService } from '../services/auditService.js'
import { consentManager } from '../services/consentManager.js'
import { semanticCodingService } from '../services/semanticCoding.js'

const PatientContext = createContext(null)

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [currentDoctor, setCurrentDoctor] = useState(null)

  // Initialize with current user from auth context
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('abha_user') || 'null')
    if (user) {
      setCurrentDoctor({
        id: user.id || 'doctor-001',
        name: user.name || 'Dr. Unknown',
        role: 'Practitioner'
      })
    }
  }, [])

  function addPatient(patientData) {
    const patientId = crypto.randomUUID()
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    
    // Create FHIR-compliant patient resource
    const patientResource = new PatientResource({
      id: patientId,
      name: [{
        use: 'official',
        family: patientData.name.split(' ').slice(-1)[0] || '',
        given: patientData.name.split(' ').slice(0, -1) || [patientData.name]
      }],
      gender: patientData.gender.toLowerCase(),
      birthDate: calculateBirthDate(patientData.age),
      telecom: [{
        system: 'phone',
        value: patientData.contact,
        use: 'mobile'
      }],
      address: [{
        use: 'home',
        country: 'IN'
      }],
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
          valueCodeableConcept: {
            coding: [{
              system: 'urn:iso:std:iso:3166',
              code: 'IN',
              display: 'India'
            }]
          }
        }
      ]
    })

    // Add semantic coding
    const genderCoding = semanticCodingService.getGenderCoding(patientData.gender)
    if (genderCoding) {
      patientResource.extension.push({
        url: 'http://hl7.org/fhir/StructureDefinition/patient-gender',
        valueCoding: genderCoding
      })
    }

    // Store patient with metadata
    const patientWithMetadata = {
      id: patientId,
      ...patientData,
      fhirResource: patientResource,
      createdAt: new Date().toISOString(),
      createdBy: doctorInfo,
      version: 1,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: doctorInfo
    }

    setPatients((prev) => [...prev, patientWithMetadata])
    
    // Add to version manager
    versionManager.addVersion(patientId, patientResource)
    
    // Create initial consent
    const consent = consentManager.createInitialConsent(patientId, patientData, doctorInfo)
    
    // Log patient creation
    auditService.logPatientCreation(patientId, patientData, doctorInfo)
    
    return patientWithMetadata
  }

  function updatePatient(patientId, updatedData) {
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    
    setPatients((prev) => {
      return prev.map(patient => {
        if (patient.id === patientId) {
          const previousVersion = patient.fhirResource
          
          // Create new version
          const updatedResource = previousVersion.createVersion(updatedData, doctorInfo)
          
          // Add to version manager
          versionManager.addVersion(patientId, updatedResource)
          
          // Log patient update
          auditService.logPatientUpdate(patientId, updatedData, doctorInfo, previousVersion)
          
          return {
            ...patient,
            ...updatedData,
            fhirResource: updatedResource,
            version: parseInt(updatedResource.meta.versionId),
            lastUpdated: updatedResource.meta.lastUpdated,
            lastUpdatedBy: doctorInfo
          }
        }
        return patient
      })
    })
  }

  function getPatient(patientId) {
    return patients.find(p => p.id === patientId)
  }

  function getPatientVersions(patientId) {
    return versionManager.getVersionHistory(patientId)
  }

  function getPatientVersion(patientId, versionId) {
    return versionManager.getVersion(patientId, versionId)
  }

  function deletePatient(patientId) {
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    const patient = getPatient(patientId)
    
    if (patient) {
      // Log patient deletion
      auditService.logPatientDeletion(patientId, patient, doctorInfo)
      
      // Remove from patients list
      setPatients((prev) => prev.filter(p => p.id !== patientId))
      
      // Withdraw consent
      try {
        consentManager.withdrawConsent(patientId, 'Patient record deleted', doctorInfo)
      } catch (error) {
        console.warn('No consent found to withdraw for patient:', patientId)
      }
    }
  }

  function accessPatient(patientId) {
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    
    // Log patient access
    auditService.logPatientAccess(patientId, doctorInfo, 'read')
    
    return getPatient(patientId)
  }

  function getPatientAuditLogs(patientId) {
    return auditService.getAuditLogs({ patientId })
  }

  function getPatientAuditSummary(patientId) {
    return auditService.getPatientAuditSummary(patientId)
  }

  function getConsentSummary(patientId) {
    return consentManager.getConsentSummary(patientId)
  }

  function updateConsent(patientId, consentData) {
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    return consentManager.updateConsent(patientId, consentData, doctorInfo)
  }

  function withdrawConsent(patientId, reason) {
    const doctorInfo = currentDoctor || { id: 'system', name: 'System', role: 'System' }
    return consentManager.withdrawConsent(patientId, reason, doctorInfo)
  }

  function isConsentValid(patientId) {
    return consentManager.isConsentValid(patientId)
  }

  // Helper function to calculate birth date from age
  function calculateBirthDate(age) {
    const currentDate = new Date()
    const birthYear = currentDate.getFullYear() - age
    return `${birthYear}-01-01` // Approximate birth date
  }

  const value = useMemo(() => ({ 
    patients, 
    addPatient,
    updatePatient,
    getPatient,
    deletePatient,
    accessPatient,
    getPatientVersions,
    getPatientVersion,
    getPatientAuditLogs,
    getPatientAuditSummary,
    getConsentSummary,
    updateConsent,
    withdrawConsent,
    isConsentValid,
    currentDoctor
  }), [patients, currentDoctor])

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
}

export function usePatients() {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error('usePatients must be used within PatientProvider')
  return ctx
}


