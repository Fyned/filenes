import { Refine } from "@refinedev/core";
import { ThemedLayoutV2, ErrorComponent, RefineThemes, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css"; // Antd CSS
import { DataProvider } from "@refinedev/supabase";
import { supabase } from "../../lib/supabaseClient";
import { authProvider } from "./authProvider";
import { DashboardPage } from "./pages/dashboard";
import { ProductList } from "./pages/products/list";
import { ProductEdit } from "./pages/products/edit";
import { OrderList } from "./pages/orders/list";
import { OrderShow } from "./pages/orders/show";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { ConfigProvider } from "antd";

// Supabase Data Provider'ı başlat
const dataProvider = DataProvider(supabase);

const AdminApp = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#021a32' } }}>
        <Refine
          dataProvider={dataProvider}
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
                {/* Admin Layout */}
                <Route
                    element={
                        <ThemedLayoutV2 Title={({ collapsed }) => collapsed ? "FS" : "Filenes Admin"}>
                            <Outlet />
                        </ThemedLayoutV2>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    
                    <Route path="products">
                        <Route index element={<ProductList />} />
                        <Route path="edit/:id" element={<ProductEdit />} />
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