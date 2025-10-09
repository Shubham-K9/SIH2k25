// Fallback Code Search Service
// Works without backend connection using mock data

export class CodeSearchServiceFallback {
  constructor() {
    this.mockData = [
      {
        id: '1',
        namaste_code: 'NAMASTE001',
        namaste_label: 'Back Pain',
        namaste_description: 'Pain in the back region, including lower back pain',
        icd11_code: 'ME84.0',
        icd11_label: 'Back pain',
        icd11_description: 'Pain in the back',
        category: 'Musculoskeletal',
        ayush_system: 'Ayurveda',
        confidence_score: 0.95,
        is_active: true
      },
      {
        id: '2',
        namaste_code: 'NAMASTE002',
        namaste_label: 'Headache',
        namaste_description: 'Pain in the head, including migraine and tension headache',
        icd11_code: 'ME84.1',
        icd11_label: 'Headache',
        icd11_description: 'Pain in the head',
        category: 'Neurological',
        ayush_system: 'Ayurveda',
        confidence_score: 0.90,
        is_active: true
      },
      {
        id: '3',
        namaste_code: 'NAMASTE003',
        namaste_label: 'Diabetes',
        namaste_description: 'High blood sugar levels, including Type 1 and Type 2 diabetes',
        icd11_code: '5A10',
        icd11_label: 'Type 1 diabetes mellitus',
        icd11_description: 'Type 1 diabetes mellitus',
        category: 'Endocrine',
        ayush_system: 'Ayurveda',
        confidence_score: 0.88,
        is_active: true
      },
      {
        id: '4',
        namaste_code: 'NAMASTE004',
        namaste_label: 'Hypertension',
        namaste_description: 'High blood pressure',
        icd11_code: 'BA00',
        icd11_label: 'Essential hypertension',
        icd11_description: 'Essential hypertension',
        category: 'Cardiovascular',
        ayush_system: 'Ayurveda',
        confidence_score: 0.92,
        is_active: true
      },
      {
        id: '5',
        namaste_code: 'NAMASTE005',
        namaste_label: 'Knee Pain',
        namaste_description: 'Pain in the knee joint, including arthritis',
        icd11_code: 'ME84.2',
        icd11_label: 'Knee pain',
        icd11_description: 'Pain in the knee',
        category: 'Musculoskeletal',
        ayush_system: 'Ayurveda',
        confidence_score: 0.87,
        is_active: true
      },
      {
        id: '6',
        namaste_code: 'NAMASTE006',
        namaste_label: 'Fever',
        namaste_description: 'Elevated body temperature',
        icd11_code: 'MD11',
        icd11_label: 'Fever',
        icd11_description: 'Elevated body temperature',
        category: 'General',
        ayush_system: 'Ayurveda',
        confidence_score: 0.85,
        is_active: true
      },
      {
        id: '7',
        namaste_code: 'NAMASTE007',
        namaste_label: 'Cough',
        namaste_description: 'Persistent cough, including dry and productive cough',
        icd11_code: 'MD12',
        icd11_label: 'Cough',
        icd11_description: 'Persistent cough',
        category: 'Respiratory',
        ayush_system: 'Ayurveda',
        confidence_score: 0.83,
        is_active: true
      },
      {
        id: '8',
        namaste_code: 'NAMASTE008',
        namaste_label: 'Migraine',
        namaste_description: 'Severe headache with nausea and sensitivity to light',
        icd11_code: 'ME84.3',
        icd11_label: 'Migraine',
        icd11_description: 'Severe headache with aura',
        category: 'Neurological',
        ayush_system: 'Ayurveda',
        confidence_score: 0.91,
        is_active: true
      }
    ]
    
    this.categories = ['Musculoskeletal', 'Neurological', 'Endocrine', 'Cardiovascular', 'Respiratory', 'General']
    this.ayushSystems = ['Ayurveda', 'Yoga', 'Naturopathy', 'Homeopathy', 'Siddha', 'Unani']
  }

  async searchCodes(query, options = {}) {
    const { category = '', ayushSystem = '', limit = 10 } = options
    
    let results = this.mockData
    
    if (query) {
      results = results.filter(item => 
        item.namaste_label.toLowerCase().includes(query.toLowerCase()) ||
        item.namaste_code.toLowerCase().includes(query.toLowerCase()) ||
        item.icd11_label.toLowerCase().includes(query.toLowerCase()) ||
        item.icd11_code.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    if (category) {
      results = results.filter(item => item.category === category)
    }
    
    if (ayushSystem) {
      results = results.filter(item => item.ayush_system === ayushSystem)
    }
    
    results = results.slice(0, limit)
    
    return {
      message: 'Search completed successfully (Fallback Mode)',
      results,
      count: results.length,
      query: { search: query, category, ayush_system: ayushSystem, limit }
    }
  }

  async getAutocompleteSuggestions(query, options = {}) {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const response = await this.searchCodes(query, {
        ...options,
        limit: 8
      })

      return response.results.map(item => ({
        id: item.id,
        namasteCode: item.namaste_code,
        namasteLabel: item.namaste_label,
        namasteDescription: item.namaste_description,
        icd11Code: item.icd11_code,
        icd11Label: item.icd11_label,
        icd11Description: item.icd11_description,
        category: item.category,
        ayushSystem: item.ayush_system,
        confidenceScore: item.confidence_score,
        displayText: `${item.namaste_label} (${item.namaste_code})`,
        fullText: `${item.namaste_label} - ${item.icd11_label} (${item.icd11_code})`
      }))
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error)
      return []
    }
  }

  async getCategories() {
    return this.categories
  }

  async getAyushSystems() {
    return this.ayushSystems
  }

  // Debounced search for better performance
  debounceSearch(func, delay = 300) {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func.apply(this, args)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, delay)
      })
    }
  }

  getDebouncedSuggestions = this.debounceSearch(this.getAutocompleteSuggestions, 300)
}

// Export singleton instance
export const codeSearchServiceFallback = new CodeSearchServiceFallback()
