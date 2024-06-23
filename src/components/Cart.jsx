import React from "react";

const Cart = ({ items, totalAmount }) => {
  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3>
    </div>
  );
};

export default Cart;
