import axios from 'axios';

export async function fetch_stocks_database() {
    let response;
    response = await axios.get('http://localhost:5000/database/stock/');
    
    return response.data;
}

export async function fetch_news_database(date, id_comp = null) {
    let responseStr ;

    if(id_comp){
        responseStr = `http://localhost:5000/database/news_stock/${date}?id_company=${id_comp}`;
    }else{
        responseStr = `http://localhost:5000/database/news_stock/${date}`
    }

    const response = await axios.get(responseStr);
    return response.data;
}

export async function fetch_stock_sentiment(title) {
    const data = {input: title};
    // console.log('fetch_stock_sentiment', data);

    const response = await axios.post('http://localhost:5123/predict', data);
    console.log('fetch_stock_sentiment', response);
    return response.data.predictions[0];
}

export async function fetch_max_stock_sentiment_count() {
    try {
      const response = await axios.get('http://localhost:5000/database/max_sentiment_count');
      console.log('Fetched Sentiment Data:', response.data); // Log responsenya

      if (!Array.isArray(response.data)) {
        throw new Error('Response data is not an array');
      }

      const sentimentMap = response.data.reduce((acc, { stock_symbol, sentiment }) => {
        acc[stock_symbol] = sentiment;
        return acc;
      }, {});
      console.log('Sentiment Map:', sentimentMap);
      return sentimentMap;
    } catch (error) {
      console.error('Error fetching stock sentiment counts:', error);
      return {}; // Return empty object on error
    }
  }
  
