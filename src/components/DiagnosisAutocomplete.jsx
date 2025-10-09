import React, { useState, useEffect, useRef } from 'react'
import { codeSearchService } from '../services/codeSearchService.js'
import { codeSearchServiceFallback } from '../services/codeSearchServiceFallback.js'

export default function DiagnosisAutocomplete({ 
  value = '', 
  onChange, 
  onSelect, 
  placeholder = 'Search diagnosis...',
  className = '',
  disabled = false,
  showFilters = true,
  category = '',
  ayushSystem = ''
}) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [categories, setCategories] = useState([])
  const [ayushSystems, setAyushSystems] = useState([])
  const [filters, setFilters] = useState({
    category: category,
    ayushSystem: ayushSystem
  })

  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Load categories and AYUSH systems on mount
  useEffect(() => {
    loadFilters()
  }, [])

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      searchSuggestions()
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query, filters])

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  async function loadFilters() {
    try {
      const [categoriesData, ayushSystemsData] = await Promise.all([
        codeSearchService.getCategories(),
        codeSearchService.getAyushSystems()
      ])
      setCategories(categoriesData)
      setAyushSystems(ayushSystemsData)
    } catch (error) {
      console.error('Error loading filters, using fallback:', error)
      // Use fallback service
      try {
        const [categoriesData, ayushSystemsData] = await Promise.all([
          codeSearchServiceFallback.getCategories(),
          codeSearchServiceFallback.getAyushSystems()
        ])
        setCategories(categoriesData)
        setAyushSystems(ayushSystemsData)
      } catch (fallbackError) {
        console.error('Fallback service also failed:', fallbackError)
      }
    }
  }

  async function searchSuggestions() {
    if (!query || query.length < 2) return

    setIsLoading(true)
    try {
      let results = await codeSearchService.getDebouncedSuggestions(query, {
        category: filters.category,
        ayushSystem: filters.ayushSystem,
        limit: 8
      })

      // If backend returns no results, fall back to mock data for better UX
      if (!Array.isArray(results) || results.length === 0) {
        results = await codeSearchServiceFallback.getDebouncedSuggestions(query, {
          category: filters.category,
          ayushSystem: filters.ayushSystem,
          limit: 8
        })
      }

      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error searching suggestions, using fallback:', error)
      // Use fallback service
      try {
        const results = await codeSearchServiceFallback.getDebouncedSuggestions(query, {
          category: filters.category,
          ayushSystem: filters.ayushSystem,
          limit: 8
        })
        setSuggestions(results)
        setShowSuggestions(true)
        setSelectedIndex(-1)
      } catch (fallbackError) {
        console.error('Fallback service also failed:', fallbackError)
        setSuggestions([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputChange(e) {
    const newQuery = e.target.value
    setQuery(newQuery)
    onChange?.(newQuery)
  }

  function handleSuggestionSelect(suggestion) {
    setQuery(suggestion.displayText)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onSelect?.(suggestion)
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  function handleInputFocus() {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  function handleInputBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  function handleFilterChange(filterType, value) {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
  }

  function clearFilters() {
    setFilters({ category: '', ayushSystem: '' })
  }

  function getConfidenceBadge(score) {
    if (score >= 0.9) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">High</span>
    } else if (score >= 0.7) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
    } else {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low</span>
    }
  }

  function formatConfidencePercent(score) {
    const pct = Math.round((Number(score || 0) * 100))
    return isNaN(pct) ? 0 : pct
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="input w-full pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand"></div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={filters.ayushSystem}
            onChange={(e) => handleFilterChange('ayushSystem', e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="">All AYUSH Systems</option>
            {ayushSystems.map(system => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
          
          {(filters.category || filters.ayushSystem) && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex 
                  ? 'bg-brand text-white' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {suggestion.namasteLabel}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({suggestion.namasteCode})
                    </span>
                    {getConfidenceBadge(suggestion.confidenceScore)}
                    <span className={`text-[10px] ${index === selectedIndex ? 'text-white/90' : 'text-gray-500'}`}>{formatConfidencePercent(suggestion.confidenceScore)}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {suggestion.icd11Label} ({suggestion.icd11Code})
                  </div>
                  {suggestion.namasteDescription && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {suggestion.namasteDescription}
                    </div>
                  )}
                  <div className={`mt-2 h-1.5 w-full rounded-full ${index === selectedIndex ? 'bg-white/30' : 'bg-gray-200'}`}>
                    <div
                      className={`h-1.5 rounded-full ${index === selectedIndex ? 'bg-white' : 'bg-emerald-500'}`}
                      style={{ width: `${formatConfidencePercent(suggestion.confidenceScore)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {suggestion.category && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {suggestion.category}
                      </span>
                    )}
                    {suggestion.ayushSystem && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {suggestion.ayushSystem}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No diagnosis codes found for "{query}"
        </div>
      )}
    </div>
  )
}
