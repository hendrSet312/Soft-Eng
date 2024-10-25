import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HeaderLogSign } from '../components'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login successful:', response.data);

      // Navigate to dashboard after successful login
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-700 flex flex-col items-center gap-32">
      <HeaderLogSign />
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="text"
              name="email" //samain kayak diatas (email)
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600">
            Log in
          </button>
        </form>
        <p className="text-center mt-4">Don't have an account? <a href="/signup" className="text-green-600">Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
