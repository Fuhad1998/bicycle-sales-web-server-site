const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






async function run (){

    try{

        await client.connect();
        const database = client.db('bicycle_online_shop')
        const productCollection = database.collection('products')

        // Get product

        app.get('/products', async (req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

    }

    finally{
        // await client.close()
    }


}
run().catch(console.dir)



app.get("/", (req, res)=>{
    res.send('bicycle-server is running')
})

app.listen(port, ()=>{
    console.log('server running at port', port)
})