import React, { useState } from 'react'

interface NavigationPanelProps {
  className?: string
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ className }) => {
  const [startLat, setStartLat] = useState<string>('')
  const [startLon, setStartLon] = useState<string>('')
  const [endLat, setEndLat] = useState<string>('')
  const [endLon, setEndLon] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [routeData, setRouteData] = useState<{
    distance_km: number
    time_minutes: number
    steps: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    const startLatNum = parseFloat(startLat)
    const startLonNum = parseFloat(startLon)
    const endLatNum = parseFloat(endLat)
    const endLonNum = parseFloat(endLon)

    if (isNaN(startLatNum) || isNaN(startLonNum) || isNaN(endLatNum) || isNaN(endLonNum)) {
      setError('Please enter valid coordinates for both start and destination')
      return
    }

    setIsLoading(true)
    setError(null)
    setRouteData(null)

    try {
      const response = await fetch(
        `/api/navigate?start_lat=${startLatNum}&start_lon=${startLonNum}&end_lat=${endLatNum}&end_lon=${endLonNum}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setRouteData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to calculate route: ${errorMessage}. Ensure GraphHopper is running on port 8989.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      if (field === 'end_lon') {
        handleCalculate()
      }
    }
  }

  return (
    <div className={`bg-charcoal-900 border border-charcoal-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="text-2xl">🗺️</span>
        Navigation System
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            Start Coordinates
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                value={startLat}
                onChange={(e) => setStartLat(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'start_lat')}
                placeholder="Latitude"
                step="0.0001"
                className="w-full px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-amber-muted focus:border-amber-muted"
              />
            </div>
            <div>
              <input
                type="number"
                value={startLon}
                onChange={(e) => setStartLon(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'start_lon')}
                placeholder="Longitude"
                step="0.0001"
                className="w-full px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-amber-muted focus:border-amber-muted"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            Destination Coordinates
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                value={endLat}
                onChange={(e) => setEndLat(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'end_lat')}
                placeholder="Latitude"
                step="0.0001"
                className="w-full px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-amber-muted focus:border-amber-muted"
              />
            </div>
            <div>
              <input
                type="number"
                value={endLon}
                onChange={(e) => setEndLon(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'end_lon')}
                placeholder="Longitude"
                step="0.0001"
                className="w-full px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-amber-muted focus:border-amber-muted"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-amber-muted hover:bg-amber-warning disabled:bg-charcoal-700 disabled:cursor-not-allowed text-charcoal-950 font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-amber-muted focus:ring-offset-2 focus:ring-offset-charcoal-900"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
              Calculating Route...
            </span>
          ) : (
            'Calculate Route'
          )}
        </button>

        {error && (
          <div className="danger-section">
            <div className="flex items-start gap-3">
              <span className="text-danger font-semibold text-lg">⚠️</span>
              <div>
                <h3 className="font-semibold text-danger mb-1">Route Calculation Failed</h3>
                <p className="text-text-secondary text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {routeData && (
          <div className="mt-4 bg-charcoal-800 border border-charcoal-700 rounded-lg p-4">
            <h3 className="font-semibold text-text-primary mb-3">Route Information</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-text-muted mb-1">Distance</div>
                <div className="text-lg font-semibold text-amber-muted">{routeData.distance_km} km</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">Estimated Time</div>
                <div className="text-lg font-semibold text-amber-muted">{routeData.time_minutes} min</div>
              </div>
            </div>

            {routeData.steps && routeData.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-2">Navigation Steps</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {routeData.steps.map((step, index) => (
                    <div
                      key={index}
                      className="text-sm text-text-primary bg-charcoal-900 px-3 py-2 rounded border-l-2 border-amber-muted"
                    >
                      <span className="font-semibold text-amber-muted">{index + 1}.</span> {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-text-muted mt-4 pt-4 border-t border-charcoal-800">
          <p className="mb-1">Offline navigation using GraphHopper and OpenStreetMap data</p>
          <p>Enter coordinates in decimal degrees (e.g., 28.6139, 77.2090)</p>
        </div>
      </div>
    </div>
  )
}

export default NavigationPanel

