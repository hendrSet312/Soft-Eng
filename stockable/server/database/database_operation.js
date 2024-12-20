const express = require('express');
const session = require('express-session');
const database = require('./connect_database');

const client = new database(
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    process.env.PG_HOST,
    process.env.PG_PORT,
    process.env.PG_DB);
  
client.connect_database();

const client_postgre = client.get_client;

const router = express.Router();

router.get('/stock', async (req, res) => {
    try {
        const {stock_id} = req.query;
        let result;
        let query = 'SELECT * FROM public.stock';
        
        if(stock_id){
            query = query.concat(' WHERE stock_id = $1;');
            result = await client_postgre.query(query,[stock_id]);
        }else{
            query = query.concat(';');
            result = await client_postgre.query(query);
        }
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving stocks:', error);
        res.status(500).send('An error occurred while fetching stock data.');
    }
});

router.get('/news_stock/:date', async (req, res) => {
    try {
        const { id_company } = req.query;
        const {date} = req.params;

        let result;

        if(!date){
            return res.status(400).send('Date is required !');
        }

        let query = `SELECT ns.title,ns.published_date,ns.image_link,ns.url,s.stock_symbol
                     FROM public.news_stock AS ns
                     JOIN public.stock s ON s.stock_id = ns.stock_id
                     WHERE ns.published_date >= $1`;

        if(id_company){
            query = query.concat(' AND company_id = $2;');
            result = await client_postgre.query(query,[date,id_company]);
        }else{
            query = query.concat(';');
            result = await client_postgre.query(query,[date]);
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving news:', error);
        res.status(500).send('An error occurred while fetching news.');
    }
});

router.post('/news_stock', async (req, res) => {
    try {
        const {id_news,id_company, title, published_date, image_link, url, sentiment } = req.body;

        if (!id_news || !id_company || !title || !published_date || !image_link) {
            return res.status(400).send('All fields are required: id_news ,id_company, title, publisher, published_date, image_link, url.');
        }

        const query = `
            INSERT INTO public.news_stock (id_news,stock_id, title, published_date, image_link, url, sentiment)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING;
        `;

        const values = [id_news,id_company, title, published_date, image_link, url, sentiment];

        const result = await client_postgre.query(query, values);

        res.status(201).json({
            message: 'News stock added successfully'
        });
    } catch (error) {
        console.error('Error adding news stock:', error);
        res.status(500).send('An error occurred while adding the news stock.');
    }
});

// router.get('/sentiment_count', async (req, res) => {
//     try {
//         const query = `
//             SELECT 
//                 s.stock_symbol, 
//                 ns.sentiment, 
//                 COUNT(ns.sentiment) AS sentiment_count
//             FROM 
//                 public.news_stock AS ns
//             JOIN 
//                 public.stock AS s 
//                 ON s.stock_id = ns.stock_id
//             GROUP BY 
//                 s.stock_symbol, ns.sentiment
//             HAVING 
//                 COUNT(ns.sentiment) = (
//                     SELECT MAX(COUNT(inner_ns.sentiment))
//                     FROM public.news_stock AS inner_ns
//                     WHERE inner_ns.stock_id = ns.stock_id
//                     GROUP BY inner_ns.sentiment
//                 )
//             ORDER BY 
//                 s.stock_symbol;
//         `;

//         const result = await client_postgre.query(query);

//         // Reduce result into a simple structure
//         const sentimentCounts = result.rows.reduce((acc, row) => {
//             acc[row.stock_symbol] = row.sentiment; // Store highest sentiment
//             return acc;
//         }, {});

//         res.status(200).json(sentimentCounts);
//     } catch (error) {
//         console.error('Error retrieving sentiment counts:', error);
//         res.status(500).send('An error occurred while fetching sentiment counts.');
//     }
// });


router.get('/sentiment_count', async (req, res) => {
    try {
      const query = `
        WITH SentimentCounts AS (
            SELECT 
                s.stock_symbol, 
                ns.sentiment, 
                COUNT(ns.sentiment) AS sentiment_count
            FROM 
                public.news_stock AS ns
            JOIN 
                public.stock AS s 
                ON s.stock_id = ns.stock_id
            GROUP BY 
                s.stock_symbol, ns.sentiment
        ),
        MaxSentiment AS (
            SELECT 
                stock_symbol, 
                MAX(sentiment_count) AS max_count
            FROM 
                SentimentCounts
            GROUP BY 
                stock_symbol
        )
        SELECT 
            sc.stock_symbol, 
            sc.sentiment, 
            sc.sentiment_count
        FROM 
            SentimentCounts sc
        JOIN 
            MaxSentiment ms
        ON 
            sc.stock_symbol = ms.stock_symbol 
            AND sc.sentiment_count = ms.max_count
        ORDER BY 
            sc.stock_symbol;
      `;
  
      const result = await client_postgre.query(query);
      console.log("Sentiment Count Query Result:", result.rows); // Log hasil query
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error retrieving sentiment counts:', error);
      res.status(500).send('An error occurred while fetching sentiment counts.');
    }
  });
  
  

module.exports = router;