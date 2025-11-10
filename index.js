const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000

console.log(process.env)
app.use(cors());
app.use(express.json());


/* const uri = "mongodb+srv://bookDB:Cn7PlzsGiggpipHI@cluster0.nma65uq.mongodb.net/?appName=Cluster0"; */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nma65uq.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    
    const db = client.db('bookDB');
    const booksCollection = db.collection('books')

    app.get('/all-books', async (req, res)=>{
        const result = await booksCollection.find().toArray();
      

        res.send(result)

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    /* await client.close(); */
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('This is assignment 10')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
