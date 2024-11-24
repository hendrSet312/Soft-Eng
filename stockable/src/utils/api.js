import axios from 'axios';

export const fetchStockData = async () => {
  try {
    // Make a request to RapidAPI to fetch stock data
    const options = {
      method: 'GET',
      url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
      params: { 
        symbol: 'NVDA:NASDAQ,AAPL:NASDAQ,MSFT:NASDAQ,AMZN:NASDAQ,TSLA:NASDAQ,META:NASDAQ', 
        language: 'en' 
      }, // Replace symbol as needed
      headers: {
        'x-rapidapi-key': 'cde17e37f1mshc52a4de9c415ef9p13f8c7jsn700c8c7916ae', // Replace with your own API key
        'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    const stockData = response.data.data; // This is an array of stocks

    // Transform the data to match your application's requirements
    return stockData.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      // sentiment: 'Neutral', // Placeholder for sentiment analysis
      price: stock.price,
      change: stock.change_percent,
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return []; // Return an empty array on error to avoid breaking the UI
  }
};


export const fetchNewsData = async () => {
  try {
    // Placeholder: Replace with your actual news API integration
    const response = await fetch('/api/news'); // Modify with your actual news API endpoint
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news data:', error);
    return []; // Return an empty array on error
  }
};
