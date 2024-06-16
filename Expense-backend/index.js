const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/payment', paymentRoutes);

// Define route handler for the root URL 
app.get('/', (req, res) => {
  res.send('Hello, welcome!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
