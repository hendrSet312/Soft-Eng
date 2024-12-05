// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const Details = () => {
//   const { symbol } = useParams(); // Get the stock symbol from the URL
//   const [stockData, setStockData] = useState(null);

//   useEffect(() => {
//     const fetchStockData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/stock/${symbol}`);
//         setStockData(response.data); // Update state with stock data
//       } catch (error) {
//         console.error('Error fetching stock data:', error);
//       }
//     };

//     fetchStockData();
//   }, [symbol]);

//   if (!stockData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-bold mb-4">{stockData.name}</h1>
//       <p className="text-lg">Price: ${stockData.price}</p>
//       <p className="text-lg">Change: {stockData.change}%</p>

//       {/* Add more stock details and charts here */}
//     </div>
//   );
// };

// export default Details;



// Ini buat dummy, cuma bisa klik yang JNJ
// npm install react-chartjs-2 chart.js
// npm install chartjs-plugin-3d
import React from 'react';
import { useParams } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const mockStockData = {
  JNJ: {
    name: 'NVDA Corporation',
    price: 122.64,
    performance: {
      oneYearReturn: '157.96%',
      threeYearReturn: '300%',
      fiveYearReturn: '450%',
    },
    sentiment: { positive: 78.3, neutral: 17.4, negative: 4.5 },
    priceHistory: [100, 110, 120, 125, 115, 135, 122], // Mock price data
  },
};

const Details = () => {
  const { symbol } = useParams();
  const stock = mockStockData[symbol];

  if (!stock) {
    return <div>Stock details not found.</div>;
  }

  // Chart data for line chart (price history)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: `${stock.name} Stock Price`,
        data: stock.priceHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Chart data for sentiment pie chart with simulated 3D shadow effect
  const pieChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Overview',
        data: [
          stock.sentiment.positive,
          stock.sentiment.neutral,
          stock.sentiment.negative,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart options with shadow effect
  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw) {
              label += context.raw + '%';
            }
            return label;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
        backgroundColor: (context) => {
          const value = context.raw || 0;
          return context.dataset.backgroundColor[context.index];
        },
        // Adding shadow effect for a pseudo-3D look
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
  };

  // Helper function to determine the color based on the percentage
  const getReturnColor = (percentage) => {
    const num = parseFloat(percentage.replace('%', ''));
    if (num > 0) return 'text-green-500'; // Positive
    if (num < 0) return 'text-red-500'; // Negative
    return 'text-gray-500'; // Neutral (0%)
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{stock.name}</h1>

      {/* Stock Price Chart */}
      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Stock Price History</h2>
        <Line data={lineChartData} />
      </div>

      {/* Flex container for pie chart and performance overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
        {/* Sentiment Overview - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Sentiment Overview</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-2xl font-semibold mb-2">Performance Overview</h2>
          {/* 1-Year Return */}
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-lg font-semibold">1-Year Return:</span>
            <span className={`${getReturnColor(stock.performance.oneYearReturn)} text-xl`}>
              {stock.performance.oneYearReturn}
            </span>
          </div>

          {/* 3-Year Return */}
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-lg font-semibold">3-Year Return:</span>
            <span className={`${getReturnColor(stock.performance.threeYearReturn)} text-xl`}>
              {stock.performance.threeYearReturn}
            </span>
          </div>

          {/* 5-Year Return */}
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-lg font-semibold">5-Year Return:</span>
            <span className={`${getReturnColor(stock.performance.fiveYearReturn)} text-xl`}>
              {stock.performance.fiveYearReturn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;



