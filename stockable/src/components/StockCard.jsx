import React from 'react';
import { Link } from 'react-router-dom';

function getPerformanceColor(trend) {
  if (trend > 0) {
    return "green";
  } else if (trend < 0) {
    return "red";
  } else {
    return "gray"; // For cases where the trend is exactly 0
  }
}

const StockCard = ({ name, sentiment, price, change, symbol }) => {
  return (
    <Link 
      to={`/details/${symbol}`}
      state={{ price, change}} // Passing data to Details page
      className="block border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-bold mb-2">{name}</h3>
      <p className={`mb-1 text-${sentiment == 'positive' ? 'green' : sentiment == 'neutral' ? 'grey' : 'red'}-500`}>
        {sentiment}
      </p>
      <p className="text-gray-600">Price: ${price}</p>
      <p
        className={`mb-1 text-${
          parseFloat(change) > 0
            ? 'green'
            : parseFloat(change) === 0
            ? 'gray'
            : 'red'
        }-500`}
      >
        Change: {change} %
      </p>
    </Link>
  );
};

export default StockCard;
