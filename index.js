// server.js (বা index.js)
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

    // Top 6 recipes sorted by likes descending
    app.get('/top-recipes', async (req, res) => {
      const recipes = await recipeCollection
        .find()
        .sort({ likes: -1 })
        .limit(6)
        .toArray();
      res.send(recipes);
    });

    // All recipes
    app.get('/recipes', async (req, res) => {
      const recipes = await recipeCollection.find().toArray();
      res.send(recipes);
    });

    // Add new recipe, likes default 0
    app.post('/recipes', async (req, res) => {
      const recipe = req.body;
      recipe.likes = 0;
      const result = await recipeCollection.insertOne(recipe);
      res.send(result);
    });

    // Get single recipe by ID
    app.get('/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.findOne(query);
      res.send(result);
    });

    // Increment likes by 1
    app.patch('/recipes/:id/like', async (req, res) => {
      const id = req.params.id;
      const result = await recipeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likes: 1 } }
      );
      res.json(result);
    });

    // Get recipes by user email (My Recipes)
    app.get('/api/my-recipes', async (req, res) => {
      const { email } = req.query;
      const result = await recipeCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    // Delete a recipe by ID
    app.delete('/api/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const result = await recipeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Update a recipe by ID
    app.put('/api/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const result = await recipeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

app.get('/api/stats', async (req, res) => {
  const email = req.query.email;


  const totalItems = await recipeCollection.countDocuments();

  const totalLikesAgg = await recipeCollection.aggregate([
    { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
  ]).toArray();
  const totalLikes = totalLikesAgg[0]?.totalLikes || 0;

  let myItems = 0;
  if (email) {
    myItems = await recipeCollection.countDocuments({ userEmail: email });
  }

  res.send({ totalItems, totalLikes, myItems });
 });

 


    console.log("MongoDB connected and server routes are ready!");
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
