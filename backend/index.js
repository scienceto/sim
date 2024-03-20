// const express = require("express");
// const app = express();

// const productRoutes = require('./routes/productRoutes');

// app.use(express.json());
// app.use('/inventory', productRoutes);

// const pg = require("pg");

// const db = require("./models/models")

// db.sequelize.sync().then((req)=>{

// // app.listen(3001, () =>{
// //     console.log("Server Running");
// // });
// // });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// });
const express = require("express");
const app = express();

const productRoutes = require('./routes/productRoutes');

// Import Sequelize models and sync database
const db = require("./models/models");

db.sequelize.sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch(error => {
    console.error("Error syncing database:", error);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Routes for handling product inventory
app.use('/inventory', productRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
