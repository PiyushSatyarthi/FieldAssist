import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="border-b border-charcoal-800 bg-charcoal-900/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Offline Survival AI
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Critical Information System
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-muted rounded-full animate-pulse"></div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-mono">
              OFFLINE MODE
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

