import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginAndSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  // Function to handle form toggle between login and signup
  const toggleForm = () => {
    setIsLogin(prevIsLogin => !prevIsLogin); // Toggle isLogin state
    setFormData({  // Reset form data when switching between login and signup
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://fullstack-expense-backend.onrender.com/auth/login', {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed. Please check your credentials and try again.');
    }
  };

  // Function to handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('https://fullstack-expense-backend.onrender.com/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      alert('Signup successful! Please login.');
      setIsLogin(true); // Switch to login after successful signup
    } catch (error) {
      alert(error.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevShowConfirmPassword => !prevShowConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl">
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span onClick={togglePasswordVisibility} className="absolute top-2 right-2 cursor-pointer">
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Login
            </button>
            <p className="mt-4 text-center">
              Not registered?{' '}
              <button type="button" onClick={toggleForm} className="text-blue-500 underline">
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span onClick={togglePasswordVisibility} className="absolute top-2 right-2 cursor-pointer">
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility} className="absolute top-2 right-2 cursor-pointer">
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
              Sign Up
            </button>
            <p className="mt-4 text-center">
              Already registered?{' '}
              <button type="button" onClick={toggleForm} className="text-blue-500 underline">
                Login
              </button>
            </p>
          </form>
        )}
        <p className="mt-4 text-center">
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-blue-500 underline">
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginAndSignup;
