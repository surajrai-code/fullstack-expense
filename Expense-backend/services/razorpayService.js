const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (userId) => {
  const orderOptions = {
    amount: 100,
    currency: "INR",
    receipt: `receipt_order_${userId}`,
    payment_capture: 1
  };

  const order = await razorpay.orders.create(orderOptions);
  return order;
};

exports.verifySignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
