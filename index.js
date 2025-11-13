const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.t1cnfqf.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("car-rent-db");
    const carsCollection = db.collection("cars");
    const bookingCollection = db.collection("booking");

    // get method for all listins

    app.get("/cars", async (req, res) => {
      const result = await carsCollection.find().toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await carsCollection.findOne({ _id: objectId });
      res.send({
        success: true,
        result,
      });
    });

    // post method for Add Car
    app.post("/cars", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await carsCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    // put
    app.put("/cars/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      // console.log(id);
      // console.log(data);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await carsCollection.updateOne(filter, update);
      res.send({
        success: true,
        result,
      });
    });

    // delete

    app.delete("/cars/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const result = await carsCollection.deleteOne(filter);
      res.send({
        success: true,
        result,
      });
    });

    // 6 newest cars
    app.get("/newest-cars", async (req, res) => {
      const result = await carsCollection
        .find()
        .sort({ _id: "desc" })
        .limit(6)
        .toArray();
      console.log(result);
      res.send(result);
    });

    // details
    app.get("/newest-cars/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await carsCollection.findOne({ _id: objectId });
      res.send({
        success: true,
        result,
      });
    });

    // booking
    app.post("/booking", async (req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.send(result);
    });

    app.get("/my-booking", async (req, res) => {
      const email = req.query.email;
      const result = await bookingCollection
        .find({ Provider_Email: email })
        .toArray();
      res.send(result);
    });

    // search api
    app.get("/search", async (req, res) => {
      const search_text = req.query.search;
      const result = await carsCollection
        .find({ name: { $regex: search_text, $options: "i" } })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
