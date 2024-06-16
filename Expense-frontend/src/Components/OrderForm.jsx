import React, { useState } from "react";
import axios from "axios";

const OrderForm = ({ onOrderCreated }) => {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://fullstack-expense-backend.onrender.com/payment/create-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Order created:", response.data);
      onOrderCreated(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
      onClick={createOrder}
      disabled={loading}
    >
      {loading ? "Creating Order..." : "Buy Premium"}
    </button>
  );
};

export default OrderForm;
