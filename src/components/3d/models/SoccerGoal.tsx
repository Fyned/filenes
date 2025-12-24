import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';
import * as THREE from 'three';

// DİREKLER BEYAZ VE PARLAK
const POLE_OPTS = { 
  color: '#FFFFFF', 
  roughness: 0.2, 
  metalness: 0.3 
};

export const SoccerGoal = () => {
  const { width, height, depth } = useConfigStore();
  const netProps = useNetTexture();

  return (
    <group position={[0, height / 2, 0]}>
      {/* --- İSKELET SİSTEMİ --- */}
      <group>
        {/* Direklerin hepsi beyaz POLE_OPTS kullanıyor */}
        <mesh position={[-width/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, height, 32]} />
          <meshStandardMaterial {...POLE_OPTS} />
        </mesh>
        <mesh position={[width/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, height, 32]} />
          <meshStandardMaterial {...POLE_OPTS} />
        </mesh>
        <mesh position={[0, height/2, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, width + 0.16, 32]} />
          <meshStandardMaterial {...POLE_OPTS} />
        </mesh>

        {/* Arka Destekler */}
        {depth > 0.1 && (
          <>
            <mesh position={[0, -height/2 + 0.04, -depth]} rotation={[0, 0, Math.PI/2]}>
              <boxGeometry args={[0.08, width, 0.08]} />
              <meshStandardMaterial {...POLE_OPTS} />
            </mesh>
            <mesh position={[-width/2, height/2, -depth/2]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, depth, 16]} />
              <meshStandardMaterial {...POLE_OPTS} />
            </mesh>
            <mesh position={[width/2, height/2, -depth/2]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, depth, 16]} />
              <meshStandardMaterial {...POLE_OPTS} />
            </mesh>
          </>
        )}
      </group>

      {/* --- FİLE --- */}
      <mesh position={[0, 0, -depth]} castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
      </mesh>

      {depth > 0 && (
        <>
          <mesh position={[-width/2, 0, -depth/2]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[depth, height]} />
            <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[width/2, 0, -depth/2]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[depth, height]} />
            <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, height/2, -depth/2]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  );
};