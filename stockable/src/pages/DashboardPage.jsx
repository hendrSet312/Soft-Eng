import React, { useEffect, useState } from 'react';
import { fetchStockData, fetchNewsData } from '../utils/api';

import {StockCard, NewsCard, Header, Footer} from '../components';

const DashboardPage = () => {
  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch stocks and news when component mounts
    fetchStockData().then(setStocks);
    fetchNewsData().then(setNews);
  }, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto md:p-6 xl:px-0 xl:pt-0">
        <section className="welcome text-center mb-12 bg-slate-400 p-6">
          <h2 className="text-4xl font-bold mb-4">Welcome, {`{name}`}</h2>
          <p className="text-lg text-gray-600">Gather Stock Information Here</p>
        </section>

        <section className="stock-sentiments mb-12 px-10">
          <h2 className="text-2xl font-semibold mb-6">Stock Sentiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stocks.map(stock => (
              <StockCard
                key={stock.symbol}
                name={stock.name}
                sentiment={stock.sentiment}
                price={stock.price}
              />
            ))}
          </div>
        </section>

        <section className="news px-10">
          <h2 className="text-2xl font-semibold mb-6">Related News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map(newsItem => (
              <NewsCard
                key={newsItem.id}
                image={newsItem.image}
                title={newsItem.title}
                description={newsItem.description}
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
