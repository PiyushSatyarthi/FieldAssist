import React from 'react'
import { RAGCategory } from '../types'

interface TriggerAlertProps {
  target: RAGCategory
  reason: string
  onSwitch: (category: RAGCategory) => void
}

const TriggerAlert: React.FC<TriggerAlertProps> = ({ target, reason, onSwitch }) => {
  const categoryLabels: Record<string, string> = {
    medical: 'Medical',
    food_water: 'Food & Water',
    shelter: 'Shelter',
    security: 'Security',
    tools: 'Tools',
    navigation: 'Navigation',
    communication: 'Communication',
    psychology: 'Psychology',
  }

  const handleSwitch = () => {
    onSwitch(target)
    // Scroll to top of query input
    document.getElementById('query-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (!target) return null

  return (
    <div className="bg-amber-muted/10 border-l-4 border-amber-muted rounded-md p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-amber-muted text-xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-muted mb-1">
            Escalation Required
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            {reason}
          </p>
          <button
            onClick={handleSwitch}
            className="
              px-4 py-2
              bg-amber-muted hover:bg-amber-warning
              text-charcoal-950 font-semibold text-sm
              rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-amber-muted focus:ring-offset-2 focus:ring-offset-charcoal-900
            "
          >
            Switch to {categoryLabels[target] || target} Knowledge Base
          </button>
        </div>
      </div>
    </div>
  )
}

export default TriggerAlert

