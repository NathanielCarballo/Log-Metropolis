/**
 * InteractionLayer Component
 *
 * Manages the Ghost Cursor - a wireframe box that highlights hovered buildings.
 * Subscribes to hoveredServiceId from the city store.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore, getBuildingState } from '../../stores/cityStore';

// Building dimensions (must match Building.tsx)
const BUILDING_WIDTH = 1.5;
const BUILDING_DEPTH = 1.5;
const BASE_HEIGHT = 0.5;
const HEIGHT_MULTIPLIER = 4;

// Ghost cursor styling
const GHOST_COLOR = '#00ffff';
const GHOST_PADDING = 0.15; // Padding around building

export function InteractionLayer() {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredServiceId = useCityStore((s) => s.hoveredServiceId);

  // Create wireframe geometry and material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({
      color: GHOST_COLOR,
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    });
    return { geometry: edges, material: mat };
  }, []);

  // Update ghost cursor position and scale every frame
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (!hoveredServiceId) {
      group.visible = false;
      return;
    }

    const buildingState = getBuildingState(hoveredServiceId);
    if (!buildingState) {
      group.visible = false;
      return;
    }

    // Calculate building height
    const height = BASE_HEIGHT + buildingState.currentHeight * HEIGHT_MULTIPLIER;

    // Position ghost cursor at building location
    group.position.set(
      buildingState.gridX,
      height / 2,
      buildingState.gridZ
    );

    // Scale to match building size with padding
    group.scale.set(
      BUILDING_WIDTH + GHOST_PADDING * 2,
      height + GHOST_PADDING * 2,
      BUILDING_DEPTH + GHOST_PADDING * 2
    );

    group.visible = true;
  });

  return (
    <group ref={groupRef} visible={false}>
      <lineSegments geometry={geometry} material={material} />
    </group>
  );
}
