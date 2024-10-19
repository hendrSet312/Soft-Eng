import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';  // Importing social media icons from 'react-icons'
import { FaXTwitter } from "react-icons/fa6";
import logo from '../assets/Stockable_logo.png';  // Importing the logo image

const Footer = () => {
  return (
    <footer className="bg-white text-black p-6 space-y-0">
      <div className="container mx-auto flex flex-col items-center">
        <img src={logo} alt="" className='h-20'/>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mb-4 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className=" hover:text-blue-700 text-black">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-400">
            <FaXTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-pink-500">
            <FaInstagram size={24} />
          </a>
        </div>

        {/* Copyright Text */}
        <div className="text-center mt-5">
          <p>&copy; 2024 STOCKABLES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
