import { AuthProvider } from "@refinedev/core";
import { supabase } from "../../lib/supabaseClient";

const ADMIN_EMAIL = "admin@filenessports.com";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: any) => {
    try {
      console.log("Giriş Denemesi:", email); // Konsolda görmek için

      // 1. Mail Kontrolü
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return {
          success: false,
          error: {
            message: "Bu panele sadece admin@filenessports.com girebilir.",
            name: "Yetkisiz E-posta",
          },
        };
      }

      // 2. Supabase Girişi
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase Hatası:", error);
        return {
          success: false,
          error: {
            message: error.message === "Invalid login credentials" 
              ? "Şifre veya e-posta yanlış." 
              : error.message,
            name: "Giriş Başarısız",
          },
        };
      }

      // 3. Admin Yetki Kontrolü (GEÇİCİ OLARAK DEVRE DIŞI)
      // if (data.user) {
      //   const { data: profile, error: profileError } = await supabase
      //     .from("profiles")
      //     .select("is_admin")
      //     .eq("id", data.user.id)
      //     .single();

      //   if (profileError || !(profile as any)?.is_admin) {
      //     console.error("Profil Hatası:", profileError);
      //     await supabase.auth.signOut();
      //     return {
      //       success: false,
      //       error: {
      //         message: "Kullanıcı giriş yaptı ancak 'Admin' yetkisi veritabanında bulunamadı.",
      //         name: "Yetki Hatası",
      //       },
      //     };
      //   }
      // }

      // GEÇİCİ BYPASS: Supabase girişi başarılıysa direkt admin paneline at
      console.log("✅ Bypass aktif - Admin kontrolü atlandı");
      return { success: true, redirectTo: "/admin" };
      
    } catch (err: any) {
      console.error("Beklenmeyen Hata:", err);
      return {
        success: false,
        error: {
          message: "Bir sistem hatası oluştu. Konsolu kontrol edin.",
          name: "Sistem Hatası",
        },
      };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    return { success: true, redirectTo: "/admin/login" };
  },

  check: async () => {
    const { data } = await supabase.auth.getSession();
    const { user } = data.session || {};

    if (user) {
      if (user.email !== ADMIN_EMAIL) {
         return { authenticated: false, redirectTo: "/admin/login" };
      }
      
      // GEÇİCİ BYPASS: Admin kontrolü devre dışı
      // const { data: profile } = await supabase
      //   .from("profiles")
      //   .select("is_admin")
      //   .eq("id", user.id)
      //   .single();
        
      // if ((profile as any)?.is_admin) {
      //   return { authenticated: true };
      // }
      
      // E-posta doğruysa ve oturum varsa direkt geçir
      return { authenticated: true };
    }

    return { authenticated: false, redirectTo: "/admin/login" };
  },

  onError: async (error: any) => {
    console.error("Auth Hatası:", error);
    return { error };
  },
  
  getPermissions: async () => null,
  getIdentity: async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return {
        id: data.user.id,
        name: "Admin",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=000&color=fff",
      };
    }
    return null;
  },
};
