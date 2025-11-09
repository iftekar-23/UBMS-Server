const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4500;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.1yqh28p.mongodb.net/?appName=Cluster0`;

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
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        const db = client.db('ubms_db');
        const billsCollection = db.collection('bills');
        const paymentsCollection = db.collection('payments');



        // / GET all bills
        app.get('/bills', async (req, res) => {
            const bills = await billsCollection.find({}).toArray();
            res.send(bills);
        });

        // / Post all bills
        app.post('/bills', async (req, res) => {
            const bill = req.body;
            const result = await billsCollection.insertOne(bill);
            res.send(result);
        });

        const { ObjectId } = require('mongodb');

        app.get("/bills/:id", async (req, res) => {
            const { id } = req.params;

            try {
                const bill = await billsCollection.findOne({ _id: new ObjectId(id) });
                if (!bill) return res.status(404).send({ message: "Not found" });
                res.json(bill);
            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Invalid ID" });
            }
        });

        // DELETE /payments/:id
        app.delete('/payments/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await paymentsCollection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "Payment deleted successfully", result });
            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Failed to delete payment" });
            }
        });

       



        // POST /payments
        app.post('/payments', async (req, res) => {
            const payment = req.body;


            try {
                const result = await paymentsCollection.insertOne(payment);
                res.status(201).send({ message: "Payment saved successfully", data: result });
            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Failed to save payment" });
            }
        });


        // GET /payments
        app.get('/payments', async (req, res) => {
            try {
                const payments = await paymentsCollection.find({}).toArray();
                res.json(payments);
            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Failed to fetch payments" });
            }
        });



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Routes
app.get('/', (req, res) => {
    res.send('Server is running perfectly!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
