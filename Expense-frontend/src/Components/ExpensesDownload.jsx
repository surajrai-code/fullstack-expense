import React from 'react';
import axios from 'axios';

const ExpensesDownload = () => {
  const handleDownloadClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/expenses/download', {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading expenses:', error);
    }
  };

  return (
    <button
      onClick={handleDownloadClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download Expenses
    </button>
  );
};

export default ExpensesDownload;
