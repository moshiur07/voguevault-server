const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi4xixr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productsCollection = client.db('Fashion_collections').collection('products')
    const myCart = client.db('Fashion_collections').collection('cart')

    // Read OPeration

    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray()
      res.send(result)
    })

    app.get('/products/:name', async (req, res) => {
      const name = req.params.name
      const query = { brand: name }
      const result = await productsCollection.find(query).toArray()
      res.send(result)
    })
    // _____Update route______

    app.get('/update/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })

    //----Details-------
    app.get('/details/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })

    // POST operation
    app.post('/products', async (req, res) => {
      const productDetails = req.body
      const result = await productsCollection.insertOne(productDetails)
      res.send(result)
    })

    // PUT or UPDATE operations
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          name: data.name,
          price: data.price,
          rating: data.rating,
          description: data.description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    })


    // -------------------My cart----------------

    app.post('/carts', async (req, res) => {
      const details = req.body
      const result = await myCart.insertOne(details)
      res.send(result)
    })

    app.get('/carts', async (req, res) => {
      const result = await myCart.find().toArray()
      res.send(result)
    })
    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await myCart.findOne(query)
      res.send(result)
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await myCart.deleteOne(query)
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




app.get('/', (req, res) => {
  res.send('VogueVault web server is running like neuron!!')
})


app.listen(port, () => {
  console.log(`My port is running on: ${port}`);
})