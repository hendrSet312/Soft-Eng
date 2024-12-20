import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ image, title, stockSymbol, date, url, sentiment }) => {
  return (
    <Link 
      to={url} 
      className="block border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
    >
      <img src={image} alt={title} className="w-full h-32 object-cover mb-4 rounded" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-800 text-sm mb-1">Stock: {stockSymbol}</p>
      <p className="text-gray-700 text-xs">{date}</p>
      <p className={`text-xs text-${sentiment === 'positive' ? 'green' : sentiment === 'neutral' ? 'gray' : 'red'}-500`}>
        {sentiment}
      </p>
    </Link>
  );
};


export default NewsCard;
