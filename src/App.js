import React, { useState } from "react";
import CheckoutForm from "./components/CheckoutForm";
import Cart from "./components/Cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY); // Replace with your actual Stripe publishable key

const App = () => {
  const [items] = useState([
    { name: "Item 1", price: 50 },
    { name: "Item 2", price: 30 },
  ]);

  const totalAmount = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="mx-auto max-w-4xl my-8 flex flex-col gap-5">
      <Cart items={items} totalAmount={totalAmount} />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default App;
