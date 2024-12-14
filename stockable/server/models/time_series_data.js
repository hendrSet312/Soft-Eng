const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');

const router = express.Router();

const stock_data = new mongoose.Schema({
    Symbol: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date, 
      required: true,
    },
    data: [
      {
        date: {
          type: Date,
          required: true,
        },
        open: {
          type: Number,
          required: true,
        },
        low: {
          type: Number,
          required: true,
        },
        high: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
        volume: {
          type: Number,
          required: true,
        },
      },
    ],
});

const stocks_timeseries = mongoose.model('stock_data', stock_data, 'stock_timeseries' ); 



const fetchHistoricalStockData = async (symbol, startDate, finishDate) => {
  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${startDate}&to=${finishDate}&apikey=9zxE4yULnG9ET37FLFKsCjcnZefJk5QM`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return  response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return [];
  }
};


const insertStockData = async (symbol) => {
  try {
      const currDate = new Date();
      const currDateStr = currDate.toISOString().split('T')[0]; // Format current date as YYYY-MM-DD

      // Check if stock data already exists for the current symbol
      let existingStock = await stocks_timeseries.findOne({ Symbol: symbol });

      // If data exists and the date matches, no need to call the API
      if (existingStock && existingStock.created_at.toISOString().split('T')[0] === currDateStr) {
          console.log('Stock data is already up-to-date.');
          return;
      }

      // Fetch historical data if it needs to be updated
      const historicalData = await fetchHistoricalStockData(symbol, '2024-01-01', currDateStr);
      
      // Validate and format the fetched data
      const formattedHistoricalData = historicalData.historical.map((entry) => {
          const { date, open, low, high, close, volume } = entry;

          if (!date || !open || !low || !high || !close || !volume) {
              throw new Error(`Missing fields in historical data entry: ${JSON.stringify(entry)}`);
          }

          return {
              date: new Date(date), // Ensure date is in Date object format
              open: Number(open),
              low: Number(low),
              high: Number(high),
              close: Number(close),
              volume: Number(volume),
          };
      });

      if (existingStock) {
          existingStock.created_at = currDate;
          existingStock.data = formattedHistoricalData;
          await existingStock.save();
          console.log('Stock data updated successfully.');
      } else {
          const newStockData = new stocks_timeseries({
              Symbol: symbol,
              created_at: currDate,
              data: formattedHistoricalData,
          });
          await newStockData.save();
          console.log('New stock data saved successfully.');
      }
  } catch (error) {
      console.error('Error fetching and inserting stock data:', error.message);
  }
};

router.get('/fetch-timeseries-data/:symbol', async (req, res) => {
    const { symbol } = req.params;

    try {
        await insertStockData(symbol);
        let existingTimeSeries = await stocks_timeseries.findOne({ Symbol: symbol });
        return res.status(200).json(existingTimeSeries);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;




