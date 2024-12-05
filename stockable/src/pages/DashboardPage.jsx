import React, { useEffect, useState } from 'react';
import {fetchNewsData,fetchStockData} from '../utils/api';
import {getDateSevenDaysAgo,getCurrentDate} from '../../server/misc/date_operation'
import {StockCard, NewsCard, Header, Footer} from '../components';
import axios from 'axios';
import { parse_date } from '../../server/misc/date_operation';
import { fetch_stocks_database, fetch_news_database } from '../../server/database/get_public_data';


const DashboardPage = () => {
  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);
  const [userData, setUserData] = useState({id:'',firstName: '',lastName: '', email: '' });


  useEffect(() => {
    // Fetch stocks and news when component mounts
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/dashboard/dashboard`, {
          headers: { Authorization: `Bearer ${token}`}
        });
        

        setUserData({
          id : response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email
        });
      }catch(error){
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchNewsDashboard = async () => {      
      try{
        const currentDate = getCurrentDate();
        const lastweekDate  = getDateSevenDaysAgo();
        let news_response = await fetch_news_database(lastweekDate);

        if(news_response.length === 0){
          const stocks_li = await fetch_stocks_database();
        
          const news_data = await Promise.all(
            stocks_li.map(({stock_symbol}) => fetchNewsData(stock_symbol,lastweekDate,currentDate))
          );

          for(const {id,title, symbol, image, datetime} of news_data.flat()){
            const id_comp = stocks_li.find(company => symbol === company.stock_symbol).stock_id;

            const res = await axios.post('http://localhost:5000/database/news_stock', {
              id_news : id,
              id_company :id_comp, 
              title : title, 
              published_date : datetime, 
              image_link : image
            });
          }
          news_response = await fetch_news_database(currentDate);
        }

        setNews(news_response.flat());
      }catch(error){
        console.error('Error fetching dashboard news:', error);
      }
    }

    const fetchStockDashboard = async () => {
      try{
        const stocks_li = await fetch_stocks_database();

        const stockData = await Promise.all(
          stocks_li.map(({stock_symbol}) => fetchStockData(stock_symbol))
        );

        setStocks(stockData);
      }catch(error){
        console.error('Error fetching dashboard news:', error);
      }
    }

    fetchNewsDashboard();
    fetchDashboardData();
    fetchStockDashboard(); // setstocks berisi data dari fetchStockData
  }, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto md:p-6 xl:px-0 xl:pt-0">
        <section className="welcome text-center mb-12 bg-slate-400 p-6">
          <h2 className="text-4xl font-bold mb-4">Welcome, {userData.firstName ? userData.firstName : "Pencari Cuan!"}</h2>
          <p className="text-lg text-gray-600">Gather Stock Information Here</p>
        </section>

        <section className="stock-sentiments mb-12 px-10">
          <h2 className="text-2xl font-semibold mb-6">Stock Sentiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stocks.map((stock,index) => (
              <StockCard
                key={index} // Ensures unique keys for each stock
                name={stock.name}
                price={stock.price}
                change={stock.changesPercentage}
                /* Symbol buat stockcard cuy, gatau gmn*/
                symbol={stock.symbol} // Pass symbol to StockCard
              />
          ))}
          </div>
        </section>

        <section className="news px-10">
          <h2 className="text-2xl font-semibold mb-6">Related News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((newsItem,index) => (
              <NewsCard
                key={index}
                image={newsItem.image_link}
                title={newsItem.title}
                stockSymbol={newsItem.stock_symbol}
                date = {parse_date(newsItem.published_date)}
              />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
