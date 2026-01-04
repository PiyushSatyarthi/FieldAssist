import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import QueryInput from './components/QueryInput'
import ResponsePanel from './components/ResponsePanel'
import NavigationPanel from './components/NavigationPanel'
import { RAGCategory } from './types'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<RAGCategory | null>(null)
  const [query, setQuery] = useState<string>('')
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      setError('Please enter a query')
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          q: queryText, 
          category: selectedCategory 
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setResponse(data.answer || 'No response received')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to retrieve guidance: ${errorMessage}. Ensure the server is running on port 8000.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-charcoal-950">
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Navigation Panel */}
            <NavigationPanel />
            
            {/* Query Section */}
            <div>
              <QueryInput
                query={query}
                onQueryChange={setQuery}
                onQuerySubmit={handleQuery}
                isLoading={isLoading}
                selectedCategory={selectedCategory}
              />
              
              {error && (
                <div className="mt-6 danger-section">
                  <div className="flex items-start gap-3">
                    <span className="text-danger font-semibold text-lg">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-danger mb-1">Query Failed</h3>
                      <p className="text-text-secondary">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {response && (
                <ResponsePanel 
                  response={response}
                  onCategorySwitch={setSelectedCategory}
                />
              )}
              
              {!response && !error && !isLoading && (
                <div className="mt-12 text-center text-text-muted">
                  <p className="text-lg mb-2">Critical Information System</p>
                  <p className="text-sm">Enter a query above to retrieve survival guidance</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

