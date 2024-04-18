const express = require("express");
const app = express();
var cors = require('cors');
const db = require("./models/models");

const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Routes for handling product inventory
app.use('/products', productRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/sales', saleRoutes);
app.use('/suppliers', saleRoutes);
// Server health status
app.use('/health', async (req, res) => {
    return res.status(200).send("OK");
});

const server = new Promise(async (resolve) => {
    await db.sequelize.sync();
    resolve(app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }));
});

module.exports = {
    server
};