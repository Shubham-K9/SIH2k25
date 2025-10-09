import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import DiagnosisAutocomplete from '../components/DiagnosisAutocomplete.jsx'
import { codeSearchService } from '../services/codeSearchService.js'

export default function Diagnosis() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [ayushSystems, setAyushSystems] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    ayushSystem: ''
  })

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      const [categoriesData, ayushSystemsData] = await Promise.all([
        codeSearchService.getCategories(),
        codeSearchService.getAyushSystems()
      ])
      setCategories(categoriesData)
      setAyushSystems(ayushSystemsData)
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }

  function handleDiagnosisSelect(suggestion) {
    try {
      setError('')
      
      // Check if already selected
      const isAlreadySelected = selected.some(item => 
        item.namasteCode === suggestion.namasteCode
      )
      
      if (isAlreadySelected) {
        setError('This diagnosis code is already selected.')
        return
      }

      // Add to selected list
      const newSelection = {
        id: suggestion.id,
        namasteCode: suggestion.namasteCode,
        namasteLabel: suggestion.namasteLabel,
        namasteDescription: suggestion.namasteDescription,
        icd11Code: suggestion.icd11Code,
        icd11Label: suggestion.icd11Label,
        icd11Description: suggestion.icd11Description,
        category: suggestion.category,
        ayushSystem: suggestion.ayushSystem,
        confidenceScore: suggestion.confidenceScore,
        selectedAt: new Date().toISOString()
      }

      setSelected(prev => [...prev, newSelection])
      setQuery('') // Clear the input
    } catch (e) {
      console.error('Error adding selection:', e)
      setError('Something went wrong while adding the diagnosis.')
    }
  }

  function handleRemoveSelection(index) {
    setSelected(prev => prev.filter((_, i) => i !== index))
  }

  function handleClearAll() {
    setSelected([])
    setError('')
  }

  function handleFilterChange(filterType, value) {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  function getConfidenceBadge(score) {
    if (score >= 0.9) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">High Confidence</span>
    } else if (score >= 0.7) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium Confidence</span>
    } else {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low Confidence</span>
    }
  }

  function formatConfidencePercent(score) {
    const pct = Math.round((Number(score || 0) * 100))
    return isNaN(pct) ? 0 : pct
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Diagnosis Entry</h2>
          <p className="mt-2 text-gray-600">
            Search and select diagnosis codes using NAMASTE-ICD11 mapping system
          </p>
        </div>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Diagnosis Codes</h3>
            
            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Search for diagnosis</label>
                <DiagnosisAutocomplete
                  value={query}
                  onChange={setQuery}
                  onSelect={handleDiagnosisSelect}
                  placeholder="Type to search diagnosis codes..."
                  showFilters={true}
                  category={filters.category}
                  ayushSystem={filters.ayushSystem}
                />
                <div className="mt-2 text-xs text-gray-600">
                  Search by NAMASTE code, label, or ICD-11 code. Minimum 2 characters required.
                </div>
              </div>

              {/* Quick Search Buttons */}
              <div>
                <label className="label text-sm">Quick Search</label>
                <div className="flex flex-wrap gap-2">
                  {['back pain', 'diabetes', 'hypertension', 'knee pain', 'migraine', 'fever', 'cough', 'headache'].map((term) => (
                    <button
                      key={term}
                      className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Diagnoses */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Diagnoses ({selected.length})
              </h3>
              {selected.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {selected.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>No diagnoses selected yet. Search and select diagnosis codes above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selected.map((diagnosis, index) => (
                  <div key={`${diagnosis.namasteCode}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{diagnosis.namasteLabel}</h4>
                          {getConfidenceBadge(diagnosis.confidenceScore)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">NAMASTE Code:</span>
                            <span className="ml-2 text-gray-900">{diagnosis.namasteCode}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">ICD-11 Code:</span>
                            <span className="ml-2 text-gray-900">{diagnosis.icd11Code}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">ICD-11 Label:</span>
                            <span className="ml-2 text-gray-900">{diagnosis.icd11Label}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Category:</span>
                            <span className="ml-2 text-gray-900">{diagnosis.category || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-600">Accuracy:</span>
                          <div className="h-2 w-40 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${formatConfidencePercent(diagnosis.confidenceScore)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{formatConfidencePercent(diagnosis.confidenceScore)}%</span>
                        </div>

                        {diagnosis.namasteDescription && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {diagnosis.namasteDescription}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          {diagnosis.ayushSystem && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {diagnosis.ayushSystem}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            Selected: {new Date(diagnosis.selectedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveSelection(index)}
                        className="ml-4 text-red-600 hover:text-red-800 p-1"
                        title="Remove diagnosis"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selected.length > 0 && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Diagnosis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Total Diagnoses:</span>
                  <span className="ml-2 text-blue-900">{selected.length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">High Confidence:</span>
                  <span className="ml-2 text-blue-900">
                    {selected.filter(d => d.confidenceScore >= 0.9).length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Categories:</span>
                  <span className="ml-2 text-blue-900">
                    {[...new Set(selected.map(d => d.category).filter(Boolean))].length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



