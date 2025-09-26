// File: src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Admin from './pages/admin/Admin';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';
import Contact from './pages/Contact'; // Make sure this matches your filename

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <Router>
      <Navbar cart={cart} setCart={setCart} showCart={showCart} setShowCart={setShowCart} />

      <Routes>
        <Route path='/' element={<Home cart={cart} setCart={setCart} />} />
        <Route path='/productos' element={<Products cart={cart} setCart={setCart} />} />
        <Route path='/admin' element={<Admin orders={orders} setOrders={setOrders} />} />
        <Route path='/checkout' element={<Checkout cart={cart} setCart={setCart} orders={orders} setOrders={setOrders} />} />
        <Route path='/resumen' element={<OrderSummary cart={cart} />} />
        <Route path='/contactanos' element={<Contact />} /> {}
      </Routes>
    </Router>
  );
}

export default App;
