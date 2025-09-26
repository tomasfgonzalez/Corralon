// File: src/usecases/productUseCases.js
import { productRepository } from "../infrastructure/repositories/productRepository";
import { supabase } from "../infrastructure/supabaseClient";

export const fetchProducts = async () => {
  return await productRepository.getAll();
};

export const addProduct = async (product) => {
  // Insert a new product
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id, product) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteProductById = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

export const toggleFavorite = async (id) => {
  const product = await supabase.from("products").select("*").eq("id", id).single();
  const { data, error } = await supabase
    .from("products")
    .update({ favorite: !product.data.favorite })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const applyDiscount = async (id, discountPercent) => {
  const { data, error } = await supabase
    .from("products")
    .update({ discount: discountPercent })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};
