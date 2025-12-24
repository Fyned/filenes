import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';
import { RoundedBox } from '@react-three/drei';

export const BasketballNet = () => {
  const { width, height } = useConfigStore(); // width = Çember Çapı
  const netProps = useNetTexture();
  
  const rimRadius = width / 2;
  const backboardW = 1.80; // Standart Pano
  const backboardH = 1.05;
  const poleHeight = 3.05; // Yerden çember yüksekliği

  return (
    <group position={[0, 0, 0]}>
      {/* 1. ANA DİREK (Daha Kalın ve Metalik) */}
      <mesh position={[0, poleHeight/2, -1.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, poleHeight + 1, 32]} /> {/* Daha kalın */}
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.9} // Tam metal
          roughness={0.2} // Parlak
        />
      </mesh>

      {/* 2. PANO (Gerçekçi Temperli Cam) */}
      <group position={[0, poleHeight + 0.3, -0.6]}>
         {/* Cam Yüzey */}
         <RoundedBox args={[backboardW, backboardH, 0.04]} radius={0.05} smoothness={4}>
            <meshPhysicalMaterial 
              color="#ffffff"
              transmission={0.95} // Işık geçirgenliği (Cam efekti)
              opacity={1} 
              metalness={0}
              roughness={0.05} // Çok pürüzsüz ve parlak
              ior={1.5} // Camın kırılma indisi
              thickness={0.04} // Cam kalınlığı
              envMapIntensity={2} // Çevreyi yansıt
              transparent
            />
         </RoundedBox>
         
         {/* Pano Çerçevesi (Metal) */}
         <mesh position={[0,0, -0.025]}>
            <boxGeometry args={[backboardW + 0.08, backboardH + 0.08, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
         </mesh>
         
         {/* Pano İç Karesi (Hedef - Camın hemen arkasında) */}
         <mesh position={[0, -0.3, 0.021]}>
            <planeGeometry args={[0.59, 0.45]} />
            <meshBasicMaterial color="#000" />
         </mesh>
      </group>

      {/* 3. ÇEMBER (Turuncu) */}
      <mesh position={[0, poleHeight, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[rimRadius, 0.03, 16, 100]} /> {/* Biraz daha kalın çember */}
        <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 4. FİLE */}
      <mesh position={[0, poleHeight - (height/2), 0]} castShadow>
        <cylinderGeometry args={[rimRadius, rimRadius * 0.5, height, 24, 1, true]} />
        <meshStandardMaterial {...netProps} />
      </mesh>
    </group>
  );
};