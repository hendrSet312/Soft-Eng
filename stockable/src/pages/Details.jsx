import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { getDateSevenDaysAgo } from '../../server/misc/date_operation';
import {fetch_stocks_database, fetch_news_database} from '../../server/database/get_public_data';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaPlus } from "react-icons/fa6";
import NewsCard from '../components/NewsCard';
import { parse_date } from '../../server/misc/date_operation';
import {fetchStockData} from '../utils/api';

async function getTimeSeries(symbol){
  let timeseries_data = await axios.get(`http://localhost:5000/timeseries-data/fetch-timeseries-data/${symbol}`);
  return timeseries_data.data;
}

function getPerformanceColor(trend) {
  if (trend > 0) {
    return "green";
  } else if (trend < 0) {
    return "red";
  }
  
  return "gray";
}


const ranges = [
  { label: '1 Day', value: '1d' },
  { label: '5 Days', value: '5d' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: 'YTD', value: 'ytd' },
  { label: '5 Years', value: '5y' },
  { label: 'All', value: 'all' },
];


const prepareCandlestickChartData = async (symbol, stockInfo, range_date) => {
  try {
    let timeseries_data = await getTimeSeries(symbol);
    timeseries_data = timeseries_data.data;
    console.log("Sample Date Entry:", timeseries_data[0].date);

    // Define the current date
    const now = new Date();
    console.log(now);

    let filteredData;

    switch (range_date) {
      case '1d':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now).setDate(now.getDate() - 1))
        );
        break;
      
      case '5d':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now).setDate(now.getDate() - 5))
        );
        break;
      
      case '3m':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now).setMonth(now.getMonth() - 3))
        );
        break;
      
      case '6m':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now).setMonth(now.getMonth() - 6))
        );
        break;
      
      case 'ytd':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now.getFullYear(), 0, 1))
        );
        break;
      
      case '5y':
        filteredData = timeseries_data.filter(entry =>
          new Date(entry.date) >= new Date(new Date(now).setFullYear(now.getFullYear() - 5))
        );
        break;      
      default:
        filteredData = timeseries_data;
    }

    console.log(filteredData);

    const dates = filteredData.map(entry => new Date(entry.date));
    const open = filteredData.map(entry => entry.open);
    const high = filteredData.map(entry => entry.high);
    const low = filteredData.map(entry => entry.low);
    const close = filteredData.map(entry => entry.close);

    const candlestickChartData = {
      x: dates,
      open: open,
      high: high,
      low: low,
      close: close,
      type: 'candlestick',
      name: `${stockInfo.stock_name} Stock Price`,
      xaxis: 'x',
      yaxis: 'y',
    };

    return candlestickChartData;
  } catch (err) {
    console.error('Error preparing candlestick chart data:', err);
    throw err;
  }
};


const getDetailsColor = (value) => {
  return value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-500';
};


