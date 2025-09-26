// File: src/CartPanel.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartPanel({ cart, setCart, showCart, setShowCart }) {
  const navigate = useNavigate();

  const increment = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrement = (id) => {
    setCart(cart.map(item => {
      if(item.id === id){
        if(item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
        return null; // remove completely
      }
      return item;
    }).filter(Boolean));
  };

  const checkout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const total = cart.reduce((sum, item) => {
    const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + finalPrice * item.quantity;
  }, 0);

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform z-50 ${
      showCart ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className='p-4 flex justify-between items-center border-b'>
        <h2 className='text-lg font-bold'>Tu Carrito</h2>
        <button onClick={() => setShowCart(false)} className='text-gray-500 hover:text-black'>X</button>
      </div>
      <div className='p-4 flex flex-col gap-2'>
        {cart.length === 0 ? (
          <p className='text-gray-600'>El carrito está vacío.</p>
        ) : (
          cart.map((item) => {
            const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            return (
              <div key={item.id} className='flex justify-between items-center border-b pb-2'>
                <div className='flex flex-col'>
                  <span className='font-semibold'>{item.name}</span>
                  <span>Cantidad: {item.quantity}</span>
                  <span className='text-sm text-gray-500'>Precio unitario: ${formatPrice(finalPrice)}</span>
                </div>
                <div className='flex flex-col items-end gap-1'>
                  <span>${formatPrice(finalPrice * item.quantity)}</span>
                  <div className='flex gap-1'>
                    <button
                      onClick={() => decrement(item.id)}
                      className='bg-gray-200 px-2 rounded hover:bg-gray-300'
                    >
                      -
                    </button>
                    <button
                      onClick={() => increment(item.id)}
                      className='bg-gray-200 px-2 rounded hover:bg-gray-300'
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {cart.length > 0 && (
          <div className='mt-4'>
            <p className='font-bold'>Total: ${formatPrice(total)}</p>
            <button
              onClick={checkout}
              className='mt-2 w-full bg-brandYellow text-green-800 py-2 rounded-xl hover:bg-yellow-400 transition'
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
