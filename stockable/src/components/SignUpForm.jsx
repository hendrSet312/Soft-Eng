import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      console.log('User signed up successfully:', response.data);
      
      // Navigate to dashboard after successful signup
      navigate('/');  // Adjust the path as needed to match your dashboard route
    } catch (error) {
      console.error('Error signing up the user:', error);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign up now</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4 mb-4">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
            Sign up
          </button>
        </form>
        <p className="text-center mt-4">Already have an account? <a href="/login" className="text-green-600">Log in</a></p>
      </div>
    </div>
  );
};

export default SignUpForm;
