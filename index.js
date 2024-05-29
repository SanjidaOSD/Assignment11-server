const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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


    // app.get('/food',async(req, res) => {
    //   const cursor = foodCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })
    
    // save a food
    app.post('/food', async(req, res) => {
      const newFood = req.body;
      console.log(newFood)
      const result = await foodCollection.insertOne(newFood);
      res.send(result)
    })



    // app.get('/food/:id', async(req , res) =>{
    // const {id} = req.params
    // const query = {_id: new ObjectId(id)}
    // const result = await foodCollection.findOne(query);
    // res.send(result)
    // })
    
    // app.get('/myList/:email', async(req , res) =>{
    //   const {email} = req.params
    //   const query = {email: email}
    //   console.log(query)
    //   const result = await placeCollection.find(query).toArray();
    //   console.log(result)
    //   res.send(result)
    //   })
    
      // app.delete('/place/:id', async (req, res) =>{
      //   const {id} = req.params
      //   const query = {_id: new ObjectId(id)}
      //   const result = await placeCollection.deleteOne(query);
      //   res.send(result) 
      //  })
    

      // save a food
    app.post('/food', async(req, res) => {
      const newFood = req.body;
      console.log(newFood)
      const result = await foodCollection.insertOne(newFood);
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get('/',(req, res) =>{
    res.send('assignment11 is running.....')

})






app.listen(port, () =>{
    console.log(`assignment11 is not complete ${port}`)
})