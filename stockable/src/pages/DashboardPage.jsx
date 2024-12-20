import React, { useEffect, useState } from 'react';
import {fetchNewsData,fetchStockData} from '../utils/api';
import {getDateSevenDaysAgo,getCurrentDate} from '../../server/misc/date_operation';
import {StockCard, NewsCard, Header, Footer} from '../components';
import axios from 'axios';
import { parse_date } from '../../server/misc/date_operation';
import { fetch_stocks_database, fetch_news_database, fetch_max_stock_sentiment_count} from '../../server/database/get_public_data';


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
        
          // Wait for all news data to be fetched
          const news_data = await Promise.all(
            stocks_li.map(({ stock_symbol }) =>
              fetchNewsData(stock_symbol, lastweekDate, currentDate)
            )
          );

          for(const {id,title, symbol, image, datetime,url, sentiment} of news_data.flat()){
            // const id_comp = stocks_li.find(company => symbol === company.stock_symbol).stock_id;
            const matchingStock = stocks_li.find(company => symbol === company.stock_symbol);
            if (!matchingStock) {
              console.error(`No matching stock found for symbol: ${symbol}`);
              continue;
            }
    
            const id_comp = matchingStock.stock_id;

            try {
              const res = await axios.post('http://localhost:5000/database/news_stock', {
                id_news: id,
                id_company: id_comp,
                title: title,
                published_date: datetime,
                image_link: image,
                url: url,
                sentiment: sentiment,
              });
              console.log(`News stored successfully for ${symbol}:`, res.data);
            } catch (error) {
              console.error(`Error storing news for symbol ${symbol}:`, error);
            }
          }
          news_response = await fetch_news_database(currentDate);
        }

        setNews(news_response.flat());
      }catch(error){
        console.error('Error fetching dashboard news:', error);
      }
    }

    const fetchStockDashboard = async () => {
      try {
        const stocks_li = await fetch_stocks_database();
        const sentimentResponse = await fetch_max_stock_sentiment_count();
        console.log("Fetched Sentiment Data:", sentimentResponse);
    
        const stockData = await Promise.all(
          stocks_li.map(async ({ stock_symbol }) => {
            const stock = await fetchStockData(stock_symbol);
            console.log(`Processed Stock Data for ${stock_symbol}:`, stock);
            return stock;
          })
        );
    
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching dashboard stock data:', error);
      }
    };

    fetchNewsDashboard();
    fetchDashboardData();
    fetchStockDashboard(); // setstocks berisi data dari fetchStockData
  }, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto md:p-6 xl:px-0 xl:pt-0">
        <section className="welcome text-center mb-12 bg-green-600 p-6">
          <h2 className="text-4xl font-bold mb-4 text-white">Welcome, {userData.firstName ? userData.firstName : "Pencari Cuan!"}</h2>
          <p className="text-lg text-white">Gather Stock Information Here</p>
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
                sentiment={stock.sentiment}
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
                url={newsItem.url}
                image={newsItem.image_link}
                title={newsItem.title}
                stockSymbol={newsItem.stock_symbol}
                date = {parse_date(newsItem.published_date)}
                sentiment = {newsItem.sentiment}
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
