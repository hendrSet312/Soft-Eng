import axios from 'axios';

export async function fetch_stocks_database() {
    const response = await axios.get('http://localhost:5000/database/stock');
    return response.data;
}

export async function fetch_news_database(date) {
    const response = await axios.get(`http://localhost:5000/database/news_stock/${date}`);
    return response.data;
}
