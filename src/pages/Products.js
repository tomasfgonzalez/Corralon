import React, { useState, useEffect } from "react";
import { fetchProducts } from "../usecases/fetchProducts";
import { addToCart as addToCartService } from "../adapters/services/cartService";

export default function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleAddToCart = (product, quantity) => {
    setCart(addToCartService(cart, product, quantity));
  };

  const categories = ["Todos", ...new Set(products.map(p => p.category))];

  const filtered = products
    .filter(
      p =>
        (category === "Todos" || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : 0
    );

  if (loading) return <p className="p-6 text-center">Cargando productos...</p>;

  return (
    <div className="p-6">
      {/* Search & Filters */}
      <div className="flex flex-row flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="default">Ordenar</option>
          <option value="asc">Precio: Menor a Mayor</option>
          <option value="desc">Precio: Mayor a Menor</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

// Keep ProductCard as a UI-only component
const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className="bg-gray-100 border rounded-xl p-4 shadow hover:shadow-lg transition text-center flex flex-col items-center">
      <img
        src={product.image || "https://via.placeholder.com/128"}
        alt={product.name}
        className="rounded-xl mb-2 w-32 h-32 object-cover"
      />
      <h2 className="font-bold text-lg text-gray-800">{product.name}</h2>
      {discountedPrice ? (
        <p className="text-gray-600">
          <span className="line-through text-gray-400 mr-2">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-red-600 font-semibold">${discountedPrice}</span>
        </p>
      ) : (
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      )}
      <p className="text-sm text-gray-400 mb-2">Categoría: {product.category}</p>
      <p className="text-sm text-gray-700 font-medium mb-1">
        Precio unitario: ${discountedPrice || product.price.toFixed(2)}
      </p>
      <div className="flex gap-2 mt-1 items-center">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value))}
          className="border w-16 text-center rounded"
        />
        <button
          onClick={() => addToCart(product, quantity)}
          className="bg-green-600 text-white font-bold px-3 py-1 rounded transition"
        >
          Añadir
        </button>
      </div>
    </div>
  );
};
