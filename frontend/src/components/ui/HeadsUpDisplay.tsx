/**
 * HeadsUpDisplay Component
 *
 * Root overlay for UI elements that sit on top of the 3D canvas.
 * Container has pointer-events: none to allow canvas interaction.
 * Child components enable pointer-events as needed.
 */

import { useCityStore } from '../../stores/cityStore';
import { SelectionPanel } from './SelectionPanel';

export function HeadsUpDisplay() {
  const hoveredServiceId = useCityStore((s) => s.hoveredServiceId);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Hover Tooltip - Top Right, offset from corner */}
      {hoveredServiceId && (
        <div
          className="absolute top-4 right-4 px-4 py-3 rounded-lg pointer-events-none backdrop-blur-md"
          style={{
            background: 'rgba(0, 20, 40, 0.9)',
            border: '1px solid rgba(0, 255, 255, 0.5)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          }}
        >
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">
            Hovering
          </div>
          <div className="text-sm text-white font-mono">
            {hoveredServiceId}
          </div>
        </div>
      )}

      {/* Selection Panel - slides in from left */}
      <SelectionPanel />
    </div>
  );
}
