const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.port || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midleware
app.use(cors()); // use when data pass to client site
app.use(express.json())//use when data recive from client site for format json data

app.get('/', (req, res) => {
  res.send('ok server is ok');
})

app.listen(port, () => {
  console.log('port running', port);

})

// for mongodb

const uri = "mongodb+srv://go-fast-travel:bBAZRHQ6ShdlflhA@express-explore.use1c.mongodb.net/?retryWrites=true&w=majority&appName=express-explore";

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

    const collection = client.db('go-fast-travel').collection('tourist-spots');

    app.get('/touristspots', async (req, res) => {
      const cursor = await collection.find().toArray();
      res.send(cursor);
    })

    app.get('/mylist', async (req, res) => {
      const email = req.query.email;
      // console.log("getee", email);
      
      let query = {};
      if (req.query?.email) {
          query = {userEmail: email}
      }
      
      const cursor = await collection.find(query).toArray();
      res.send(cursor);
      // console.log('cursor', cursor);
      
    })

    app.get('/touristspot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await collection.findOne(query);
      res.send(result);
      
    })

    app.get('/add', async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/add-tourist-spot', async (req, res) => {
      const result = req.body;
      // console.log(result);
      const query = await collection.insertOne(result);
      res.send(query);
    })

    app.delete('/mylist/:id', async(req, res) =>{
      const id = req.params.id;
      // console.log('please delete', id);

      const query = {_id : new ObjectId(id)};
      const result = await collection.deleteOne(query);
      res.send(result)
  })

  // Update 
  app.patch('/update/:id', async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    const {tourists_spot_name, country_Name, location, average_cost, travel_time, totalVisitorsPerYear, imageUrl} = user;

    const filter = {_id: new ObjectId(id)};
    const option = {upsert: true};
    const updateUser = {
      $set: {
        tourists_spot_name,
        country_Name,
        location,
        average_cost,
        travel_time,
        totalVisitorsPerYear,
        imageUrl
      }
    }
    
    const cursor = await collection.updateOne(filter, updateUser, option);
    res.send(cursor);
  })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);