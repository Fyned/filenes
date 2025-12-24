import { BrowserRouter, Routes, Route } from "react-router-dom";
import StorefrontApp from "./apps/storefront/StorefrontApp"; // Eski App.tsx'iniz
import AdminApp from "./apps/admin/AdminApp";
import { Toaster } from 'sonner'; // Veya kullandığınız toast

function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Bildirimleri */}
      <Toaster position="top-right" />
      
      <Routes>
        {/* /admin ile başlayan her şeyi Admin Uygulamasına yönlendir */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Diğer her şeyi Storefront Uygulamasına yönlendir */}
        <Route path="/*" element={<StorefrontApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;