const Details = () => {
  const { symbol } = useParams();
  const [stockInformation, setStockInformation] = useState(null);
  const location = useLocation();
  const [stockQuotes, setStockQuotes] = useState({
    price: location.state?.price || 0, // Gunakan state jika tersedia
    change: location.state?.change || 0, // Gunakan state jika tersedia
  });
  const [candlestickChartData, setCandlestickChartData] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedRange, setSelectedRange] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollowButtonClick = () => {
    setIsFollowed((prevState) => !prevState); // Toggle status
  };
  
  const [, set] = useState(null);

  useEffect(() => {
    const fetchNewsDashboard = async () => {      
      try{
        const company_data = await fetch_stocks_database();
        
        const id_comp =  company_data.find(company => symbol == company.stock_symbol).stock_id;

        const lastweekDate  = getDateSevenDaysAgo();
        let news_response = await fetch_news_database(lastweekDate,id_comp);
        
        if(news_response.length === 0){
          const currentDate = getCurrentDate();
          const news_data = await fetchNewsData(symbol,lastweekDate,currentDate);
          
          for(const {id,title,image, datetime, url} of news_data){
            const res = await axios.post('http://localhost:5000/database/news_stock', {
              id_news : id,
              id_company :id_comp, 
              title : title, 
              published_date : datetime, 
              image_link : image,
              url : url
            });
          }
          news_response = await fetch_news_database(lastweekDate,id_comp);
        }

        setNews(news_response.flat());
      }catch(error){
        console.error('Error fetching dashboard news:', error);
      }
    }

    fetchNewsDashboard();
    
    // const fetchStockInformation = async () => {
    //   try {
    //     let stockData = await fetch_stocks_database();
    //     const stockInfo = stockData.find(company => symbol === company.stock_symbol);
    //     setStockInformation(stockInfo);
  
    //     const candlestickData = await prepareCandlestickChartData(symbol, stockData, selectedRange);
    //     setCandlestickChartData(candlestickData);
    //   } catch (err) {
    //     console.error('Failed to fetch stock information.', err);
    //   }
    // };
    
    // if (location.state) {
    //   SetStockQuotes({
    //     price: location.state.price,
    //     change: location.state.change,
    //   });
    //   setLoading(false);
    // }

    const fetchStockInformation = async () => {
      try {
        const stockData = await fetch_stocks_database();
        const stockInfo = stockData.find(
          (company) => symbol === company.stock_symbol
        );
        setStockInformation(stockInfo);

        const candlestickData = await prepareCandlestickChartData(
          symbol,
          stockData,
          selectedRange
        );
        setCandlestickChartData(candlestickData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error("Failed to fetch stock information.", err);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchStockInformation();
  }, [symbol, selectedRange]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stockInformation) {
    return <div>No stock information found for the given symbol.</div>;
  }

  // Chart data for sentiment pie chart with simulated 3D shadow effect
  // const pieChartData = {
  //   labels: ['Positive', 'Neutral', 'Negative'],
  //   datasets: [
  //     {
  //       label: 'Sentiment Overview',
  //       data: [
  //         stock.sentiment.positive,
  //         stock.sentiment.neutral,
  //         stock.sentiment.negative,
  //       ],
  //       backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // Pie chart options with shadow effect
  // const pieChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         label: (context) => {
  //           let label = context.label || '';
  //           if (label) {
  //             label += ': ';
  //           }
  //           if (context.raw) {
  //             label += context.raw + '%';
  //           }
  //           return label;
  //         },
  //       },
  //     },
  //   },
  //   elements: {
  //     arc: {
  //       borderWidth: 1,
  //       backgroundColor: (context) => {
  //         const value = context.raw || 0;
  //         return context.dataset.backgroundColor[context.index];
  //       },
  //       shadowOffsetX: 3,
  //       shadowOffsetY: 3,
  //       shadowBlur: 10,
  //       shadowColor: 'rgba(0, 0, 0, 0.2)',
  //     },
  //   },
  // };

  // Helper function to determine the color based on the percentage
  // const getReturnColor = (percentage) => {
  //   const num = parseFloat(percentage.replace('%', ''));
  //   if (num > 0) return 'text-green-500'; // Positive
  //   if (num < 0) return 'text-red-500'; // Negative
  //   return 'text-gray-500'; // Neutral (0%)
  // };

  const getPreview = (text) => {
    const words = text.split(" ");
    return words.length > 40 ? words.slice(0, 40).join(" ") + "..." : text;
  };

  return (
    <div>
      <Header />
      <div className="container md:p-8 xl:px-6 xl:pt-4">
        <div className="flex items-center mb-4 gap-4">
          {/* <img src={stockInformation.image} alt="Stock Image" className="w-12 h-12" /> */}
          <h1 className="text-4xl font-bold">
            {stockInformation.stock_name} ({symbol})
          </h1>
          <button
            className={`px-4 py-2 border border-black rounded flex items-center ${
              isFollowed
                ? "bg-green-500 text-white hover:bg-red-500 hover:text-white"
                : "bg-white hover:bg-green-500 hover:text-white"
            }`}
            onClick={handleFollowButtonClick}
          >
            <FaPlus className="mr-2" />
            {isFollowed ? 'Unfollow' : 'Follow'}
          </button>
        </div>

        <hr className="border-t border-gray-500 my-4" />

        <div>
          <h2 className="text-2xl font-semibold mb-2">Stock Price Overview</h2>
          <div
            className={`inline-block px-2 py-1 rounded text-white font-semibold mt-4 ${
              stockQuotes.change > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {stockQuotes.change}%
          </div>
          <p className="text-3xl font-semibold">${stockQuotes.price}</p>
        </div>

  
        {/* Stock Price Chart */}
        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-2">Stock Price History</h2>
          <div className="mb-4">
            {ranges.map((range) => (
              <button
                key={range.value}
                className={`mr-2 px-4 py-2 rounded ${
                  selectedRange === range.value
                    ? 'bg-black text-white' // Selected button styles
                    : 'bg-white text-black border border-black' // Default button styles
                }`}
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
          {candlestickChartData && (
          <div style={{ width: '100%', height: '100%' }}>
            <Plot
              data={[candlestickChartData]}
              layout={{
                xaxis: {
                  title: 'Date',
                  type: 'date',
                },
                yaxis: {
                  title: 'Price',
                },
                autosize: true,
                responsive: true,
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        </div>
  
        {/* Stock Description */}
        <div className="my-6">
          <p className="text-2xl font-semibold mb-2">
            <span>{stockInformation.stock_symbol}</span> / <span>{stockInformation.sector}</span>
          </p>

          <p className="text-lg mt-2">
            {isExpanded
              ? stockInformation.description // Show full text
              : getPreview(stockInformation.description)} {/* Show preview */}
          </p>        
          <button
            className="text-blue-500 underline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
      </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
  
          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Sentiment Overview</h2>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div> */}
  
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-2xl font-semibold mb-2">Performance Overview</h2>


          </div>
        </div>
  
        <div className="news px-10">
            <h2 className="text-2xl font-semibold mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((newsItem,index) => (
                <NewsCard
                  key={index}
                  url = {newsItem.url}
                  image={newsItem.image_link}
                  title={newsItem.title}
                  stockSymbol={newsItem.stock_symbol}
                  date = {parse_date(newsItem.published_date)}
                />
              ))}
            </div>
        </div>
  
        
      </div>

      <Footer />

    </div>
  );
};

export default Details;



