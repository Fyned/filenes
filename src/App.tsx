import { useConfigStore, ProductType } from "./stores/useConfigStore";
import { calculatePrice } from "./lib/pricing";
import { NetConfigurator } from "./components/3d/NetConfigurator";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

// Kategori Buton Grubu
const types: { id: ProductType; label: string; icon: string }[] = [
  { id: 'soccer', label: 'Futbol', icon: '⚽' },
  { id: 'basketball', label: 'Basketbol', icon: '🏀' },
  { id: 'volleyball', label: 'Voleybol', icon: '🏐' },
  { id: 'tennis', label: 'Tenis', icon: '🎾' },
  { id: 'badminton', label: 'Badminton', icon: '🏸' },
  { id: 'safety', label: 'Güvenlik', icon: '🛡️' },
  { id: 'ballstop', label: 'Top Yakalama', icon: '🥅' },
];

function App() {
  const { width, height, depth, productType, setWidth, setHeight, setDepth, setProductType } = useConfigStore();
  
  // Fiyat Hesapla (Geçici olarak sabit birim fiyat kullanıyoruz - sonra veritabanından gelecek)
  const unitPrice = 100; // TL per m² (placeholder)
  const priceResult = calculatePrice(width, height, unitPrice);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">Filenes 3D Configurator</h1>
        <p className="text-gray-500">Faz 3: 3D Görselleştirme ve Fiyat Testi</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sol Kolon: 3D Sahne (8 birim) */}
        <div className="lg:col-span-8">
          {/* YENİ KATEGORİ SEÇİMİ */}
          <div className="mb-6 flex flex-wrap gap-2">
            {types.map((t) => (
              <Button 
                key={t.id}
                variant={productType === t.id ? 'default' : 'outline'} 
                className={productType === t.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700'}
                onClick={() => setProductType(t.id)}
              >
                <span className="mr-2">{t.icon}</span> {t.label}
              </Button>
            ))}
          </div>
          
          <NetConfigurator />
        </div>

        {/* Sağ Kolon: Kontroller ve Özet (4 birim) */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Ölçü Girişleri */}
          <div className="rounded-lg border bg-gray-50 p-6">
            <h2 className="mb-4 font-semibold text-primary">Ölçü Konfigürasyonu</h2>
            
            <div className="space-y-4">
              {/* Genişlik Input */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {productType === 'basketball' ? 'Çember Çapı' : 'Genişlik (En)'}
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={0.1} 
                    max={50}
                    step={0.1}
                  />
                  <span className="text-sm text-gray-500">m</span>
                </div>
              </div>

              {/* Yükseklik Input */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {productType === 'basketball' ? 'File Uzunluğu' : 'Yükseklik (Boy)'}
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={0.1} 
                    max={20}
                    step={0.1}
                  />
                  <span className="text-sm text-gray-500">m</span>
                </div>
              </div>

              {/* Derinlik Input (Sadece Futbol için) */}
              {productType === 'soccer' && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Kale Derinliği</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={depth} 
                      onChange={(e) => setDepth(Number(e.target.value))}
                      min={0.1} 
                      max={10}
                      step={0.1}
                    />
                    <span className="text-sm text-gray-500">m</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fiyat Özeti */}
          <div className="rounded-lg border border-secondary bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-primary">Fiyat Özeti</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gerçek Alan:</span>
                <span>{priceResult.area} m²</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Faturalandırılan Alan:</span>
                <span className="font-medium">{priceResult.chargedArea} m²</span>
              </div>
              
              {priceResult.isMinApplied && (
                <div className="text-xs text-orange-600 font-medium bg-orange-50 p-2 rounded">
                  * Minimum 2m² sipariş kuralı uygulandı.
                </div>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-gray-500">Toplam Tutar</span>
              <span className="text-3xl font-bold text-primary">
                {priceResult.totalPrice} ₺
              </span>
            </div>

            <Button className="mt-4 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Sepete Ekle
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;