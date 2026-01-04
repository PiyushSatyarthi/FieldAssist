import React, { useState, useEffect } from 'react'
import { RAGCategory } from '../types'
import TriggerAlert from './TriggerAlert'

interface ResponsePanelProps {
  response: string
  onCategorySwitch: (category: RAGCategory) => void
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, onCategorySwitch }) => {
  const [parsedSections, setParsedSections] = useState<Array<{ title: string; content: string; isDanger?: boolean; isWarning?: boolean }>>([])
  const [triggers, setTriggers] = useState<Array<{ target: RAGCategory; reason: string }>>([])

  useEffect(() => {
    parseResponse(response)
  }, [response])

  const parseResponse = (text: string) => {
    const sections: Array<{ title: string; content: string; isDanger?: boolean; isWarning?: boolean }> = []
    const foundTriggers: Array<{ target: RAGCategory; reason: string }> = []

    // Extract cross-RAG triggers
    const triggerPattern = /→\s*(Medical|Food\s*&\s*Water|Shelter|Security|Tools|Navigation|Communication|Psychology)\s*RAG/gi
    const triggerMatches = [...text.matchAll(triggerPattern)]
    triggerMatches.forEach(match => {
      const target = normalizeCategory(match[1])
      if (target) {
        foundTriggers.push({
          target,
          reason: `Response references ${match[1]} knowledge base`
        })
      }
    })

    // Parse sections
    const sectionHeaders = [
      'WHEN TO USE THIS GUIDE',
      'IMMEDIATE PRIORITIES',
      'IMMEDIATE DANGERS',
      'STEP-BY-STEP ACTIONS',
      'FOR SPECIFIC',
      'VITAL SIGNS TO CHECK',
      'WHEN PROFESSIONAL HELP IS UNAVAILABLE',
      'LONG-TERM CARE',
      'PREVENTION',
      'REALISTIC EXPECTATIONS',
      'DO NOT',
    ]

    let currentSection: { title: string; content: string; isDanger?: boolean; isWarning?: boolean } | null = null
    const lines = text.split('\n')

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Check if this line is a section header
      const isHeader = sectionHeaders.some(header => 
        trimmedLine.toUpperCase().includes(header) || 
        trimmedLine.toUpperCase().startsWith(header)
      )

      if (isHeader) {
        // Save previous section
        if (currentSection && currentSection.content.trim()) {
          sections.push(currentSection)
        }
        
        // Start new section
        const isDanger = trimmedLine.toUpperCase().includes('IMMEDIATE DANGERS') || 
                        trimmedLine.toUpperCase().includes('DO NOT')
        const isWarning = trimmedLine.toUpperCase().includes('WHEN PROFESSIONAL HELP')
        
        currentSection = {
          title: trimmedLine,
          content: '',
          isDanger,
          isWarning,
        }
      } else if (currentSection) {
        // Add to current section
        if (trimmedLine) {
          currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine
        }
      } else {
        // Content before first section
        if (trimmedLine && !trimmedLine.match(/^(KEYWORDS|SEVERITY|CROSS-RAG)/i)) {
          if (!sections.length || sections[0].title !== 'Introduction') {
            sections.unshift({
              title: 'Introduction',
              content: trimmedLine,
            })
          } else {
            sections[0].content += '\n' + trimmedLine
          }
        }
      }
    })

    // Add last section
    if (currentSection && currentSection.content.trim()) {
      sections.push(currentSection)
    }

    // If no sections found, treat entire response as content
    if (sections.length === 0) {
      sections.push({
        title: 'Response',
        content: text,
      })
    }

    setParsedSections(sections)
    setTriggers(foundTriggers)
  }

  const normalizeCategory = (categoryName: string): RAGCategory => {
    const normalized = categoryName.toLowerCase().replace(/\s+/g, '_')
    const validCategories: RAGCategory[] = [
      'medical',
      'food_water',
      'shelter',
      'security',
      'tools',
      'navigation',
      'communication',
      'psychology',
    ]
    return validCategories.includes(normalized as RAGCategory) ? (normalized as RAGCategory) : null
  }

  const formatContent = (content: string): React.ReactNode => {
    // Split by double newlines for paragraphs
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim())
    
    return paragraphs.map((paragraph, idx) => {
      const lines = paragraph.split('\n').filter(l => l.trim())
      
      return (
        <div key={idx} className="mb-4 last:mb-0">
          {lines.map((line, lineIdx) => {
            // Check for list items
            if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
              return (
                <div key={lineIdx} className="ml-4 mb-1 text-text-secondary">
                  {line}
                </div>
              )
            }
            // Check for bold text (markdown style)
            if (line.includes('**')) {
              const parts = line.split(/(\*\*.*?\*\*)/g)
              return (
                <p key={lineIdx} className="mb-2 text-text-primary leading-relaxed">
                  {parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={partIdx} className="font-semibold text-text-primary">
                          {part.slice(2, -2)}
                        </strong>
                      )
                    }
                    return <span key={partIdx}>{part}</span>
                  })}
                </p>
              )
            }
            return (
              <p key={lineIdx} className="mb-2 text-text-primary leading-relaxed">
                {line}
              </p>
            )
          })}
        </div>
      )
    })
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Cross-RAG Triggers */}
      {triggers.length > 0 && (
        <div className="space-y-3">
          {triggers.map((trigger, idx) => (
            <TriggerAlert
              key={idx}
              target={trigger.target}
              reason={trigger.reason}
              onSwitch={onCategorySwitch}
            />
          ))}
        </div>
      )}

      {/* Response Sections */}
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-lg p-6">
        {parsedSections.map((section, idx) => (
          <div key={idx} className={section.isDanger ? 'danger-section' : section.isWarning ? 'warning-section' : ''}>
            <h2 className="section-header">{section.title}</h2>
            <div className="text-text-primary leading-relaxed">
              {formatContent(section.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResponsePanel

