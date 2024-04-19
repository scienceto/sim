const db = require("../models/models");

db.sequelize.drop().then(() => {
    db.sequelize.sync().then(async () => {
        console.log("DB Sync Successful");
        try {
            // Seed data for UserRole
            await db.UserRole.bulkCreate([
                { id: 'ADMIN', disabled: false },
                { id: 'OPERATOR', disabled: false },
                { id: 'VIEWER', disabled: false },
            ]);

            // Seed data for ProductCategory
            await db.ProductCategory.bulkCreate([
                { id: 'DEFAULT', disabled: false }
            ]);

            // Seed data for TradeStatus
            await db.TradeStatus.bulkCreate([
                { id: 'PENDING', disabled: false },
                { id: 'COMPLETED', disabled: false },
                { id: 'CANCELED', disabled: false }
            ]);
            // Seed data for AppUser
            await db.AppUser.bulkCreate([
                { id: 'john.doe@example.com', name: 'John Doe', disabled: false, role: "ADMIN", receive_notification: false },
                { id: 'jp9959@g.rit.edu', name: 'Jheel Patel', disabled: false, role: "VIEWER" },
                { id: 'pn3270@g.rit.edu', name: 'Praneet Naik', disabled: false, role: "OPERATOR" }
            ]);

            // Seed data for Supplier
            await db.Supplier.bulkCreate([
                { name: 'NAIK SUPPLIERS', contact_email: 'supplier1@example.com', address: 'Address 1', disabled: false },
                { name: 'PATEL TRADERS', contact_email: 'supplier2@example.com', address: 'Address 2', disabled: false },
                { name: 'MUKKADAM TRADERS', contact_email: 'supplier3@example.com', address: 'Address 3', disabled: false },
                { name: 'SETPAL TRANSPORTS', contact_email: 'supplier4@example.com', address: 'Address 4', disabled: false }     
            ]);

            // Seed data for Customer
            await db.Customer.bulkCreate([
                { name: 'Customer 1', contact_email: 'customer1@example.com', address: 'Address 1', disabled: false, metadata: '{}' },
                { name: 'Customer 2', contact_email: 'customer2@example.com', address: 'Address 2', disabled: false, metadata: '{}' }
            ]);

            // Seed data for Product
            await db.Product.bulkCreate([
                { name: 'TUMERIC', disabled: false, description: 'Description 1', category: "DEFAULT" },
                { name: 'CHICKEN', disabled: false, description: 'Description 2', category: "DEFAULT" },
                { name: 'LENTILS', disabled: false, description: 'Description 3', category: "DEFAULT" }
            ]);

            // Seed data for Warehouse
            await db.Warehouse.bulkCreate([
                { name: 'PRANEET MART', address: 'Address 1', disabled: false },
                { name: 'DHABA BHAI', address: 'Address 2', disabled: false }
            ]);

            // Seed data for Purchase
            await db.Purchase.bulkCreate([
                { timestamp: "2024-04-04T21:19:55.943Z", supplier: 1, trade_status: "COMPLETED" },
                { timestamp: "2024-04-06T21:19:55.943Z", supplier: 1, trade_status: "COMPLETED" },
                { timestamp: "2024-04-15T21:19:55.943Z", supplier: 1, trade_status: "COMPLETED" },
                { timestamp: "2024-05-04T21:19:55.943Z", supplier: 2, trade_status: "COMPLETED" },
                { timestamp: "2024-05-05T21:19:55.943Z", supplier: 2, trade_status: "COMPLETED" },
                { timestamp: "2024-05-06T21:19:55.943Z", supplier: 3, trade_status: "COMPLETED" },
                { timestamp: "2024-06-04T21:19:55.943Z", supplier: 3, trade_status: "COMPLETED" },
                { timestamp: "2024-06-05T21:19:55.943Z", supplier: 4, trade_status: "COMPLETED" },
                { timestamp: "2024-06-06T21:19:55.943Z", supplier: 4, trade_status: "COMPLETED" }
            ]);

            // Seed data for Sale
            await db.Sale.bulkCreate([
                { timestamp: new Date(), customer: 1, trade_status: "PENDING" },
                { timestamp: new Date(), customer: 2, trade_status: "COMPLETED" }
            ]);

            // Seed data for TradeRecord
            await db.TradeRecord.bulkCreate([
                { quantity: 10, price: 100, warehouse: 1, product: 1, purchase: 1 },
                { quantity: 20, price: 200, warehouse: 2, product: 2, purchase: 2 },
                { quantity: 30, price: 200, warehouse: 1, product: 3, purchase: 3 },
                { quantity: 50, price: 200, warehouse: 2, product: 1, purchase: 4 },
                { quantity: 70, price: 200, warehouse: 1, product: 2, purchase: 5 },
                { quantity: 90, price: 200, warehouse: 2, product: 3, purchase: 6 },
                { quantity: 10, price: 200, warehouse: 1, product: 1, purchase: 7 },
                { quantity: 220, price: 200, warehouse: 2, product: 2, purchase: 8 },
                { quantity: 210, price: 200, warehouse: 1, product: 3, purchase: 9 },
                { quantity: 40, price: 100, warehouse: 1, product: 1, sale: 1 },
                { quantity: 60, price: 200, warehouse: 2, product: 2, sale: 2 }
            ]);

            // Seed data for ProductInventory
            await db.ProductInventory.bulkCreate([
                { quantity: 100, product: 1, warehouse: 1 },
                { quantity: 200, product: 1, warehouse: 2 },
                { quantity: 100, product: 2, warehouse: 1 },
                { quantity: 200, product: 2, warehouse: 2 },
                { quantity: 5, product: 3, warehouse: 1 },
                { quantity: 50, product: 3, warehouse: 2 }
            ]);

            console.log('Seed data inserted successfully.');
        } catch (error) {
            console.error('Error inserting seed data:', error);
        }
    }).catch((err) => {
        console.log("DB Sync Error", err.message);
    });
}).catch((err) => {
    console.log("DB Drop Error", err.message);
});