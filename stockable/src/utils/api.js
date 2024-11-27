import axios from 'axios';
import { unix_to_date } from '../../server/misc/date_operation';
import img_template from '../../src/assets/template_img.news.jpg';

export const fetchStockData = async (symbol) => {
  try {
    // Make a request to RapidAPI to fetch stock data
    const options = {
      hostname: 'financialmodelingprep.com',
      port: 443,
      path: `https://financialmodelingprep.com/api/v3/quote/${symbol}?&apikey=9zxE4yULnG9ET37FLFKsCjcnZefJk5QM`,
      method: 'GET'
    }

    const response = await axios.get(options.path);
    const stockData = response.data[0];
    const {name, price,changesPercentage } = stockData;

    return {
      symbol : symbol,
      name : name, 
      price : price, 
      changesPercentage : changesPercentage
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};


export const fetchNewsData = async (symbol,date_start,date_end) => {
  try {
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${date_start}&to=${date_end}&token=ct3hrehr01qrd05j3q70ct3hrehr01qrd05j3q7g`;
    let res = await axios.get(url);
    res = res.data.splice(0,5);

    return res.map(({id,headline, image, datetime}) => ({
      id : id,
      title: headline,
      symbol: symbol,
      image: image.length > 1 ? image : img_template,
      datetime: unix_to_date(datetime),
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return []; // Return an empty array on error
  }
};
