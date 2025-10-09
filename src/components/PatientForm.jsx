import React, { useState } from 'react'

export default function PatientForm({ onSubmit, initialData = null, isEdit = false }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || 'Male',
    contact: initialData?.contact || '',
    address: initialData?.address || '',
    emergencyContact: initialData?.emergencyContact || '',
    medicalHistory: initialData?.medicalHistory || '',
    allergies: initialData?.allergies || '',
    consentDataCollection: initialData?.consentDataCollection || false,
    consentDataSharing: initialData?.consentDataSharing || false,
    consentResearch: initialData?.consentResearch || false,
    consentMarketing: initialData?.consentMarketing || false,
    preferredLanguage: initialData?.preferredLanguage || 'English',
    religion: initialData?.religion || '',
    occupation: initialData?.occupation || '',
    maritalStatus: initialData?.maritalStatus || 'Single'
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    const ageNum = Number(form.age)
    if (!form.age) e.age = 'Age is required'
    else if (Number.isNaN(ageNum) || ageNum <= 0 || ageNum > 120) e.age = 'Enter a valid age'
    if (!['Male', 'Female', 'Other'].includes(form.gender)) e.gender = 'Select gender'
    if (!form.contact.trim() || !/^[0-9+\-\s()]{7,15}$/.test(form.contact)) e.contact = 'Enter valid contact'
    if (!form.consentDataCollection) e.consentDataCollection = 'Data collection consent is required'
    if (!form.emergencyContact.trim()) e.emergencyContact = 'Emergency contact is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    
    const formData = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      contact: form.contact.trim(),
      address: form.address.trim(),
      emergencyContact: form.emergencyContact.trim(),
      medicalHistory: form.medicalHistory.trim(),
      allergies: form.allergies.trim(),
      consentDataCollection: form.consentDataCollection,
      consentDataSharing: form.consentDataSharing,
      consentResearch: form.consentResearch,
      consentMarketing: form.consentMarketing,
      preferredLanguage: form.preferredLanguage,
      religion: form.religion.trim(),
      occupation: form.occupation.trim(),
      maritalStatus: form.maritalStatus
    }
    
    onSubmit?.(formData)
    
    if (!isEdit) {
      setForm({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        allergies: '',
        consentDataCollection: false,
        consentDataSharing: false,
        consentResearch: false,
        consentMarketing: false,
        preferredLanguage: 'English',
        religion: '',
        occupation: '',
        maritalStatus: 'Single'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Patient name" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Age *</label>
            <input name="age" value={form.age} onChange={handleChange} className="input" placeholder="Age" type="number" />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Gender *</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>
          <div>
            <label className="label">Marital Status</label>
            <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input">
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Contact Number *</label>
            <input name="contact" value={form.contact} onChange={handleChange} className="input" placeholder="Phone number" />
            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
          </div>
          <div>
            <label className="label">Emergency Contact *</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="input" placeholder="Emergency contact number" />
            {errors.emergencyContact && <p className="mt-1 text-sm text-red-600">{errors.emergencyContact}</p>}
          </div>
        </div>
        
        <div>
          <label className="label">Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} className="input" rows="3" placeholder="Full address" />
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
        <div>
          <label className="label">Medical History</label>
          <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} className="input" rows="3" placeholder="Previous medical conditions, surgeries, etc." />
        </div>
        <div>
          <label className="label">Allergies</label>
          <textarea name="allergies" value={form.allergies} onChange={handleChange} className="input" rows="2" placeholder="Known allergies and reactions" />
        </div>
      </div>

      {/* Demographics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Preferred Language</label>
            <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} className="input">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Marathi</option>
              <option>Gujarati</option>
              <option>Kannada</option>
              <option>Malayalam</option>
              <option>Punjabi</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="label">Religion</label>
            <select name="religion" value={form.religion} onChange={handleChange} className="input">
              <option value="">Select Religion</option>
              <option>Hinduism</option>
              <option>Islam</option>
              <option>Christianity</option>
              <option>Sikhism</option>
              <option>Buddhism</option>
              <option>Jainism</option>
              <option>Other</option>
              <option>None</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Occupation</label>
          <input name="occupation" value={form.occupation} onChange={handleChange} className="input" placeholder="Occupation" />
        </div>
      </div>

      {/* Consent Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Consent & Privacy</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consentDataCollection"
                name="consentDataCollection"
                type="checkbox"
                checked={form.consentDataCollection}
                onChange={handleChange}
                className="focus:ring-brand h-4 w-4 text-brand border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consentDataCollection" className="font-medium text-gray-700">
                Data Collection Consent *
              </label>
              <p className="text-gray-500">I consent to the collection and storage of my personal and medical data for healthcare purposes.</p>
              {errors.consentDataCollection && <p className="mt-1 text-sm text-red-600">{errors.consentDataCollection}</p>}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consentDataSharing"
                name="consentDataSharing"
                type="checkbox"
                checked={form.consentDataSharing}
                onChange={handleChange}
                className="focus:ring-brand h-4 w-4 text-brand border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consentDataSharing" className="font-medium text-gray-700">
                Data Sharing Consent
              </label>
              <p className="text-gray-500">I consent to sharing my data with other healthcare providers for continuity of care.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consentResearch"
                name="consentResearch"
                type="checkbox"
                checked={form.consentResearch}
                onChange={handleChange}
                className="focus:ring-brand h-4 w-4 text-brand border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consentResearch" className="font-medium text-gray-700">
                Research Consent
              </label>
              <p className="text-gray-500">I consent to my anonymized data being used for medical research and public health studies.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consentMarketing"
                name="consentMarketing"
                type="checkbox"
                checked={form.consentMarketing}
                onChange={handleChange}
                className="focus:ring-brand h-4 w-4 text-brand border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consentMarketing" className="font-medium text-gray-700">
                Marketing Consent
              </label>
              <p className="text-gray-500">I consent to receive health-related information and updates via SMS/email.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button type="button" className="btn bg-gray-300 text-gray-700 hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Patient' : 'Save Patient'}
          </button>
        </div>
      </div>
    </form>
  )
}


