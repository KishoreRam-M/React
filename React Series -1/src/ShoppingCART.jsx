import React from 'react';

const ShoppingCart = ({ items }) => {

    
  return (
    <div>
      <h2>Your Shopping Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty. Start adding some items!</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} — ${item.price * item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingCart;
