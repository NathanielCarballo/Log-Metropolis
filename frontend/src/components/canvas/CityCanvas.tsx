/**
 * CityCanvas Component
 *
 * The main 3D canvas wrapper.
 * Sets up the scene, camera, lighting, controls, and interaction layers.
 *
 * PHASE 5: Added CameraRig, InteractionLayer, and HeadsUpDisplay for user interaction.
 */

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stats } from '@react-three/drei';
import { CityGrid } from './CityGrid';
import { TrafficSystem } from './TrafficSystem';
import { EffectsLayer } from './EffectsLayer';
import { CameraRig } from '../scene/CameraRig';
import { InteractionLayer } from '../scene/InteractionLayer';
import { HeadsUpDisplay } from '../ui/HeadsUpDisplay';
import { useCityStore } from '../../stores/cityStore';

interface CityCanvasProps {
  showStats?: boolean;
}

export function CityCanvas({ showStats = false }: CityCanvasProps) {
  const setSelected = useCityStore((s) => s.setSelected);

  // Click on empty space deselects
  const handleCanvasClick = () => {
    setSelected(null);
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#1a1a2e' }}
        onPointerMissed={handleCanvasClick}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[30, 30, 30]}
          fov={50}
          near={0.1}
          far={1000}
        />

        {/* Controls - Phase 5: MapControls with heavy industrial feel */}
        <CameraRig />

        {/* Lighting */}
        <ambientLight intensity={0.8} color="#6677aa" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={3.0}
          color="#fff8f0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-8, 8, -8]}
          intensity={0.4}
          color="#aaccff"
        />

        {/* The City */}
        <CityGrid />

        {/* Traffic particles - data flowing to buildings */}
        <TrafficSystem />

        {/* Interaction Layer - Ghost cursor for hover feedback */}
        <InteractionLayer />

        {/* Performance stats (toggle with prop) */}
        {showStats && <Stats />}

        {/* Post-processing effects (MUST be last child) */}
        <EffectsLayer />
      </Canvas>

      {/* UI Overlay - outside Canvas for proper DOM rendering */}
      <HeadsUpDisplay />
    </div>
  );
}
