const express = require('express');
const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uevarui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const db = client.db('recipeDB');
    const recipeCollection = db.collection('recipes');

    app.get('/top-recipes', async (req, res) => {
   
        const recipes = await recipeCollection
          .find()
          .sort({ likes: -1 })
          .limit(6)
          .toArray();
        res.send(recipes);
      
    });


     app.get('/recipes', async (req, res) => {
    
        const recipes = await recipeCollection.find().toArray();
        res.send(recipes);
      
      })


    app.post('/recipes', async (req, res) => {

    const recipe = req.body;
    recipe.likes = 0;
    const result = await db.collection('recipes').insertOne(recipe);
    res.send(result)

   });

  app.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await recipeCollection.findOne(query);
  res.send(result);
 });


 app.patch('/recipes/:id/like', async (req, res) => {
  const id = req.params.id;

  const result = await recipeCollection.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { likes: 1 } }
  );

  res.json(result);
});

  app.get("/api/my-recipes", async (req, res) => {
      const { email } = req.query;
      
      const result = await recipeCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

app.delete("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  const result = await recipeCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});




app.put("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  const updated = req.body;
  const result = await recipeCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updated }
  );
  res.send(result);
});



     

    


   




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
