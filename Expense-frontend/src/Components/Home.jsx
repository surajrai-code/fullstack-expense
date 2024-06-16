import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import OrderForm from './OrderForm';
import RazorpayButton from './RazorpayButton';
import ExpensesDownload from './ExpensesDownload';

const Home = () => {
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [order, setOrder] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const checkPremiumStatus = async () => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        const decodedToken = JSON.parse(jsonPayload);
        const userRole = decodedToken.role;
  
        console.log('Decoded user role:', userRole);

        setIsPremium(userRole === 'isPrimium');
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkPremiumStatus();
  }, []);

  const handlePaymentSuccess = async () => {
    await fetchUpdatedUserData();
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleExpenseForm = () => {
    setShowExpenseForm(!showExpenseForm);
    setExpenseToEdit(null);
    setIsMenuOpen(false);
  };

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setShowExpenseForm(true);
  };

  const handleSaveExpense = () => {
    setShowExpenseForm(false);
    setExpenseToEdit(null);
  };

  const handleOrderCreated = (newOrder) => {
    setOrder(newOrder);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold p-2 rounded">Expense Tracker App</h1>
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="block sm:hidden text-gray-600 hover:text-gray-800 focus:text-gray-800 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
        {/* Desktop menu items */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={toggleExpenseForm}
            className="bg-green-500 text-white p-2 rounded"
          >
            {showExpenseForm ? 'Close Expense Form' : 'Add Expense'}
          </button>
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
          {!isPremium && <OrderForm onOrderCreated={handleOrderCreated} />}
          {order && <RazorpayButton order={order} onPaymentSuccess={handlePaymentSuccess} />}
          {isPremium && <ExpensesDownload />}
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white shadow-md sm:hidden">
          <button
            onClick={toggleExpenseForm}
            className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:text-gray-800 focus:text-gray-800"
          >
            {showExpenseForm ? 'Close Expense Form' : 'Add Expense'}
          </button>
          <button
            onClick={logoutHandler}
            className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:text-gray-800 focus:text-gray-800"
          >
            Logout
          </button>
          {!isPremium && (
            <OrderForm
              onOrderCreated={handleOrderCreated}
              className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:text-gray-800 focus:text-gray-800"
            />
          )}
          {order && (
            <RazorpayButton
              order={order}
              onPaymentSuccess={handlePaymentSuccess}
              className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:text-gray-800 focus:text-gray-800"
            />
          )}
          {isPremium && (
            <ExpensesDownload
              className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:text-gray-800 focus:text-gray-800"
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-2xl">
          {showExpenseForm && (
            <div className="mb-4">
              <ExpenseForm expenseToEdit={expenseToEdit} onSave={handleSaveExpense} />
            </div>
          )}

          {!showExpenseForm && (
            <div className="mb-4">
              <ExpenseList onEdit={handleEditExpense} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
