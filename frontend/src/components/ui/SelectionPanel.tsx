/**
 * SelectionPanel Component
 *
 * Slide-out sidebar that displays details for the selected building.
 * Returns null when no building is selected.
 */

import { useCityStore, getBuildingState } from '../../stores/cityStore';

export function SelectionPanel() {
  const selectedServiceId = useCityStore((s) => s.selectedServiceId);
  const setSelected = useCityStore((s) => s.setSelected);

  // Don't render if nothing selected
  if (!selectedServiceId) {
    return null;
  }

  const buildingState = getBuildingState(selectedServiceId);
  const health = buildingState?.currentHealth ?? 0;
  const height = buildingState?.currentHeight ?? 0;

  return (
    <div
      className="absolute left-2 top-14 bottom-2 w-72 pointer-events-auto rounded-lg backdrop-blur-md"
      style={{
        background: 'rgba(0, 20, 40, 0.9)',
        border: '1px solid rgba(0, 255, 255, 0.5)',
        boxShadow: '4px 0 20px rgba(0, 255, 255, 0.2)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid rgba(0, 255, 255, 0.3)' }}
      >
        <div>
          <div className="text-xs text-cyan-400 uppercase tracking-wider">
            Service Inspector
          </div>
          <div className="text-white font-mono text-sm mt-1 break-all">
            {selectedServiceId}
          </div>
        </div>
        <button
          onClick={() => setSelected(null)}
          className="text-cyan-400 hover:text-white transition-colors p-1"
          title="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4L16 16M16 4L4 16" />
          </svg>
        </button>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-4">
        {/* Health Indicator */}
        <div>
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
            Health
          </div>
          <div className="relative h-2 bg-gray-800 rounded overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{
                width: `${health * 100}%`,
                background: health > 0.6
                  ? '#00ff88'
                  : health > 0.3
                    ? '#ffaa00'
                    : '#ff4444',
                boxShadow: `0 0 8px ${health > 0.6 ? '#00ff88' : health > 0.3 ? '#ffaa00' : '#ff4444'}`,
              }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">
            {(health * 100).toFixed(1)}%
          </div>
        </div>

        {/* Load Indicator */}
        <div>
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
            Load
          </div>
          <div className="relative h-2 bg-gray-800 rounded overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{
                width: `${Math.min(height * 100, 100)}%`,
                background: '#00ffff',
                boxShadow: '0 0 8px #00ffff',
              }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">
            {(height * 100).toFixed(1)}%
          </div>
        </div>

        {/* Position Info */}
        <div>
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
            Grid Position
          </div>
          <div className="font-mono text-sm text-gray-300">
            X: {buildingState?.gridX.toFixed(1) ?? '0.0'},
            Z: {buildingState?.gridZ.toFixed(1) ?? '0.0'}
          </div>
        </div>
      </div>

      {/* Placeholder for future actions */}
      <div className="absolute bottom-2 left-4 right-4">
        <div className="text-xs text-gray-500 text-center">
          Click elsewhere to deselect
        </div>
      </div>
    </div>
  );
}
