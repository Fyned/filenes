import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';

export const SafetyNet = () => {
  const { width, height, productType } = useConfigStore();
  const netProps = useNetTexture();
  
  const isBallStop = productType === 'ballstop';
  const poleRadius = isBallStop ? 0.08 : 0.03;

  return (
    <group position={[0, height/2, 0]}>
      {/* File Yüzeyi */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...netProps} />
      </mesh>

      {/* Çerçeve İpi veya Halat */}
      <mesh position={[0, height/2, 0]}>
        <boxGeometry args={[width, 0.02, 0.02]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      <mesh position={[0, -height/2, 0]}>
        <boxGeometry args={[width, 0.02, 0.02]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      {/* Dikey Direkler (Her 3 metrede bir) */}
      {isBallStop && (
        <>
          <mesh position={[-width/2, 0, 0]}>
            <cylinderGeometry args={[poleRadius, poleRadius, height, 16]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
          <mesh position={[width/2, 0, 0]}>
            <cylinderGeometry args={[poleRadius, poleRadius, height, 16]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        </>
      )}
    </group>
  );
};