import { supabase } from "../supabaseClient";

export const productRepository = {
  async getAll() {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    return data;
  },

  async getFavorites() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("favorite", true);
    if (error) throw error;
    return data;
  }
};
