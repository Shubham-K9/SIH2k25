// Minimal demo dataset mapping between NAMASTE, ICD11-TM2, and ICD11-BIOMED
// Each entry includes a common label and system-specific codes

export const demoDiagnosis = [
  {
    label: 'Low back pain',
    namaste: { code: 'NAM-0001', label: 'Katishoola (Low back pain)' },
    tm2: { code: 'TM2-FA12.0', label: 'FA12.0 Low back pain' },
    biomed: { code: 'MG30.00', label: 'Low back pain' }
  },
  {
    label: 'Type 2 diabetes mellitus',
    namaste: { code: 'NAM-0002', label: 'Madhumeha (Type 2 diabetes)' },
    tm2: { code: 'TM2-5A11.1', label: '5A11.1 Type 2 diabetes mellitus' },
    biomed: { code: '5A11', label: 'Type 2 diabetes mellitus' }
  },
  {
    label: 'Hypertension',
    namaste: { code: 'NAM-0003', label: 'Raktagata Vata (Hypertension)' },
    tm2: { code: 'TM2-BA00', label: 'BA00 Hypertension' },
    biomed: { code: 'BA00', label: 'Hypertension' }
  },
  {
    label: 'Osteoarthritis knee',
    namaste: { code: 'NAM-0004', label: 'Sandhivata (Knee osteoarthritis)' },
    tm2: { code: 'TM2-MG22.2', label: 'MG22.2 Osteoarthritis of knee' },
    biomed: { code: 'FA01.00', label: 'Primary osteoarthritis of knee' }
  },
  {
    label: 'Migraine',
    namaste: { code: 'NAM-0005', label: 'Ardhavabhedaka (Migraine)' },
    tm2: { code: 'TM2-8A80.0', label: '8A80.0 Migraine' },
    biomed: { code: '8A80', label: 'Migraine' }
  }
]

export function demoSuggest(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q || q.length < 2) return []
  const results = []
  for (const row of demoDiagnosis) {
    const hay = [
      row.label,
      row.namaste.code,
      row.namaste.label,
      row.tm2.code,
      row.tm2.label,
      row.biomed.code,
      row.biomed.label
    ]
      .filter(Boolean)
      .join(' | ')
      .toLowerCase()
    if (hay.includes(q)) {
      results.push(
        { system: 'NAMASTE', code: row.namaste.code, label: row.namaste.label },
        { system: 'ICD11-TM2', code: row.tm2.code, label: row.tm2.label },
        { system: 'ICD11-BIOMED', code: row.biomed.code, label: row.biomed.label }
      )
    }
  }
  if (results.length) return results

  // If no matches found in demo data, return a generic trio using the query text
  return [
    { system: 'NAMASTE', code: 'NAM-DEMO', label: `Namaste: ${query}` },
    { system: 'ICD11-TM2', code: 'TM2-DEMO', label: `ICD-11 TM2: ${query}` },
    { system: 'ICD11-BIOMED', code: 'BIO-DEMO', label: `ICD-11 (Biomed): ${query}` }
  ]
}


