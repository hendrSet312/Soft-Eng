import axios from 'axios';

const parse_date = (date) => {
  let result = date.replace('Z','').split('T').join(' ');
  return result;
}

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


export const fetchNewsData = async (symbol, date) => {
  try {
    // Placeholder: Replace with your actual news API integration
    const url = `https://newsapi.org/v2/everything?q=${symbol}&from${date}&sortBy=popularity&apiKey=945843d7f3e347669afa29bf1416cecd`;
    let res = await axios.get(url);
    res = res.data.articles.filter(art => art.urlToImage !== null).splice(0,2);

    return res.map(({ title, urlToImage, publishedAt}) => ({
      title: title,
      symbol: symbol,
      urlToImage: urlToImage,
      publishedAt: parse_date(publishedAt),
    }));

  } catch (error) {
    console.error('Error fetching news data:', error);
    return []; // Return an empty array on error
  }
};
