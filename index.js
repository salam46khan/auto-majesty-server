const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// hard data for brand 
const brand = [
    {
      "id": 1,
      "brand": "Toyota",
      "image": "https://i.ibb.co/rFGK6YX/Toyota-removebg-preview.png"
    },
    {
      "id": 2,
      "brand": "Ford",
      "image": "https://i.ibb.co/PQGdg3S/ford-removebg-preview.png"
    },
    {
      "id": 3,
      "brand": "BMW",
      "image": "https://i.ibb.co/rfbf8p8/bmw-removebg-preview.png"
    },
    {
      "id": 4,
      "brand": "Mercedes-Benz",
      "image": "https://i.ibb.co/fHT481P/Mercedes-Benz-removebg-preview.png"
    },
    {
      "id": 5,
      "brand": "Tesla",
      "image": "https://i.ibb.co/QC3Nrqm/tesla-removebg-preview.png"
    },
    {
      "id": 6,
      "brand": "Honda",
      "image": "https://i.ibb.co/88Nk2B5/honda-removebg-preview.png"
    }
  ]
  

// middle ware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wueeg5w.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productDB").collection('product')

    app.get('/products', async (req, res)=>{
        const cursor = productCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    
    app.post('/products', async (req, res) =>{
        const product = req.body;
        console.log(product);
        const result = await productCollection.insertOne(product);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/brand', (req, res)=>{
    res.send(brand)
})

app.get('/', (req, res)=>{
    res.send('auto majesty is running')
})

app.listen(port, ()=>{
    console.log(`autoMajesty running grom : ${port}`);
})