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

        let query = `SELECT ns.title,ns.published_date,ns.image_link,s.stock_symbol
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
        const {id_news,id_company, title, published_date, image_link } = req.body;

        if (!id_news || !id_company || !title || !published_date || !image_link) {
            return res.status(400).send('All fields are required: id_news ,id_company, title, publisher, published_date, image_link.');
        }

        const query = `
            INSERT INTO public.news_stock (id_news,stock_id, title, published_date, image_link)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING;
        `;

        const values = [id_news,id_company, title, published_date, image_link];

        const result = await client_postgre.query(query, values);

        res.status(201).json({
            message: 'News stock added successfully'
        });
    } catch (error) {
        console.error('Error adding news stock:', error);
        res.status(500).send('An error occurred while adding the news stock.');
    }
});

module.exports = router;