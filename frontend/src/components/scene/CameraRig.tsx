/**
 * CameraRig Component
 *
 * Handles camera movement using MapControls for a top-down city navigation feel.
 * Configuration provides a heavy/industrial feel with constrained movement.
 */

import { MapControls } from '@react-three/drei';

export function CameraRig() {
  return (
    <MapControls
      // Disable screen space panning - panning moves in world XZ plane
      screenSpacePanning={false}
      // Distance constraints - prevent clipping and keep city in view
      minDistance={20}
      maxDistance={100}
      // Prevent camera from going under the map
      maxPolarAngle={Math.PI / 2.5}
      // Heavy/Industrial feel - slow, deliberate camera movement
      dampingFactor={0.1}
      enableDamping
      // Default target at city center
      target={[0, 0, 0]}
    />
  );
}
