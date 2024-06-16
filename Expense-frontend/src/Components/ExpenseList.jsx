import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseList = ({ onEdit }) => {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    fetchExpenses();
  }, [currentPage]); 

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`https://fullstack-expense-backend.onrender.com/expenses/get?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data.expenses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://fullstack-expense-backend.onrender.com/expenses/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1); 
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1); 
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Expense List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses && expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border px-4 py-2 text-center">{expense.name}</td>
                <td className="border px-4 py-2 text-center">{expense.category}</td>
                <td className="border px-4 py-2 text-center">{expense.amount}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(expense)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-center"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button onClick={prevPage} className="bg-gray-300 text-gray-700 px-3 py-1 rounded mr-2">
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button onClick={nextPage} className="bg-gray-300 text-gray-700 px-3 py-1 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
