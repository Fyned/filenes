import { Refine, Authenticated } from "@refinedev/core"; // Authenticated eklendi
import { ThemedLayout, ErrorComponent, useNotificationProvider, AuthPage } from "@refinedev/antd"; // AuthPage eklendi
import "@refinedev/antd/dist/reset.css"; 
import { dataProvider } from "@refinedev/supabase";
import { supabase } from "../../lib/supabaseClient";
import { authProvider } from "./authProvider";
import { DashboardPage } from "./pages/dashboard";
import { ProductList } from "./pages/products/list";
import { ProductEdit } from "./pages/products/edit";
import { OrderList } from "./pages/orders/list";
import { OrderShow } from "./pages/orders/show";
import { Route, Routes, Outlet, Navigate } from "react-router-dom"; // Navigate eklendi
import { ConfigProvider } from "antd";

const AdminApp = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#021a32' } }}>
        <Refine
          dataProvider={dataProvider(supabase)}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            {
              name: "dashboard",
              list: "/admin",
            },
            {
              name: "products",
              list: "/admin/products",
              edit: "/admin/products/edit/:id",
              create: "/admin/products/create",
              meta: { label: "Ürünler" }
            },
            {
              name: "orders",
              list: "/admin/orders",
              show: "/admin/orders/show/:id",
              meta: { label: "Siparişler" }
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
            <Routes>
                {/* 1. GİRİŞ SAYFASI (Koruma Kalkanının Dışında) */}
                <Route 
                    path="login" 
                    element={
                        <AuthPage 
                            type="login" 
                            title={
                              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#021a32" }}>
                                FS Admin Girişi
                              </div>
                            }
                            formProps={{
                                initialValues: { email: "admin@filenessports.com" }
                            }}
                        />
                    } 
                />

                {/* 2. KORUNAN SAYFALAR (Authenticated Wrapper İçinde) */}
                <Route
                    element={
                        // KİLİT NOKTASI: Giriş yapılmamışsa /admin/login'e at
                        <Authenticated 
                            key="admin-auth" 
                            fallback={<Navigate to="/admin/login" />}
                            redirectOnFail="/admin/login"
                        >
                            <ThemedLayout>
                                <Outlet />
                            </ThemedLayout>
                        </Authenticated>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    
                    <Route path="products">
                        <Route index element={<ProductList />} />
                        <Route path="edit/:id" element={<ProductEdit />} />
                        {/* Create rotası eklendi */}
                        <Route path="create" element={<ProductEdit />} /> 
                    </Route>

                    <Route path="orders">
                        <Route index element={<OrderList />} />
                        <Route path="show/:id" element={<OrderShow />} />
                    </Route>
                </Route>

                <Route path="*" element={<ErrorComponent />} />
            </Routes>
        </Refine>
    </ConfigProvider>
  );
};

export default AdminApp;
