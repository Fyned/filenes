import { create } from 'zustand';

export type ProductType = 
  | 'soccer'      // Futbol
  | 'volleyball'  // Voleybol
  | 'tennis'      // Tenis
  | 'badminton'   // Badminton
  | 'basketball'  // Basketbol Pota
  | 'safety'      // Güvenlik (Merdiven/Balkon)
  | 'ballstop';   // Halı Saha Üstü / Top Yakalama

interface ConfigState {
  width: number;
  height: number;
  depth: number; // Kale derinliği veya Pota çapı
  color: string;
  productType: ProductType;
  
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
  color: '#ffffff',
  productType: 'soccer',

  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setDepth: (depth) => set({ depth }),
  setColor: (color) => set({ color }),
  setProductType: (type) => {
    // Her spor için ideal varsayılan ölçüler
    let defaults = {};
    switch (type) {
      case 'soccer': defaults = { width: 7.32, height: 2.44, depth: 2.0 }; break;
      case 'volleyball': defaults = { width: 9.50, height: 2.43, depth: 0 }; break;
      case 'tennis': defaults = { width: 12.8, height: 1.07, depth: 0 }; break;
      case 'badminton': defaults = { width: 6.10, height: 1.55, depth: 0 }; break;
      case 'basketball': defaults = { width: 0.45, height: 0.50, depth: 0.45 }; break; // Çap ve boy
      case 'safety': defaults = { width: 3.0, height: 1.0, depth: 0 }; break;
      case 'ballstop': defaults = { width: 10.0, height: 6.0, depth: 0 }; break;
    }
    set({ productType: type, ...defaults });
  },
}));