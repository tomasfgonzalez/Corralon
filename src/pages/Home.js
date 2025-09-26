import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner.jpg";
import { fetchFeaturedProducts } from "../usecases/fetchFeaturedProducts";
import { addToCart as addToCartService } from "../adapters/services/cartService";

export default function Home({ cart, setCart }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchFeaturedProducts();
      setFeatured(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleAddToCart = (product) => {
    setCart(addToCartService(cart, product, 1));
  };

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden">
        <img
          src={bannerImage}
          alt="El Corralón"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center p-4">
          <p className="text-white text-lg tracking-widest mb-2">MERCADO</p>
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide mb-2">
            EL CORRALÓN
          </h1>
          <p className="text-white text-lg tracking-widest mb-4">DE JUNÍN</p>
          <Link
            to="/productos"
            className="mt-2 bg-yellow-500 text-white font-bold px-6 py-3 rounded-full transition"
          >
            Ordenar ahora
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center col-span-full">
            Cargando productos destacados...
          </p>
        ) : featured.length === 0 ? (
          <p className="text-center col-span-full">
            No hay productos destacados. Marca productos como favoritos en el
            panel de administración.
          </p>
        ) : (
          featured.map((product) => {
            const discountedPrice = product.discount
              ? (product.price * (1 - product.discount / 100)).toFixed(2)
              : null;

            return (
              <div
                key={product.id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition text-center"
              >
                <div className="w-48 h-48 mx-auto mb-2">
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h2 className="font-semibold text-lg">{product.name}</h2>
                {discountedPrice ? (
                  <p className="text-gray-600">
                    <span className="line-through text-gray-400 mr-2">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-red-600 font-semibold">
                      ${discountedPrice}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                )}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-green-600 text-white font-bold py-2 rounded-xl transition"
                >
                  Añadir al Carrito
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
