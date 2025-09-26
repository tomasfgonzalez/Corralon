// File: src/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartPanel from './CartPanel';

export default function Navbar({ cart, setCart, showCart, setShowCart }) {
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setPop(true);
      const timeout = setTimeout(() => setPop(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="bg-brandGreen text-white p-4 flex justify-between items-center">
        {/* Site title */}
        <Link to="/" className="font-bold tracking-wide text-xl hover:underline">
          Mercado -El Corralón- de Junín
        </Link>

        {/* Navigation links */}
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline font-semibold tracking-wide">Inicio</Link>
          <Link to="/productos" className="hover:underline font-semibold tracking-wide">Productos</Link>
          <Link to="/admin" className="hover:underline font-semibold tracking-wide">Admin</Link>
          <Link to="/contactanos" className="hover:underline font-semibold tracking-wide">Contáctanos</Link>

          {/* Cart icon */}
          <div 
            onClick={() => setShowCart(!showCart)} 
            className="relative cursor-pointer px-2 py-1 rounded"
            aria-label="Carrito de compras"
          >
            <span 
              className={`text-yellow-300 ${pop ? 'cart-pop' : ''}`}
              style={{ fontSize: '2rem', fontFamily: 'Arial Black, sans-serif' }}
            >
              🛒
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </nav>

      <CartPanel cart={cart} setCart={setCart} showCart={showCart} setShowCart={setShowCart} />

      {/* Cart pop animation */}
      <style>
        {`
          .cart-pop {
            animation: pop 0.3s ease;
          }
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}
