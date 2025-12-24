export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface IProfile {
  id: string; // UUID
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  billing_address: Json | null;
  created_at: string;
  updated_at: string;
}

export interface IProductConfigSchema {
  min_width?: number;
  max_width?: number;
  min_height?: number;
  max_height?: number;
  step?: number; // Örn: 0.1 metre hassasiyet
}

export interface IProduct {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  base_price: number; // m² fiyatı
  is_active: boolean;
  config_schema: IProductConfigSchema | null;
  created_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';
export type PaymentProvider = 'shopier' | 'paytr';

export interface IOrder {
  id: string; // UUID
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  payment_provider: PaymentProvider | null;
  payment_id: string | null;
  shipping_address: Json | null;
  created_at: string;
}

export interface IOrderItemConfiguration {
  width: number;
  height: number;
  area_m2: number;
  [key: string]: any; // Ekstra notlar vb.
}

export interface IOrderItem {
  id: string; // UUID
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  configuration: IOrderItemConfiguration; // Jsonb karşılığı
  final_price: number;
  created_at: string;
  
  // Join yapıldığında gelebilecek veriler (Opsiyonel)
  product?: IProduct;
}

export interface IPricingRule {
  id: string;
  product_id: string | null;
  min_area_m2: number;
  discount_percentage: number;
  created_at: string;
}

// Supabase'den dönen veritabanı yanıt tipi (Genel kullanım için)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: IProfile;
        Insert: Partial<IProfile>;
        Update: Partial<IProfile>;
      };
      products: {
        Row: IProduct;
        Insert: Omit<IProduct, 'id' | 'created_at'>;
        Update: Partial<IProduct>;
      };
      orders: {
        Row: IOrder;
        Insert: Omit<IOrder, 'id' | 'created_at'>;
        Update: Partial<IOrder>;
      };
      order_items: {
        Row: IOrderItem;
        Insert: Omit<IOrderItem, 'id' | 'created_at'>;
        Update: Partial<IOrderItem>;
      };
      pricing_rules: {
        Row: IPricingRule;
        Insert: Omit<IPricingRule, 'id' | 'created_at'>;
        Update: Partial<IPricingRule>;
      };
    };
  };
}