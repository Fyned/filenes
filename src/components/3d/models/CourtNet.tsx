import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';

// Spor türüne göre standartlar
const getSpecs = (type: string, userHeight: number) => {
  switch (type) {
    case 'tennis':
      // Tenis direği 1.07m, orta 0.914m. 
      return { poleH: 1.07, netH: 1.07, offset: 0, band: 0.05, centerStrap: true };
    case 'badminton':
      // Direk 1.55m, file 0.76m
      return { poleH: 1.55, netH: 0.76, offset: 0.79, band: 0.04, centerStrap: false };
    case 'volleyball':
    default:
      // Voleybol: Direk 2.55m, File 1m
      return { poleH: 2.55, netH: 1.0, offset: userHeight - 1.0, band: 0.07, centerStrap: false };
  }
};

export const CourtNet = () => {
  const { width, height, productType } = useConfigStore();
  const netProps = useNetTexture();
  const { poleH, netH, offset, band, centerStrap } = getSpecs(productType, height);

  return (
    <group position={[0, 0, 0]}>
      {/* Sol Direk */}
      <mesh position={[-width/2 - 0.05, poleH/2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, poleH, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.2} />
      </mesh>
      
      {/* Sağ Direk */}
      <mesh position={[width/2 + 0.05, poleH/2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, poleH, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.2} />
      </mesh>

      {/* File */}
      <mesh position={[0, offset + netH/2, 0]} castShadow receiveShadow>
        <planeGeometry args={[width, netH]} />
        <meshStandardMaterial {...netProps} />
      </mesh>

      {/* Üst Bant */}
      <mesh position={[0, offset + netH, 0]}>
        <boxGeometry args={[width, band, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Tenis için Orta Şerit (Center Strap) */}
      {centerStrap && (
        <mesh position={[0, netH/2, 0]}>
          <boxGeometry args={[0.05, netH, 0.025]} />
          <meshStandardMaterial color="white" />
        </mesh>
      )}
    </group>
  );
};