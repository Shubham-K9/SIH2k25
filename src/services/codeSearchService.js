// Code Search Service for NAMASTE-ICD11 Mapping System
// Connects frontend with backend API for diagnosis code autocomplete

import api from './apiClient.js'

export class CodeSearchService {
  constructor() {
    // Base API path is already set to '/api' in apiClient. Avoid duplicating '/api' here.
    this.baseURL = '/codes'
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Search for diagnosis codes with autocomplete
  async searchCodes(query, options = {}) {
    const {
      category = '',
      ayushSystem = '',
      limit = 10,
      useCache = true
    } = options

    // Create cache key
    const cacheKey = `${query}-${category}-${ayushSystem}-${limit}`
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      })

      if (category) params.append('category', category)
      if (ayushSystem) params.append('ayush_system', ayushSystem)

      const response = await api.get(`${this.baseURL}/search?${params}`)
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })

      return response.data
    } catch (error) {
      console.error('Error searching codes:', error)
      throw new Error('Failed to search diagnosis codes')
    }
  }

  // Get autocomplete suggestions for diagnosis input
  async getAutocompleteSuggestions(query, options = {}) {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const response = await this.searchCodes(query, {
        ...options,
        limit: 8 // Limit for autocomplete
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

  // Get code by NAMASTE code
  async getCodeByNamaste(namasteCode) {
    try {
      const response = await api.get(`${this.baseURL}/namaste/${namasteCode}`)
      return response.data.data
    } catch (error) {
      console.error('Error getting code by NAMASTE:', error)
      throw new Error('Failed to get code details')
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const response = await api.get(`${this.baseURL}/categories`)
      return response.data.data
    } catch (error) {
      console.error('Error getting categories:', error)
      return []
    }
  }

  // Get all AYUSH systems
  async getAyushSystems() {
    try {
      const response = await api.get(`${this.baseURL}/ayush-systems`)
      return response.data.data
    } catch (error) {
      console.error('Error getting AYUSH systems:', error)
      return []
    }
  }

  // Get code mappings with pagination
  async getCodeMappings(options = {}) {
    const {
      page = 1,
      limit = 20,
      category = '',
      ayushSystem = ''
    } = options

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (category) params.append('category', category)
      if (ayushSystem) params.append('ayush_system', ayushSystem)

      const response = await api.get(`${this.baseURL}?${params}`)
      return response.data
    } catch (error) {
      console.error('Error getting code mappings:', error)
      throw new Error('Failed to get code mappings')
    }
  }

  // Get mapping statistics (admin only)
  async getMappingStats() {
    try {
      const response = await api.get(`${this.baseURL}/stats/overview`)
      return response.data.data
    } catch (error) {
      console.error('Error getting mapping stats:', error)
      throw new Error('Failed to get mapping statistics')
    }
  }

  // Create new code mapping (admin only)
  async createCodeMapping(mappingData) {
    try {
      const response = await api.post(`${this.baseURL}`, mappingData)
      return response.data.data
    } catch (error) {
      console.error('Error creating code mapping:', error)
      throw new Error('Failed to create code mapping')
    }
  }

  // Update code mapping (admin only)
  async updateCodeMapping(id, updateData) {
    try {
      const response = await api.put(`${this.baseURL}/${id}`, updateData)
      return response.data.data
    } catch (error) {
      console.error('Error updating code mapping:', error)
      throw new Error('Failed to update code mapping')
    }
  }

  // Delete code mapping (admin only)
  async deleteCodeMapping(id) {
    try {
      const response = await api.delete(`${this.baseURL}/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error deleting code mapping:', error)
      throw new Error('Failed to delete code mapping')
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  // Search with debouncing for better performance
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

  // Get search suggestions with debouncing
  getDebouncedSuggestions = this.debounceSearch(this.getAutocompleteSuggestions, 300)
}

// Export singleton instance
export const codeSearchService = new CodeSearchService()
