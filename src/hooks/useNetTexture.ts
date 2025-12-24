import { useMemo, useLayoutEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore, ProductType } from '../stores/useConfigStore';

const getDensity = (type: ProductType): number => {
  switch (type) {
    case 'basketball': return 10; 
    case 'badminton': return 20;
    case 'tennis': return 15;
    case 'safety': return 12;
    case 'volleyball': return 10;
    case 'soccer': return 4;
    case 'ballstop': return 2;
    default: return 5;
  }
};

const generateNetTextureURL = () => {
  const size = 1024; 
  const canvas = document.createElement('canvas');
  canvas.width = size; 
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Temizle
    ctx.clearRect(0, 0, size, size);
    
    // RENK: SAF BEYAZ
    ctx.strokeStyle = '#FFFFFF';
    
    // KALINLIK: Çok belirgin
    ctx.lineWidth = 40; 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Kareyi çiz
    ctx.strokeRect(20, 20, size-40, size-40);

    // Dokuya "Parlaklık" efekti (İpin ortası daha parlak)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, size-40, size-40);
  }
  return canvas.toDataURL('image/png');
};

export const useNetTexture = () => {
  const { width, height, productType, depth } = useConfigStore();
  // color dependency'sini kaldırdık, hep beyaz olacak
  const textureURL = useMemo(() => generateNetTextureURL(), []);
  const texture = useLoader(THREE.TextureLoader, textureURL);

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 32;
      texture.minFilter = THREE.NearestMipmapLinearFilter;
      
      const density = getDensity(productType);
      
      let wRep = Math.max(1, width * density);
      let hRep = Math.max(1, height * density);

      if (productType === 'basketball') { wRep = 8; hRep = 6; }
      
      texture.repeat.set(wRep, hRep);
      texture.needsUpdate = true;
    }
  }, [width, height, depth, productType, texture]);

  return {
    map: texture,
    color: '#FFFFFF', // Materyal rengi de SAF BEYAZ
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
    roughness: 0.2, // Parlak ip (Işığı yansıtsın)
    metalness: 0.1,
    emissive: '#FFFFFF', // Hafifçe kendi ışığını yayar (Karanlıkta görünmesi için kritik)
    emissiveIntensity: 0.2, 
  };
};