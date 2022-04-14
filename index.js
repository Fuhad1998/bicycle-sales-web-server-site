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
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');

        // Get product

        app.get('/products', async (req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })
        
        app.post('/products', async(req, res)=>{
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.json(result)
        })

        // post orders


        app.post('/orders', async(req, res)=>{
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result)
        })

        // get orders


        app.get('/orders', async (req, res)=>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })


        // post review

          


          app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.json(result)
        })


        // Get reviews

        app.get('/reviews', async (req, res)=>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // post user

        app.post('/users', async(req, res)=>{
            const users = req.body;
            const result = await userCollection.insertOne(users)
            
            res.json(result)
        })



        app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email}
            const options = {upsert: true}
            const updateDoc = {$set: user}
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

         // put admin

         app.put('/users/admin', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email}
            const updateDoc ={$set: {role: 'admin'}}
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })


          // get users

          app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email: email}
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin= true;
            }
            res.json({admin: isAdmin})
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