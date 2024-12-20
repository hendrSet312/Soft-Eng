import axios from 'axios';
import { unix_to_date } from '../../server/misc/date_operation';
import img_template from '../../src/assets/template_img.news.jpg';
import {fetch_stock_sentiment,fetch_stock_sentiment_count} from '../../server/database/get_public_data';
import { PiCoinsFill } from 'react-icons/pi';



export const fetchStockData = async (symbol) => {
  try {
    const options = {
      hostname: 'financialmodelingprep.com',
      port: 443,
      path: `https://financialmodelingprep.com/api/v3/quote/${symbol}?&apikey=9zxE4yULnG9ET37FLFKsCjcnZefJk5QM`,
      method: 'GET'
    }

    const response = await axios.get(options.path);
    const stockData = response.data[0];
    const {name, price,changesPercentage } = stockData;
    const sentimentResponse = await fetch_stock_sentiment_count();
    const sentimentData = sentimentResponse[symbol] || "neutral";

    return {
      symbol : symbol,
      name : name, 
      price : price, 
      changesPercentage : changesPercentage,
      sentiment : sentimentData
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};


export const fetchNewsData = async (symbol, date_start, date_end) => {
  try {
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${date_start}&to=${date_end}&token=ct3hrehr01qrd05j3q70ct3hrehr01qrd05j3q7g`;
    let res = await axios.get(url);
    res = res.data.splice(0, 5);

    const newsWithSentiments = await Promise.all(
      res.map(async ({ id, headline, image, datetime, url }) => {
        const sentimentArray = await fetch_stock_sentiment(headline);
        console.log('sentimentArray woiiiiiiiiii', sentimentArray);

        return {
          id: id,
          title: headline,
          symbol: symbol,
          image: image.length > 1 ? image : img_template,
          datetime: unix_to_date(datetime),
          url: url,
          sentiment: sentimentArray, // Store sentiment here
        };
      })
    );

    return newsWithSentiments;
  } catch (error) {
    console.error('Error fetching news data:', error);
    return []; // Return an empty array on error
  }
};
