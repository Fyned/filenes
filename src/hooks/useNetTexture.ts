import { useMemo, useLayoutEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfigStore, ProductType } from '../stores/useConfigStore';

// Hangi sporda file gözleri ne kadar sık?
const getDensity = (type: ProductType): number => {
  switch (type) {
    case 'basketball': return 25; // Çok sık
    case 'badminton': return 25;  // Çok sık
    case 'tennis': return 20;     // Sık
    case 'safety': return 15;     // Orta-Sık (Düşmeyi önleyici)
    case 'volleyball': return 10; // Orta
    case 'soccer': return 5;      // Geniş
    case 'ballstop': return 4;    // Çok Geniş
    default: return 5;
  }
};

const generateNetTextureURL = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256; 
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    // İp çizimi
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; 
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 256, 256);
    
    // Hafif gölge (Derinlik hissi)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 256, 256);
  }
  return canvas.toDataURL('image/png');
};

export const useNetTexture = () => {
  const { width, height, color, productType, depth } = useConfigStore();
  const textureURL = useMemo(() => generateNetTextureURL(), []);
  const texture = useLoader(THREE.TextureLoader, textureURL);

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      
      const density = getDensity(productType);
      
      // Basketbol silindiriktir, hesap farklı
      let wRep, hRep;
      if (productType === 'basketball') {
        wRep = 12; // Çevresi boyunca tekrar
        hRep = height * density;
      } else {
        wRep = Math.max(1, width * density);
        hRep = Math.max(1, height * density);
      }
      
      texture.repeat.set(wRep, hRep);
      texture.needsUpdate = true;
    }
  }, [width, height, depth, productType, texture]);

  return {
    map: texture,
    color: color,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.2,
  };
};