import axios from 'axios';

export async function fetch_stocks_database() {
    let response;
    response = await axios.get('http://localhost:5000/database/stock/');
    
    return response.data;
}

export async function fetch_news_database(date, id_comp = null) {
    let responseStr ;

    if(id_comp){
        responseStr = `http://localhost:5000/database/news_stock/${date}?stock_id=${id_comp}`;
    }else{
        responseStr = `http://localhost:5000/database/news_stock/${date}`
    }

    const response = await axios.get(responseStr);
    return response.data;
}

