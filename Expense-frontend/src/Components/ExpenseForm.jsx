import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = ({ expenseToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: ''
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData(expenseToEdit);
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (expenseToEdit) {
      try {
        const response = await axios.put(`https://fullstack-expense-backend.onrender.com/expenses/edit/${expenseToEdit._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onSave();
      } catch (error) {
        console.error('Error updating expense:', error);
        alert('Failed to update expense. Please try again.');
      }
    } else {
      try {
        const response = await axios.post('https://fullstack-expense-backend.onrender.com/expenses/create', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({ name: '', category: '', amount: '' });
        onSave();
      } catch (error) {
        console.error('Error saving expense:', error);
        alert('Failed to save expense. Please try again.');
      }
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 " htmlFor="name">Expense Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {expenseToEdit ? 'Update Expense' : 'Save Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
