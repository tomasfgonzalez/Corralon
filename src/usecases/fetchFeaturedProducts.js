import { productRepository } from "../infrastructure/repositories/productRepository";

export async function fetchFeaturedProducts() {
  try {
    const featured = await productRepository.getFavorites();
    return featured;
  } catch (err) {
    console.error("Error fetching featured products:", err);
    return [];
  }
}
