export const fetchStockData = async () => {
    // Fetch stock sentiment and prices from your Yahoo Finance API
    const response = await fetch('/api/stocks'); // Modify with your actual API endpoint
    const data = await response.json();
    return data;
  };
  
  export const fetchNewsData = async () => {
    // Fetch news from Yahoo Finance API
    const response = await fetch('/api/news'); // Modify with your actual API endpoint
    const data = await response.json();
    return data;
  };
  