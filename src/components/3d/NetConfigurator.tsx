import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import { useConfigStore } from '../../stores/useConfigStore';

// Modeller
import { SoccerGoal } from './models/SoccerGoal';
import { CourtNet } from './models/CourtNet';
import { BasketballNet } from './models/BasketballNet';
import { SafetyNet } from './models/SafetyNet';

const ModelSelector = () => {
  const { productType } = useConfigStore();

  switch (productType) {
    case 'soccer':
      return <SoccerGoal />;
    case 'volleyball':
    case 'tennis':
    case 'badminton':
      return <CourtNet />;
    case 'basketball':
      return <BasketballNet />;
    case 'safety':
    case 'ballstop':
      return <SafetyNet />;
    default:
      return null;
  }
};

export const NetConfigurator = () => {
  return (
    <div className="h-[600px] w-full rounded-xl border border-gray-200 bg-gradient-to-b from-sky-50 to-gray-100 overflow-hidden relative shadow-lg">
      <Canvas shadows camera={{ position: [0, 6, 14], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
        />
        <Environment preset="park" />

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} maxDistance={40} />

        <group position={[0, 0, 0]}>
          <ModelSelector />
          
          <Grid 
            position={[0, -0.01, 0]} 
            args={[60, 60]} 
            cellColor="#a3a3a3" 
            sectionColor="#737373" 
            fadeDistance={50}
            infiniteGrid
          />
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={30} blur={2.5} far={4} />
        </group>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow text-xs font-semibold text-primary">
        3D Ürün Önizleme Modu
      </div>
    </div>
  );
};