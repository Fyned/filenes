import { useConfigStore, ProductType } from "../../stores/useConfigStore";
import { NetConfigurator } from "../../components/3d/NetConfigurator";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { calculatePrice } from "../../lib/pricing";

// İkon ve Etiket Listesi
const types: { id: ProductType; label: string; icon: string }[] = [
  { id: 'soccer', label: 'Futbol', icon: '⚽' },
  { id: 'basketball', label: 'Basketbol', icon: '🏀' },
  { id: 'volleyball', label: 'Voleybol', icon: '🏐' },
  { id: 'tennis', label: 'Tenis', icon: '🎾' },
  { id: 'badminton', label: 'Badminton', icon: '🏸' },
  { id: 'safety', label: 'Güvenlik', icon: '🛡️' },
  { id: 'ballstop', label: 'Saha Kapama', icon: '🏟️' }, // İSİM GÜNCELLENDİ
];

function App() {
  const { width, height, depth, productType, selectedProductPrice, setWidth, setHeight, setProductType, setDepth } = useConfigStore();
  
  // Fiyat Hesapla
  const priceResult = calculatePrice(width, height, selectedProductPrice);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8"> {/* Sayfa geneli Dark Mode */}
      <header className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Filenes Sports</h1>
          <p className="text-gray-400">Profesyonel Ağ Sistemleri</p>
        </div>
        <div className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-1">
          3D Modül: Aktif
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* SOL KOLON: 3D SAHNE */}
        <div className="lg:col-span-8 space-y-4">
           {/* Kategori Seçimi */}
           <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button 
                key={t.id}
                onClick={() => setProductType(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${productType === t.id 
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          
          {/* 3D Viewer */}
          <NetConfigurator />
        </div>

        {/* SAĞ KOLON: KONTROLLER */}
        <div className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
               <h2 className="mb-4 font-semibold text-white flex items-center gap-2">
                 📏 Ölçü Konfigürasyonu
               </h2>
               
               <div className="space-y-5">
                 {/* En */}
                 <div>
                   <label className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                     {productType === 'basketball' ? 'Çember Çapı' : 'Genişlik (En)'}
                   </label>
                   <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700 focus-within:border-white transition-colors">
                      <Input 
                        type="number" 
                        value={width} 
                        onChange={(e) => setWidth(Number(e.target.value))} 
                        step={0.1}
                        className="bg-transparent border-none text-white focus:ring-0 w-full"
                      />
                      <span className="text-gray-500 px-3 font-mono">m</span>
                   </div>
                 </div>

                 {/* Boy */}
                 <div>
                   <label className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                     {productType === 'basketball' ? 'File Uzunluğu' : 'Yükseklik (Boy)'}
                   </label>
                   <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700 focus-within:border-white transition-colors">
                      <Input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(Number(e.target.value))} 
                        step={0.1}
                        className="bg-transparent border-none text-white focus:ring-0 w-full"
                      />
                      <span className="text-gray-500 px-3 font-mono">m</span>
                   </div>
                 </div>

                 {/* Derinlik (Opsiyonel) */}
                 {(productType === 'soccer' || productType === 'ballstop') && (
                   <div>
                     <label className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                       {productType === 'ballstop' ? 'Saha Uzunluğu' : 'Derinlik'}
                     </label>
                     <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700 focus-within:border-white transition-colors">
                        <Input 
                          type="number" 
                          value={depth} 
                          onChange={(e) => setDepth(Number(e.target.value))} 
                          step={0.1}
                          className="bg-transparent border-none text-white focus:ring-0 w-full"
                        />
                        <span className="text-gray-500 px-3 font-mono">m</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            {/* Fiyat Kartı */}
            <div className="rounded-xl bg-white p-6 text-black shadow-xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <span className="text-xs font-bold text-gray-400 uppercase">Tahmini Tutar</span>
                   <div className="text-4xl font-black tracking-tight mt-1">
                      {priceResult.totalPrice} <span className="text-lg align-top">₺</span>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-medium text-gray-600">{priceResult.chargedArea} m²</div>
                   <div className="text-xs text-gray-400">Faturalandırılan</div>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800 h-12 text-lg">
                Sepete Ekle
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;