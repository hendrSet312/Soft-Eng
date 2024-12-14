import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { getDateSevenDaysAgo } from '../../server/misc/date_operation';
import {fetch_stocks_database, fetch_news_database} from '../../server/database/get_public_data';

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

async function  calculateStockTrend(Symbol, range)  {
  try{
    let timeseries_data = getTimeSeries(Symbol);
    
    const currentDate = new Date();

    let startDate;

    switch (range) {
      case "1m":
        startDate = new Date(currentDate);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "ytd":
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      case "3y":
        startDate = new Date(currentDate);
        startDate.setFullYear(startDate.getFullYear() - 3);
        break;
      case "5y":
        startDate = new Date(currentDate);
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        throw new Error("Invalid range. Use '1m', 'ytd', '3y', or '5y'.");
    }

    const filteredData = timeseries_data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= currentDate;
    });
    

    if (filteredData.length < 2) {
      throw new Error("Insufficient data to calculate trend.");
    }
    
    const firstData = filteredData[0];
    const lastData = filteredData[filteredData.length - 1];

    const trendPercentage = ((lastData.close - firstData.open) / firstData.open) * 100;
    return trendPercentage.toFixed(2); 

  }catch(err){
    console.error(err);
  }
  
}


const prepareCandlestickChartData = async (symbol, stockInfo, range_date) => {
  try {
    let timeseries_data = getTimeSeries(symbol);

    switch (range_date) {
      case '1d':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.setDate(now.getDate() - 1)));
        break;
      case '5d':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.setDate(now.getDate() - 5)));
        break;
      case '3m':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.setMonth(now.getMonth() - 3)));
        break;
      case '6m':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.setMonth(now.getMonth() - 6)));
        break;
      case 'ytd':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.getFullYear(), 0, 1));
        break;
      case '5y':
        filteredData = timeseries_data.filter(entry => new Date(entry.date) >= new Date(now.setFullYear(now.getFullYear() - 5)));
        break;
      default:
        filteredData = timeseries_data;
    }

    const dates = timeseries_data.map(entry => new Date(entry.date));
    const open = timeseries_data.map(entry => entry.open);
    const high = timeseries_data.map(entry => entry.high);
    const low = timeseries_data.map(entry => entry.low);
    const close = timeseries_data.map(entry => entry.close);

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
  }catch {
    throw console(' preparing candlestick chart data:', err);
  }
}




const Details = () => {
  const { symbol } = useParams();
  const [stockInformation, setStockInformation] = useState(null);
  const [candlestickChartData, setCandlestickChartData] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedRange, setSelectedRange] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [monthReturn, setMonthReturn] = useState(null);
  const [ytdReturn, setYtdReturn] = useState(null);
  const [threeYearReturn, setThreeYearReturn] = useState(null);
  const [fiveYearReturn, setFiveYearReturn] = useState(null);

  const handleFollowButtonClick = () => {
    setIsFollowed(true); // Change the state to true
  };
  
  const [, set] = useState(null);

  useEffect(() => {
    const fetchNewsDashboard = async () => {      
      try{
        const company_data = await fetch_stocks_database();
        const id_comp =  company_data.find(company => symbol === company.stock_symbol).stock_id;

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
    
    const fetchStockInformation = async () => {
      try {
        let stockData = await fetch_stocks_database();
        const stockInfo = stockData.find(company => symbol === company.stock_symbol);
        setStockInformation(stockInfo);
        const lineChart = await prepareCandlestickChartData(symbol,stockData,selectedRange);
        const monthReturn = await calculateStockTrend(symbol,'1m');
        const ytdReturn = await calculateStockTrend(symbol,'ytd');
        const threeYearReturn = await calculateStockTrend(symbol,'3y');
        const fiveYearReturn = await calculateStockTrend(symbol,'5y');

        setCandlestickChartData(lineChart);
        setMonthReturn(monthReturn);
        setYtdReturn(ytdReturn);
        setThreeYearReturn(threeYearReturn);
        setFiveYearReturn(fiveYearReturn);
        await fetchNewsDashboard();

      } catch (err) {
        set('Failed to fetch stock information.', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStockInformation();
  }, [symbol]);

  if (loading) {
    return <div>Loading...</div>;
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-bold">{stockInformation.stock_name}</h1>
        <button
          className={`ml-auto px-4 py-2 bg-green-500 text-white rounded border border-black hover:bg-white hover:text-black`}
          onClick={handleFollowButtonClick}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </button>
      </div>

      {/* Stock Price Chart */}
      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Stock Price History</h2>
        <div className="mb-4">
          <button className="mr-2" onClick={() => setSelectedRange('1d')}>1 Day</button>
          <button className="mr-2" onClick={() => setSelectedRange('5d')}>5 Days</button>
          <button className="mr-2" onClick={() => setSelectedRange('3m')}>3 Months</button>
          <button className="mr-2" onClick={() => setSelectedRange('6m')}>6 Months</button>
          <button className="mr-2" onClick={() => setSelectedRange('ytd')}>YTD</button>
          <button className="mr-2" onClick={() => setSelectedRange('5y')}>5 Years</button>
          <button className="mr-2" onClick={() => setSelectedRange('all')}>All</button>
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
        <button
          className="text-blue-500 underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        {isExpanded && (
          <p className="text-lg mt-2">{stockInformation.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">

        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Sentiment Overview</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div> */}

        <div className="grid grid-cols-1 gap-4">
                  <h2 className="text-2xl font-semibold mb-2">Performance Overview</h2>

                  <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                  <span className="text-lg font-semibold">1-Month Return:</span>
                  <span className={`${getPerformanceColor(monthReturn)} text-xl`}>
                      {monthReturn}
                  </span>
                  </div>

                  {/* 1-Year Return */}
                  <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                  <span className="text-lg font-semibold">1-Year Return:</span>
                  <span className={`${getPerformanceColor(ytdReturn)} text-xl`}>
                      {ytdReturn}
                  </span>
                  </div>

                  {/* 3-Year Return */}
                  <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                  <span className="text-lg font-semibold">3-Year Return:</span>
                  <span className={`${getPerformanceColor(threeYearReturn)} text-xl`}>
                      {threeYearReturn}
                  </span>
                  </div>

                  {/* 5-Year Return */}
                  <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                  <span className="text-lg font-semibold">5-Year Return:</span>
                  <span className={`${getPerformanceColor(fiveYearReturn)} text-xl`}>
                      {fiveYearReturn}
                  </span>
                  </div>
          </div>

      </div>

      {/* <div className="news px-10">
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
      </div> */}

      
    </div>
  );
};

export default Details;



