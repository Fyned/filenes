import { create } from 'zustand';

export type ProductType = 
  | 'soccer' | 'volleyball' | 'tennis' | 'badminton' 
  | 'basketball' | 'safety' | 'ballstop';

interface ConfigState {
  width: number;
  height: number;
  depth: number;
  color: string;
  productType: ProductType;
  selectedProductPrice: number;
  
  setWidth: (v: number) => void;
  setHeight: (v: number) => void;
  setDepth: (v: number) => void;
  setColor: (v: string) => void;
  setProductType: (v: ProductType) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  width: 7.32,
  height: 2.44,
  depth: 2.0,
  color: '#FFFFFF', // VARSAYILAN BEYAZ
  productType: 'soccer',
  selectedProductPrice: 150, // Varsayılan m² fiyatı

  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setDepth: (depth) => set({ depth }),
  setColor: (color) => set({ color }),
  setProductType: (type) => {
    let defaults: any = {};
    let price = 150; // Varsayılan fiyat
    
    switch (type) {
      case 'soccer': 
        defaults = { width: 7.32, height: 2.44, depth: 2.0 }; 
        price = 150;
        break;
      case 'volleyball': 
        defaults = { width: 9.50, height: 2.43, depth: 0 }; 
        price = 120;
        break;
      case 'tennis': 
        defaults = { width: 12.8, height: 1.07, depth: 0 }; 
        price = 180;
        break;
      case 'badminton': 
        defaults = { width: 6.10, height: 1.55, depth: 0 }; 
        price = 110;
        break;
      case 'basketball': 
        defaults = { width: 0.45, height: 0.60, depth: 0.45 }; 
        price = 200;
        break;
      case 'safety': 
        defaults = { width: 3.0, height: 1.0, depth: 0 }; 
        price = 100;
        break;
      case 'ballstop': 
        defaults = { width: 10.0, height: 6.0, depth: 0 }; 
        price = 140;
        break;
    }
    set({ productType: type, ...defaults, color: '#FFFFFF', selectedProductPrice: price });
  },
}));