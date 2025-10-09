// Comprehensive audit logging service for India's 2016 EHR Standards
// Implements FHIR R4 AuditEvent and comprehensive tracking

import { AuditEventResource, auditLogManager } from './fhirModels.js'

export class AuditService {
  constructor() {
    this.auditLogs = []
    this.retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000 // 7 years in milliseconds
  }

  // Log patient creation
  logPatientCreation(patientId, patientData, doctorInfo) {
    const auditEvent = AuditEventResource.createPatientAuditEvent(
      'C', // Create
      patientId,
      doctorInfo,
      '0', // Success
      {
        outcomeDesc: 'Patient record created successfully',
        entityDetails: [{
          type: 'Patient',
          valueString: `Patient ${patientData.name} created with ID ${patientId}`
        }]
      }
    )

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log patient update
  logPatientUpdate(patientId, updatedFields, doctorInfo, previousVersion = null) {
    const changes = this.calculateChanges(previousVersion, updatedFields)
    
    const auditEvent = AuditEventResource.createPatientAuditEvent(
      'U', // Update
      patientId,
      doctorInfo,
      '0', // Success
      {
        outcomeDesc: 'Patient record updated successfully',
        entityDetails: [{
          type: 'Patient',
          valueString: `Patient ${patientId} updated. Changes: ${changes.join(', ')}`
        }]
      }
    )

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log patient access/view
  logPatientAccess(patientId, doctorInfo, accessType = 'read') {
    const auditEvent = AuditEventResource.createPatientAuditEvent(
      'R', // Read
      patientId,
      doctorInfo,
      '0', // Success
      {
        outcomeDesc: `Patient record accessed (${accessType})`,
        entityDetails: [{
          type: 'Patient',
          valueString: `Patient ${patientId} accessed for ${accessType}`
        }]
      }
    )

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log patient deletion
  logPatientDeletion(patientId, patientData, doctorInfo) {
    const auditEvent = AuditEventResource.createPatientAuditEvent(
      'D', // Delete
      patientId,
      doctorInfo,
      '0', // Success
      {
        outcomeDesc: 'Patient record deleted',
        entityDetails: [{
          type: 'Patient',
          valueString: `Patient ${patientData.name} (ID: ${patientId}) deleted`
        }]
      }
    )

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log consent operations
  logConsentOperation(operation, patientId, consentId, doctorInfo, details = {}) {
    const auditEvent = new AuditEventResource({
      type: 'rest',
      typeDisplay: 'Consent Management',
      action: operation,
      outcome: '0',
      outcomeDesc: details.outcomeDesc || `Consent ${operation} operation completed`,
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
          reference: `Consent/${consentId}`
        },
        detail: [{
          type: 'Consent',
          valueString: details.details || `Consent ${operation} for patient ${patientId}`
        }]
      }]
    })

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log system events
  logSystemEvent(eventType, details, severity = 'info') {
    const auditEvent = new AuditEventResource({
      type: 'rest',
      typeDisplay: 'System Event',
      action: 'E', // Execute
      outcome: severity === 'error' ? '8' : '0',
      outcomeDesc: details.description || `System event: ${eventType}`,
      agent: [{
        type: {
          coding: [{
            system: 'http://dicom.nema.org/resources/terminologies/DICOM',
            code: '110153',
            display: 'Source Role ID'
          }]
        },
        who: {
          reference: 'Device/emr-portal',
          display: 'EMR Portal System'
        },
        requestor: false
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
          reference: 'System/emr-portal'
        },
        detail: [{
          type: 'System',
          valueString: details.details || eventType
        }]
      }]
    })

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Log authentication events
  logAuthenticationEvent(eventType, userInfo, success = true, details = {}) {
    const auditEvent = new AuditEventResource({
      type: 'rest',
      typeDisplay: 'Authentication',
      action: 'E', // Execute
      outcome: success ? '0' : '8',
      outcomeDesc: success ? 'Authentication successful' : 'Authentication failed',
      agent: [{
        type: {
          coding: [{
            system: 'http://dicom.nema.org/resources/terminologies/DICOM',
            code: 'humanuser',
            display: 'Human User'
          }]
        },
        who: {
          reference: `Practitioner/${userInfo.id}`,
          display: userInfo.name
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
          reference: 'System/authentication'
        },
        detail: [{
          type: 'Authentication',
          valueString: details.details || `${eventType} for user ${userInfo.name}`
        }]
      }]
    })

    this.addAuditEvent(auditEvent)
    return auditEvent
  }

  // Add audit event to logs
  addAuditEvent(auditEvent) {
    this.auditLogs.push(auditEvent)
    auditLogManager.addAuditEvent(auditEvent)
    
    // Clean up old logs based on retention policy
    this.cleanupOldLogs()
    
    // In production, this would also send to a secure audit log service
    console.log('Audit Event Logged:', {
      id: auditEvent.id,
      type: auditEvent.type.code,
      action: auditEvent.action,
      timestamp: auditEvent.recorded,
      outcome: auditEvent.outcome,
      description: auditEvent.outcomeDesc
    })
  }

  // Get audit logs with filtering
  getAuditLogs(filters = {}) {
    return auditLogManager.getAuditLogs(
      filters.patientId,
      filters.doctorId,
      filters.startDate,
      filters.endDate
    )
  }

  // Get patient-specific audit summary
  getPatientAuditSummary(patientId) {
    return auditLogManager.getPatientAuditSummary(patientId)
  }

  // Get audit logs for compliance reporting
  getComplianceReport(startDate, endDate, includeSystemEvents = false) {
    const logs = this.getAuditLogs({
      startDate,
      endDate
    })

    if (!includeSystemEvents) {
      return logs.filter(log => 
        !log.agent.some(agent => 
          agent.who?.reference?.includes('Device/')
        )
      )
    }

    return logs
  }

  // Calculate changes between versions
  calculateChanges(previousVersion, currentData) {
    if (!previousVersion) return ['Initial creation']
    
    const changes = []
    const fields = ['name', 'age', 'gender', 'contact']
    
    fields.forEach(field => {
      if (previousVersion[field] !== currentData[field]) {
        changes.push(`${field}: "${previousVersion[field]}" → "${currentData[field]}"`)
      }
    })
    
    return changes.length > 0 ? changes : ['No changes detected']
  }

  // Clean up old logs based on retention policy
  cleanupOldLogs() {
    const cutoffDate = new Date(Date.now() - this.retentionPeriod)
    this.auditLogs = this.auditLogs.filter(log => 
      new Date(log.recorded) > cutoffDate
    )
  }

  // Export audit logs for external systems
  exportAuditLogs(format = 'json', filters = {}) {
    const logs = this.getAuditLogs(filters)
    
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(logs, null, 2)
      case 'csv':
        return this.convertToCSV(logs)
      case 'xml':
        return this.convertToXML(logs)
      default:
        return logs
    }
  }

  // Convert logs to CSV format
  convertToCSV(logs) {
    if (logs.length === 0) return 'No audit logs found'
    
    const headers = ['Timestamp', 'Event Type', 'Action', 'Outcome', 'Description', 'User', 'Patient ID']
    const rows = logs.map(log => [
      log.recorded,
      log.type.display,
      log.action,
      log.outcome,
      log.outcomeDesc || '',
      log.agent[0]?.who?.display || 'Unknown',
      log.entity[0]?.what?.reference?.split('/')[1] || 'N/A'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Convert logs to XML format
  convertToXML(logs) {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
    const auditLogsElement = logs.map(log => `
  <AuditEvent>
    <id>${log.id}</id>
    <timestamp>${log.recorded}</timestamp>
    <type>${log.type.display}</type>
    <action>${log.action}</action>
    <outcome>${log.outcome}</outcome>
    <description>${log.outcomeDesc || ''}</description>
    <user>${log.agent[0]?.who?.display || 'Unknown'}</user>
    <patientId>${log.entity[0]?.what?.reference?.split('/')[1] || 'N/A'}</patientId>
  </AuditEvent>`).join('')
    
    return `${xmlHeader}\n<AuditLogs>${auditLogsElement}\n</AuditLogs>`
  }

  // Get audit statistics
  getAuditStatistics(startDate = null, endDate = null) {
    const logs = this.getAuditLogs({ startDate, endDate })
    
    const stats = {
      totalEvents: logs.length,
      eventsByType: {},
      eventsByAction: {},
      eventsByOutcome: {},
      eventsByUser: {},
      timeRange: {
        start: logs.length > 0 ? logs[logs.length - 1].recorded : null,
        end: logs.length > 0 ? logs[0].recorded : null
      }
    }
    
    logs.forEach(log => {
      // Count by event type
      const eventType = log.type.code
      stats.eventsByType[eventType] = (stats.eventsByType[eventType] || 0) + 1
      
      // Count by action
      const action = log.action
      stats.eventsByAction[action] = (stats.eventsByAction[action] || 0) + 1
      
      // Count by outcome
      const outcome = log.outcome
      stats.eventsByOutcome[outcome] = (stats.eventsByOutcome[outcome] || 0) + 1
      
      // Count by user
      const user = log.agent[0]?.who?.display || 'Unknown'
      stats.eventsByUser[user] = (stats.eventsByUser[user] || 0) + 1
    })
    
    return stats
  }
}

// Export singleton instance
export const auditService = new AuditService()
