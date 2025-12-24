import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import { useConfigStore } from '../../stores/useConfigStore';
import * as THREE from 'three';

import { SoccerGoal } from './models/SoccerGoal';
import { CourtNet } from './models/CourtNet';
import { BasketballNet } from './models/BasketballNet';
import { SafetyNet } from './models/SafetyNet';

// SİYAH MAT ZEMİN
const SmartFloor = () => {
  const { width, depth, productType } = useConfigStore();
  const sizeX = productType === 'ballstop' ? width + 10 : 80;
  const sizeZ = productType === 'ballstop' ? (depth || width) + 10 : 80;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[sizeX, sizeZ]} />
      <meshStandardMaterial 
        color="#0a0a0a" // Tam siyah değil, çok koyu gri (Detay için)
        roughness={0.5} 
        metalness={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const ModelSelector = () => {
  const { productType } = useConfigStore();
  switch (productType) {
    case 'soccer': return <SoccerGoal />;
    case 'volleyball':
    case 'tennis':
    case 'badminton': return <CourtNet />;
    case 'basketball': return <BasketballNet />;
    case 'safety':
    case 'ballstop': return <SafetyNet />;
    default: return null;
  }
};

export const NetConfigurator = () => {
  return (
    <div className="h-[600px] w-full rounded-xl border border-gray-800 bg-black overflow-hidden relative shadow-2xl">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* IŞIKLANDIRMA: Ürün Odaklı */}
        <ambientLight intensity={0.3} />
        
        {/* Ana Işık */}
        <spotLight 
          position={[15, 20, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2.5} 
          castShadow 
          color="#ffffff"
          shadow-mapSize={[2048, 2048]} 
        />

        {/* Kontur Işığı (Arkadan) - Fileyi parlatır */}
        <spotLight position={[-10, 5, -10]} intensity={3} color="#e2e8f0" />
        
        <Environment preset="night" />

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.02} maxDistance={60} />

        <group position={[0, 0, 0]}>
          <ModelSelector />
          <SmartFloor />
          
          {/* Grid: Opacity prop'u kaldırıldı, renkler koyulaştırıldı */}
          <Grid 
            position={[0, 0.01, 0]} 
            args={[80, 80]} 
            cellColor="#262626" 
            sectionColor="#404040" 
            sectionThickness={1}
            cellThickness={0.5}
            fadeDistance={50}
            infiniteGrid
          />
          
          {/* ContactShadows eklendi */}
          <ContactShadows position={[0, 0.02, 0]} opacity={0.7} scale={50} blur={2} far={2} resolution={1024} color="#000000" />
        </group>
      </Canvas>
    </div>
  );
};