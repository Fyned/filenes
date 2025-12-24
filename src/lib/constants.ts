export const SITE_CONFIG = {
  name: "Filenes Sports",
  description: "Profesyonel Endüstriyel Spor Ağları ve Güvenlik Fileleri",
  contactEmail: "info@filenes.com",
  currency: "TRY",
  minOrderArea: 2, // m2 kuralı
};

export const ROUTES = {
  storefront: {
    home: "/",
    product: "/product/:id",
    cart: "/cart",
  },
  admin: {
    dashboard: "/admin",
    orders: "/admin/orders",
  }
};