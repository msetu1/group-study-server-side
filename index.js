const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())


// mongodb code
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.dthbdpl.mongodb.net/?retryWrites=true&w=majority`;

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

        // collection 
        const featureCollection = client.db('groupStudy').collection('feature')
        const allAssignmentCollection = client.db('groupStudy').collection('allasignment')

        // feature get 
        app.get('/feature', async (req, res) => {
            const cursor = req.body;
            const result = await featureCollection.find(cursor).toArray()
            res.send(result);
        })


        // all asiignment
        app.get('/allasignment', async (req, res) => {
            const cursor = req.body;
            const result = await allAssignmentCollection.find(cursor).toArray()
            res.send(result)
        })

        app.post('/allasignment', async (req, res) => {
            const allasignment = req.body
            console.log(allasignment);
            const result = await allAssignmentCollection.insertOne(allasignment)
            res.send(result)
        })

        // view assignment 
        app.get('/allasignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allAssignmentCollection.findOne(query)
            res.send(result)
        })

        // deleted
        // app.delete('/allasignment/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await allAssignmentCollection.deleteOne(query)
        //     res.send(result)
        // })


        // update 
        // app.get('/allasignment/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await allAssignmentCollection.findOne(query)
        //     res.send(result)
        // })

        // app.put('/allasignment/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updateAssignment = req.body;
        //     const updateDoc = {
        //         $set: {
        //             level: updateAssignment.level,
        //             // _id: updateAssignment._isad,
        //             description: updateAssignment.description,
        //             title: updateAssignment.title,
        //             date: updateAssignment.date,
        //             image: updateAssignment.image,
        //             marks: updateAssignment.marks
        //         },
        //     };
        //     const result = await allAssignmentCollection.updateOne(query, updateDoc,options)
        //     res.send(result)
        // })

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
    res.send('Online group study')
})
app.listen(port, () => {
    console.log(`server is running port:${port}`);
})