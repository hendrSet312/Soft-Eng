import React, { useEffect, useState } from 'react';
import { fetchStockData, fetchNewsData } from '../utils/api';
import axios from 'axios';
import {StockCard, NewsCard, Header, Footer} from '../components';

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
      const currentDate = new Date().toISOString().split('T')[0];
      const company = ['AAPL'];

      try{
        const news_data = await Promise.all(
          company.map(symbol => fetchNewsData(symbol))
        );
        setNews( news_data.flat());
      }catch(error){
        console.error('Error fetching dashboard news:', error);
      }
    }

    const fetchStockDashboard = async () => {
      try{
        const currentDate = new Date().toISOString().split('T')[0];
        const company = ['AAPL'];
        const stockData = await Promise.all(
          company.map(symbol => fetchStockData(symbol))
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
                image={newsItem.urlToImage}
                title={newsItem.title}
                stockSymbol={newsItem.symbol}
                date = {newsItem.publishedAt}
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
