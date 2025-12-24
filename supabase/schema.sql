-- UUID eklentisini aktif et (Genellikle varsayılan açıktır ama garanti olsun)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Kullanıcı Profilleri)
-- auth.users tablosu ile senkronize çalışır.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  billing_address JSONB, -- { city: "Konya", district: "Selçuklu", address: "..." }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profilini görebilir" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. PRODUCTS (Ürünler - File Çeşitleri)
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  base_price NUMERIC NOT NULL, -- m² Birim Fiyatı
  is_active BOOLEAN DEFAULT true,
  config_schema JSONB, -- { "min_width": 1, "max_width": 100, "min_height": 1 }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Products (Herkese Açık Okuma)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes ürünleri görebilir" 
  ON public.products FOR SELECT 
  TO anon, authenticated
  USING (true);

-- 3. ORDERS (Siparişler)
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, shipped, cancelled
  total_amount NUMERIC NOT NULL,
  payment_provider TEXT, -- 'shopier' | 'paytr'
  payment_id TEXT, -- Ödeme sağlayıcıdan dönen işlem ID'si
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Orders (Sadece sahibi görebilir)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir" 
  ON public.orders FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar sipariş oluşturabilir" 
  ON public.orders FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. ORDER ITEMS (Sipariş Kalemleri)
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL, -- O anki m² fiyatı (fiyat değişirse sipariş etkilenmesin diye)
  configuration JSONB NOT NULL, -- { "width": 5, "height": 10, "area_m2": 50 }
  final_price NUMERIC NOT NULL, -- Hesaplanan satır toplamı
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Order Items (Sipariş sahibi görebilir)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi sipariş kalemlerini görebilir" 
  ON public.order_items FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Sipariş oluştururken kalem eklenebilir" 
  ON public.order_items FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 5. PRICING RULES (Toplu Alım İndirimleri)
CREATE TABLE public.pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id), -- Null ise genel kural
  min_area_m2 NUMERIC NOT NULL, -- Örn: 50m² üzeri
  discount_percentage INTEGER NOT NULL, -- Örn: %10 indirim
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Pricing Rules (Herkese açık okuma)
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "İndirim kuralları herkese açık" 
  ON public.pricing_rules FOR SELECT 
  TO anon, authenticated
  USING (true);

-- OTOMATİK PROFİL OLUŞTURMA TETİKLEYİCİSİ
-- Yeni bir kullanıcı kaydolduğunda profiles tablosuna otomatik ekler.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();