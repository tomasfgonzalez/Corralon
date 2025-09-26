import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminProducts({ setLogged }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    favorite: false,
    discount: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        // Filter out null/undefined rows
        setProducts(data.filter(p => p));
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addOrUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Completa todos los campos');
      return;
    }

    let imgUrl = newProduct.image;
    try {
      const url = new URL(imgUrl);
      url.searchParams.set('w', '128');
      url.searchParams.set('h', '128');
      imgUrl = url.toString();
    } catch (e) {}

    if (editingId) {
      // Update
      const { data, error } = await supabase
        .from('products')
        .update({ ...newProduct, price: parseFloat(newProduct.price), image: imgUrl })
        .eq('id', editingId)
        .select();
      if (error || !data || !data[0]) {
        alert('Error al actualizar producto');
        console.error(error);
      } else {
        setProducts(products.map(p => (p && p.id === editingId ? data[0] : p)));
        setEditingId(null);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...newProduct, price: parseFloat(newProduct.price), image: imgUrl }])
        .select();
      if (error || !data || !data[0]) {
        alert('Error al agregar producto');
        console.error(error);
      } else {
        setProducts([...products, data[0]]);
      }
    }

    setNewProduct({ name: '', price: '', category: '', image: '', favorite: false, discount: 0 });
  };

  const editProduct = (p) => {
    if (!p) return;
    setNewProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      favorite: p.favorite || false,
      discount: p.discount || 0,
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar producto');
      console.error(error);
    } else {
      setProducts(products.filter(p => p && p.id !== id));
    }
  };

  const toggleFavorite = async (id) => {
    const product = products.find(p => p && p.id === id);
    if (!product) return;
    const { data, error } = await supabase.from('products').update({ favorite: !product.favorite }).eq('id', id).select();
    if (!error && data && data[0]) {
      setProducts(products.map(p => (p && p.id === id ? data[0] : p)));
    }
  };

  const applyDiscount = async (id) => {
    const percent = prompt('Ingrese el porcentaje de descuento (ej: 20, 0 para quitar):');
    const discount = parseFloat(percent);
    if (!isNaN(discount) && discount >= 0 && discount < 100) {
      const { data, error } = await supabase.from('products').update({ discount }).eq('id', id).select();
      if (!error && data && data[0]) {
        setProducts(products.map(p => (p && p.id === id ? data[0] : p)));
      }
    } else {
      alert('Porcentaje inválido');
    }
  };

  const filteredProducts = products.filter(p => p && (!filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase())));

  if (loading) return <p className="p-10 text-center">Cargando productos...</p>;

  return (
    <div className="p-10 space-y-8">
      {/* Form */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">{editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <input type="text" placeholder="Nombre" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="Categoría" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="border p-2 rounded" />
          <input type="text" placeholder="URL Imagen" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} className="border p-2 rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={newProduct.favorite} onChange={e => setNewProduct({ ...newProduct, favorite: e.target.checked })} />
            Marcar como favorito
          </label>
          <div className="flex gap-2">
            <button onClick={addOrUpdateProduct} className="bg-brandGreen text-brandYellow py-2 rounded hover:bg-green-700 transition">{editingId ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            {editingId && <button onClick={() => { setEditingId(null); setNewProduct({ name: '', price: '', category: '', image: '', favorite: false, discount: 0 }); }} className="bg-gray-300 text-black py-2 rounded hover:bg-gray-200 transition">Cancelar</button>}
          </div>
        </div>
      </div>

      {/* List */}
      <div>
        <h2 className="font-semibold mb-2">Productos Existentes</h2>
        <input type="text" placeholder="Filtrar..." value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded mb-4 w-full max-w-md" />
        {filteredProducts.length === 0 ? (
          <p className="text-gray-600">No se encontraron productos.</p>
        ) : (
          <ul className="space-y-2">
            {filteredProducts.map(p => (
              <li key={p.id} className="flex items-center justify-between border p-2 rounded bg-white">
                <div className="flex items-center gap-3">
                  {p.image ? <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">IMG</div>}
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {p.favorite && <span className="text-yellow-500 font-semibold">★ Favorito</span>}
                      <span className="text-xs text-gray-400">({p.category})</span>
                      {p.discount > 0 ? <>
                        <span className="line-through mr-2">${p.price.toFixed(2)}</span>
                        <span className="text-red-600 font-semibold">${(p.price * (1 - p.discount / 100)).toFixed(2)}</span>
                      </> : <>${parseFloat(p.price).toFixed(2)}</>}
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => editProduct(p)} className="bg-yellow-400 text-green-800 px-2 py-1 rounded hover:bg-yellow-300">Editar</button>
                  <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
                  <button onClick={() => toggleFavorite(p.id)} className={`px-2 py-1 rounded ${p.favorite ? 'bg-green-500 text-yellow-300' : 'bg-gray-300 text-black'}`}>{p.favorite ? 'Favorito' : 'Marcar Favorito'}</button>
                  <button onClick={() => applyDiscount(p.id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Aplicar Descuento</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => setLogged(false)} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
    </div>
  );
}
