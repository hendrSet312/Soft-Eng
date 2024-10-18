import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Stockable_logo.png';
import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <header className="bg-white text-white p-4 border-2">
      <div className="container mx-auto flex justify-between items-center pt-1">
        <img src={logo} alt="logo" className='h-8'/>
        <nav>
          <ul className="flex space-x-5 font-semibold">
            <li><Link to="/" className="hover:text-white hover:p-2 hover:bg-secondary hover:rounded-2xl ease-linear transition-all duration-200 text-black p-2">Home</Link></li>
            <li><Link to="/news" className="hover:text-white hover:p-2 hover:bg-secondary hover:rounded-2xl ease-linear transition-all duration-200 text-black p-2">News</Link></li>
            <li><Link to="/contact" className="hover:text-white hover:p-2 hover:bg-secondary hover:rounded-2xl ease-linear transition-all duration-200 text-black p-2">Contact</Link></li>
            <li>
              <Link to='/' className= 'text-black object-cover hover:text-secondary'>
                <CgProfile size={22}/>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
