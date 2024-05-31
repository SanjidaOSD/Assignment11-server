const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware 
// 
const corsConfig = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}
app.use(cors(corsConfig));

// app.use(cors(corsOption));
app.use(express.json());

console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2bg42lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const foodCollection = client.db('FoodDB').collection('food');
    const requestCollection = client.db("FoodDB").collection('request');

    // data query kora:
    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query);
      res.send(result)
    })

    // update db:
    app.put('/food/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedFood = req.body;
      food = {
        $set: {
          foodName: updatedFood.foodName,
          pickupLocation: updatedFood.pickupLocation,
          expiredDate: updatedFood.expiredDate,
          foodImg: updatedFood.foodImg
        }
      }
      const result = await foodCollection.updateOne(filter, food, options)
      res.send(result);
    })

    // sort db:
    app.get('/food', async (req, res) => {
      const sort = req.query.sort
      const search = req.query.search
      let query = {}
      if (search) {
        query.foodName = { $regex: new RegExp(search, 'i') }

      }
      let options = {};
      if (sort) options = { sort: { expiredDate: sort === 'asc' ? 1 : -1 } };

      const result = await foodCollection
        .find(query, options)
        .toArray();
      res.send(result);
    })

    // get details from db:
    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    })

    // my manage food:
    app.get('/food', async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query.email) {
        query = { "newFood.email": req.query.email }
      }
      const result = await foodCollection.find(query).toArray();
      res.send(result)
    })

    // get food
    app.get('/food', async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // save a food
    app.post('/food', async (req, res) => {
      const newFood = req.body;
      console.log(newFood)
      const result = await foodCollection.insertOne(newFood);
      res.send(result)
    })
    // Delete data:
    app.delete('/food/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.deleteOne(query);
      res.send(result)
    })


    // get all request data for a email from db:

    app.get('/request/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      // console.log(email)
      const result = await requestCollection.find().toArray()
      console.log(result)

      // res.send(result)
    })

// save request data in db:
app.post('/request',async(req, res)=>{
  const requestData = req.body
  const result = await requestCollection.insertOne(requestData)
  res.send(result)
})






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('assignment11 is running.....')

})






app.listen(port, () => {
  console.log(`assignment11 is not complete ${port}`)
})