import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';
import * as THREE from 'three';

export const BasketballNet = () => {
  const { width, height } = useConfigStore(); // Width = Çap olarak kullanacağız
  const netProps = useNetTexture();
  
  const topRadius = width / 2;
  const bottomRadius = width * 0.4; // Alt kısım biraz daha dar olur

  return (
    <group position={[0, height, 0]}>
      {/* Turuncu Çember */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[topRadius, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Konik File */}
      {/* openEnded: true (Altı ve üstü açık silindir) */}
      <mesh position={[0, -height/2, 0]} castShadow>
        <cylinderGeometry args={[topRadius, bottomRadius, height, 24, 8, true]} />
        <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};