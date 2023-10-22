const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// hard data for brand 
const brand = [
  {
    "id": 1,
    "brand": "toyota",
    "image": "https://i.ibb.co/rFGK6YX/Toyota-removebg-preview.png"
  },
  {
    "id": 2,
    "brand": "ford",
    "image": "https://i.ibb.co/PQGdg3S/ford-removebg-preview.png"
  },
  {
    "id": 3,
    "brand": "bmw",
    "image": "https://i.ibb.co/rfbf8p8/bmw-removebg-preview.png"
  },
  {
    "id": 4,
    "brand": "mercedes-benz",
    "image": "https://i.ibb.co/fHT481P/Mercedes-Benz-removebg-preview.png"
  },
  {
    "id": 5,
    "brand": "tesla",
    "image": "https://i.ibb.co/QC3Nrqm/tesla-removebg-preview.png"
  },
  {
    "id": 6,
    "brand": "honda",
    "image": "https://i.ibb.co/88Nk2B5/honda-removebg-preview.png"
  }
]

//   hard data for logo
const logo = {
  img: "https://i.ibb.co/k5W1NYK/1-20231018-190213-0000-removebg-preview.png",
  name: "AutoMajesty"
}

// hard data for testimonial 
const testimonial = [
  {
    "id": 1,
    "person": "Sayed Hossain",
    "image": "https://i.ibb.co/fFtmfKm/sayed.jpg",
    "comment": "I can not thank Automajesty enough for helping me find my dream car. The personalized service and the exceptional quality of their vehicles truly set them apart."
  },
  {
    "id": 2,
    "person": "Miaraz Khan",
    "image": "https://i.ibb.co/YQJ5Wj7/miaraz.jpg",
    "comment": "Celebrating Automajesty is not just about buying a car. it is about embracing an experience that transcends excellence."
  },
  {
    "id": 3,
    "person": "Ashik Alahe",
    "image": "https://i.ibb.co/rM7hJZd/asik.jpg",
    "comment": "Celebrating Automajesty is not just about buying a car. it is about embracing an experience that transcends excellence."
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
    // await client.connect();

    const productCollection = client.db("productDB").collection('product')

    const cartCollection = client.db("cartDB").collection('cart')

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result)
    })

    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand }
      const cursor = productCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/details/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.put('/details/:id', async (req, res)=>{
      const id = req.params.id;
      const updateProduct = req.body;
      console.log(updateProduct);
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updated = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
          brand: updateProduct.brand,
          image: updateProduct.image,
          type: updateProduct.type,
          description: updateProduct.description,
          rating: updateProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, updated, options)
      res.send(result)
    })



    // cart

    app.post('/cart', async (req, res)=>{
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart)
      res.send(result)
    })

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    
    app.get('/remove/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: id}
      const result = await cartCollection.findOne(query)
      res.send(result)
    })

    app.delete('/remove/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: id}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
    

    app.get('/logo', (req, res) => {
      res.send(logo)
    })

    app.get('/brand', (req, res) => {
      res.send(brand)
    })

    app.get('/testimonial', (req, res)=>{
      res.send(testimonial)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('auto majesty is running')
})

app.listen(port, () => {
  console.log(`autoMajesty running grom : ${port}`);
})