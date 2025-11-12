const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000

/* console.log(process.env) */
app.use(cors());
app.use(express.json());


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

/* all books using GET request */
    app.get('/all-books', async (req, res)=>{
        const result = await booksCollection.find().toArray();
      

        res.send(result)

    })
/*  book details using GET request */

app.get('/book-details/:id', async (req, res)=>{

    const {id} = req.params;
    const result = await booksCollection.findOne({_id: new ObjectId(id)});

    res.send(result)

})
/*  sorting latest book using GET request */

app.get('/latest-book', async (req, res)=>{
  const result = await booksCollection.find().sort({created_at: 'desc'}).limit(6).toArray();

  res.send(result);
})

/* add book using POST request */

app.post('/add-book', async (req, res) =>{
    const newBook = req.body;
    console.log(newBook)
    const result = await booksCollection.insertOne(newBook)
    res.send(result)
})
/* My book using GET request */

app.get('/my-books', async (req, res)=>{
    const email = req.query.email;
    const result = await booksCollection.find({userEmail: email}).toArray();
    res.send(result);

})

/* update book using PUT request */

app.put('/update-book/:id', async (req, res)=>{
    const {id} = req.params;
    const updateBook = req.body;
    const result = await booksCollection.updateOne({_id: new ObjectId(id)},
    { $set: updateBook });

    res.send(result)

})
/* delete book using DELETE request */
app.delete('/delete-book/:id', async (req, res)=>{
    const {id} = req.params;
    const result = await booksCollection.deleteOne({_id: new ObjectId(id)});
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
