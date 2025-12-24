// src/App.tsx
import { Button } from "./components/ui/Button";
import { SITE_CONFIG } from "./lib/constants";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-primary">{SITE_CONFIG.name}</h1>
      <p className="text-gray-600">{SITE_CONFIG.description}</p>
      
      <div className="flex gap-4">
        <Button variant="default">Giriş Yap</Button>
        <Button variant="secondary">Hemen Hesapla</Button>
      </div>
      
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
         <p className="text-sm text-gray-500">Sistem Durumu: <span className="text-secondary font-bold">Aktif</span></p>
      </div>
    </div>
  )
}

export default App