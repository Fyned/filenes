import { AuthBindings } from "@refinedev/core";
import { supabase } from "../../lib/supabaseClient";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: { message: error.message, name: "Giriş Hatası" },
      };
    }

    // Admin kontrolü
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single();

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: { message: "Bu panele erişim yetkiniz yok.", name: "Yetkisiz Erişim" },
        };
      }
    }

    return { success: true, redirectTo: "/admin" };
  },
  logout: async () => {
    await supabase.auth.signOut();
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const { data } = await supabase.auth.getSession();
    const { user } = data.session || {};

    if (user) {
      // Session var, ama admin mi tekrar teyit edelim (güvenlik için)
       const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
        
       if (profile?.is_admin) return { authenticated: true };
    }

    return { authenticated: false, redirectTo: "/login" };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  // Opsiyonel metotlar
  register: async () => ({ success: false, error: { message: "Kayıt kapalı", name: "Error" } }),
  forgotPassword: async () => ({ success: false, error: { message: "Yönetici ile görüşün", name: "Error" } }),
  updatePassword: async () => ({ success: false, error: { message: "Yönetici ile görüşün", name: "Error" } }),
  getPermissions: async () => null,
  getIdentity: async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return {
        id: data.user.id,
        name: data.user.email,
        avatar: "https://i.pravatar.cc/150",
      };
    }
    return null;
  },
};