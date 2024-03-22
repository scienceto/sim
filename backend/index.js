const express = require("express");
const app = express();

const productRoutes = require('./routes/productRoutes');

// Import Sequelize models and sync database
const db = require("./models/models");

const dbSync = db.sequelize.sync();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes for handling product inventory
app.use('/', productRoutes);

app.use('/health', async (req, res) => {
    return res.status(200).send("OK");
});

// Start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
    app,
    server,
    dbSync
};