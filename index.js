const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4500;

// Middleware
app.use(cors());
app.use(express.json());







// Routes
app.get('/', (req, res) => {
    res.send('Server is running perfectly!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
