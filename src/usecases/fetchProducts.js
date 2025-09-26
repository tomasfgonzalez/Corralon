import { productRepository } from "../infrastructure/repositories/productRepository";

// Fetch products business rule
export async function fetchProducts() {
  try {
    const products = await productRepository.getAll();
    return products;
  } catch (err) {
    console.error("Error fetching products use case:", err);
    return [];
  }
}
