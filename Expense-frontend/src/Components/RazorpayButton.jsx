import React, { useEffect } from 'react';
import axios from 'axios';

const RazorpayButton = ({ order }) => {
  useEffect(() => {
    if (order) {
      const loadRazorpay = async () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const amount = parseInt(order.amount);
          if (isNaN(amount) || amount < 100) {
            alert('Invalid amount. Amount should be an integer and minimum value is 100');
            return;
          }

          const options = {
            key: 'rzp_test_a5KiTBGOT1tp0Y',
            amount: amount,
            currency: order.currency,
            name: 'Expense Tracker',
            description: 'Test Transaction',
            order_id: order.id,
            handler: async (response) => {
              const token = localStorage.getItem('token');

              try {
                const verifyResponse = await axios.post(
                  'https://fullstack-expense-backend.onrender.com/payment/verify-payment',
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    }
                  }
                );

                // Log the entire response to see its structure
                console.log('Verify Response:', verifyResponse);

                if (verifyResponse.status === 200 && verifyResponse.data.token) {
                  localStorage.setItem('token', verifyResponse.data.token);
                  alert('Payment successful, user upgraded to premium');
                } else {
                  alert('Payment verification failed');
                }
              } catch (error) {
                console.error('Error verifying payment:', error);
                alert('Payment verification failed');
              }
            },
            theme: {
              color: '#3399cc',
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        };
      };

      loadRazorpay();
    }
  }, [order]);

  return null;
};

export default RazorpayButton;
