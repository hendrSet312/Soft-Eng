import React from 'react';

const NewsCard = ({ image, title, stockSymbol, date }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <img src={image} alt={title} className="w-full h-32 object-cover mb-4 rounded" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-800 text-sm mb-1">Stock : {stockSymbol}</p>
      <p className="text-gray-700 text-xs">{date}</p>
    </div>
  );
};


export default NewsCard;
