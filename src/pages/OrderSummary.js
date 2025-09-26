// File: src/OrderSummary.js
import React from 'react';


export default function OrderSummary({ cart }) {
return (
<div className='p-10 max-w-md mx-auto text-center'>
<h1 className='text-2xl font-bold mb-4'>Resumen de la Orden</h1>
<p>¡Gracias por tu compra en El Corralón!</p>
<p>Los productos se enviarán a tu dirección.</p>
</div>
);
}