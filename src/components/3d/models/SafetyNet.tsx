import { useConfigStore } from '../../../stores/useConfigStore';
import { useNetTexture } from '../../../hooks/useNetTexture';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const SafetyNet = () => {
  const { width, height, depth, productType } = useConfigStore();
  const netProps = useNetTexture();
  
  // Halı Saha Modu
  const isPitchCover = productType === 'ballstop';

  if (isPitchCover) {
    const length = depth || width * 1.5; // Derinlik girilmezse enin 1.5 katı olsun

    // Direk Materyali (Galvaniz Çelik)
    const poleMat = new THREE.MeshStandardMaterial({ 
      color: "#94a3b8", 
      roughness: 0.3, 
      metalness: 0.8 
    });

    return (
      <group position={[0, height/2, 0]}>
        {/* TAVAN FİLESİ (Sarkma efekti vermiyoruz ama düz kaplama) */}
        <mesh position={[0, height/2, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow>
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
        </mesh>

        {/* DUVARLAR (4 Taraf Kapalı) */}
        {/* Ön */}
        <mesh position={[0, 0, length/2]}>
             <planeGeometry args={[width, height]} />
             <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
        </mesh>
        {/* Arka */}
        <mesh position={[0, 0, -length/2]} rotation={[0, Math.PI, 0]}>
             <planeGeometry args={[width, height]} />
             <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
        </mesh>
        {/* Sol */}
        <mesh position={[-width/2, 0, 0]} rotation={[0, Math.PI/2, 0]}>
             <planeGeometry args={[length, height]} />
             <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
        </mesh>
        {/* Sağ */}
        <mesh position={[width/2, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
             <planeGeometry args={[length, height]} />
             <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
        </mesh>

        {/* ÇELİK KONSTRÜKSİYON (Her 5 metrede bir direk) */}
        {/* Dikey Direkler */}
        {Array.from({ length: Math.ceil(width / 5) + 1 }).map((_, i, arr) => {
           const x = -width/2 + (width / (arr.length - 1)) * i;
           return (
             <group key={`row-${i}`}>
               <mesh position={[x, 0, length/2]} material={poleMat}>
                  <cylinderGeometry args={[0.08, 0.08, height, 8]} />
               </mesh>
               <mesh position={[x, 0, -length/2]} material={poleMat}>
                  <cylinderGeometry args={[0.08, 0.08, height, 8]} />
               </mesh>
               {/* Çatı Makasları (Truss) */}
               <mesh position={[x, height/2, 0]} rotation={[Math.PI/2, 0, 0]} material={poleMat}>
                  <cylinderGeometry args={[0.05, 0.05, length, 8]} />
               </mesh>
             </group>
           )
        })}

        {/* Bilgi Yazısı */}
        <Text 
          position={[0, height + 1, length/2]} 
          fontSize={1} 
          color="#ffffff" 
          anchorX="center" 
          anchorY="bottom"
          rotation={[0, Math.PI, 0]} // Arkaya dönük
        >
          {width}m x {length}m
        </Text>
        <Text 
          position={[0, height + 1, -length/2]} 
          fontSize={1} 
          color="#ffffff" 
          anchorX="center" 
          anchorY="bottom"
        >
          Saha Kapama Sistemi
        </Text>
      </group>
    );
  }

  // Standart Güvenlik Filesi
  return (
    <group position={[0, height/2, 0]}>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...netProps} side={THREE.DoubleSide} />
      </mesh>
      {/* Profil Çerçeve */}
      <mesh position={[0, height/2, 0]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, -height/2, 0]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  );
};