import React from 'react'
import { RAGCategory } from '../types'

interface SidebarProps {
  selectedCategory: RAGCategory
  onCategorySelect: (category: RAGCategory) => void
}

const RAG_CATEGORIES: Array<{ id: RAGCategory; label: string; description: string }> = [
  { id: null, label: 'All Categories', description: 'Search across all knowledge bases' },
  { id: 'medical', label: 'Medical', description: 'Emergency care, injuries, illness' },
  { id: 'food_water', label: 'Food & Water', description: 'Safety, purification, storage' },
  { id: 'shelter', label: 'Shelter', description: 'Environmental protection, safety' },
  { id: 'security', label: 'Security', description: 'Personal safety, threat avoidance' },
  { id: 'tools', label: 'Tools', description: 'Tool safety, maintenance, repairs' },
  { id: 'navigation', label: 'Navigation', description: 'Orientation, route planning' },
  { id: 'communication', label: 'Communication', description: 'Signaling, protocols' },
  { id: 'psychology', label: 'Psychology', description: 'Mental health, stress management' },
]

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <aside className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col">
      <div className="p-4 border-b border-charcoal-800">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
          Knowledge Base
        </h2>
        <p className="text-xs text-text-muted">
          Select category to filter
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <ul className="space-y-1">
          {RAG_CATEGORIES.map((category) => (
            <li key={category.id || 'all'}>
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-md transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-amber-muted/20 text-amber-muted border-l-2 border-amber-muted'
                    : 'text-text-secondary hover:bg-charcoal-800 hover:text-text-primary'
                  }
                `}
              >
                <div className="font-medium text-sm">{category.label}</div>
                <div className="text-xs text-text-muted mt-0.5">
                  {category.description}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-charcoal-800">
        <div className="bg-charcoal-800/50 rounded-md p-3 border border-charcoal-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber-muted rounded-full"></div>
            <span className="text-xs font-semibold text-amber-muted uppercase tracking-wider">
              System Status
            </span>
          </div>
          <p className="text-xs text-text-muted">
            All knowledge bases loaded and operational. System running in offline mode.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

