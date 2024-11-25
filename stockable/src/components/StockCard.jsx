import React from 'react';

const StockCard = ({ name, sentiment, price, change }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className={`mb-1 text-${sentiment > 0 ? 'green' : 'red'}-500`}>
        {sentiment > 0.5 ? 'Positive' : 'Negative'}: {sentiment}
      </p>
      <p className="text-gray-600">Price: ${price}</p>
      <p className={`mb-1 text-${change > 0 ? 'green' : 'red'}-500`}>Change: %{change}</p>
    </div>
  );
};

export default StockCard;
