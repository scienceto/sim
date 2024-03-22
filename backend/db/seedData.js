const fs = require('fs');
const { Pool } = require('pg');

// Create a PostgreSQL pool
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Default PostgreSQL port
});

// Read the SQL file
const sqlFilePath = 'db/schema.sql';
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

// Connect to the PostgreSQL database and execute the SQL query
pool.query(sqlQuery, (err, res) => {
    if (err) {
        console.error('Error executing SQL query:', err);
    } else {
        console.log('SQL file loaded successfully');
        // Read the SQL file
        const dataFilePath = 'db/seed_data.sql';
        const sqlDataLoadQuery = fs.readFileSync(dataFilePath, 'utf8');

// Connect to the PostgreSQL database and execute the SQL query
        pool.query(sqlDataLoadQuery, (err, res) => {
            if (err) {
                console.error('Error executing SQL query:', err);
            } else {
                console.log('SQL file loaded successfully');
            }

            // Close the pool after executing the query
            pool.end();
        });
    }
});

