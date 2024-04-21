const express = require("express");
const app = express();
const cors = require('cors');
const db = require("./models/models");
const serverless = require('serverless-http');

const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const generatePDFRoutes = require('./routes/generatePDFRecordRoutes')

// Middleware to parse JSON bodies
app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
};
app.use(cors(corsOptions));

// Routes for handling product inventory
app.use('/products', productRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/sales', saleRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/pdfs', generatePDFRoutes);

// Server health status
app.use('/health', async (req, res) => {
    return res.status(200).send("OK");
});

// Wrap Express app with serverless-http
const handler = serverless(app);

exports.app = app;
exports.db = db;

// Export the handler for use in Lambda function
exports.handler = async (event, context) => {
    // Proxy the Lambda event and context to the Express app handler
    return await handler(event, context);
};
