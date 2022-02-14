const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.s5rla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('Connect to the Binova Database');

      // create database
    const database = client.db("binovaDb");
    const shoesCollection = database.collection("shoes");

    // odrer collection
    const ordersCollection = database.collection('orders');

    // GET api
    app.get('/shoes',async(req,res) => {
      const cursor = shoesCollection.find({});
      const shoes = await cursor.toArray();
      res.send(shoes);
    })

    // GET single api
    app.get('/booking/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const shoe = await shoesCollection.findOne(query);
      res.json(shoe);
    })

    // GET Order
    app.get('/orders',async(req,res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders)
    })

    // POST api
    app.post('/addproduct', async(req,res) => {
      const addProduct = req.body;
      console.log('hit the post api',addProduct);
      const result = await shoesCollection.insertOne(addProduct);
      res.json(result);
    })

    // Order POST
    app.post('/placeorder',async(req,res) => {
      const placeOrder = req.body;
      console.log('Hit the order',placeOrder);
      const result = await ordersCollection.insertOne(placeOrder);
      res.send(result);
    })

    // DELETE api
    app.delete('/orders/:id',async(req,res) => {
      const id = req.params.id;
      const qurey = {_id:ObjectId(id)};
      const result = ordersCollection.deleteOne(qurey);
      res.json(result);
    })

    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})