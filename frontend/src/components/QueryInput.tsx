import React, { KeyboardEvent } from 'react'
import { RAGCategory } from '../types'

interface QueryInputProps {
  query: string
  onQueryChange: (query: string) => void
  onQuerySubmit: (query: string) => void
  isLoading: boolean
  selectedCategory: RAGCategory
}

const QueryInput: React.FC<QueryInputProps> = ({
  query,
  onQueryChange,
  onQuerySubmit,
  isLoading,
  selectedCategory,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && query.trim()) {
        onQuerySubmit(query)
      }
    }
  }

  const handleSubmit = () => {
    if (!isLoading && query.trim()) {
      onQuerySubmit(query)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="query-input" className="block text-sm font-semibold text-text-primary mb-2">
          Query Critical Information
        </label>
        {selectedCategory && (
          <div className="mb-2 text-xs text-text-muted">
            Filtering: <span className="text-amber-muted font-medium">{getCategoryLabel(selectedCategory)}</span>
          </div>
        )}
        <textarea
          id="query-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe the emergency or situation requiring guidance..."
          className="
            w-full h-32 px-4 py-3
            bg-charcoal-900 border border-charcoal-700 rounded-md
            text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-amber-muted focus:border-amber-muted
            resize-none
            font-sans text-base
          "
          disabled={isLoading}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading || !query.trim()}
        className="
          w-full px-6 py-3
          bg-amber-muted hover:bg-amber-warning
          disabled:bg-charcoal-700 disabled:cursor-not-allowed
          text-charcoal-950 font-semibold
          rounded-md transition-colors
          focus:outline-none focus:ring-2 focus:ring-amber-muted focus:ring-offset-2 focus:ring-offset-charcoal-950
        "
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : (
          'Retrieve Critical Guidance'
        )}
      </button>
      
      <div className="text-xs text-text-muted">
        <p>Press Enter to submit, Shift+Enter for new line</p>
      </div>
    </div>
  )
}

function getCategoryLabel(category: RAGCategory): string {
  const labels: Record<string, string> = {
    medical: 'Medical',
    food_water: 'Food & Water',
    shelter: 'Shelter',
    security: 'Security',
    tools: 'Tools',
    navigation: 'Navigation',
    communication: 'Communication',
    psychology: 'Psychology',
  }
  return labels[category || ''] || 'All Categories'
}

export default QueryInput

