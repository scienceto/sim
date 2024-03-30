const db = require("../models/models");

db.sequelize.drop().then(() => {
    db.sequelize.sync().then(async () => {
        console.log("DB Sync Successful");
        try {
            // Seed data for UserRole
            await db.UserRole.bulkCreate([
                { id: 'ADMIN', disabled: false },
                { id: 'EDITOR', disabled: false },
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
                { id: 'john.doe@example.com', name: 'John Doe', disabled: false, role: "ADMIN" },
                { id: 'john.smith@example.com', name: 'Jane Smith', disabled: false, role: "EDITOR" }
            ]);

            // Seed data for Supplier
            await db.Supplier.bulkCreate([
                { name: 'Supplier 1', contact_email: 'supplier1@example.com', address: 'Address 1', disabled: false },
                { name: 'Supplier 2', contact_email: 'supplier2@example.com', address: 'Address 2', disabled: false }
            ]);

            // Seed data for Customer
            await db.Customer.bulkCreate([
                { name: 'Customer 1', contact_email: 'customer1@example.com', address: 'Address 1', disabled: false, metadata: '{}' },
                { name: 'Customer 2', contact_email: 'customer2@example.com', address: 'Address 2', disabled: false, metadata: '{}' }
            ]);

            // Seed data for Product
            await db.Product.bulkCreate([
                { name: 'Product 1', disabled: false, description: 'Description 1', category: "DEFAULT" },
                { name: 'Product 2', disabled: false, description: 'Description 2', category: "DEFAULT" }
            ]);

            // Seed data for Warehouse
            await db.Warehouse.bulkCreate([
                { name: 'Warehouse 1', address: 'Address 1', disabled: false },
                { name: 'Warehouse 2', address: 'Address 2', disabled: false }
            ]);

            // Seed data for TradeRecord
            await db.TradeRecord.bulkCreate([
                { quantity: 10, price: 100, warehouse: 1, product: 1 },
                { quantity: 20, price: 200, warehouse: 2, product: 2 },
                { quantity: 10, price: 100, warehouse: 1, product: 1 },
                { quantity: 20, price: 200, warehouse: 2, product: 2 }
            ]);

            // Seed data for Purchase
            await db.Purchase.bulkCreate([
                { timestamp: new Date(), customer: 1, trade_record: 1, trade_status: "PENDING" },
                { timestamp: new Date(), customer: 2, trade_record: 2, trade_status: "COMPLETED" }
            ]);

            // Seed data for Sale
            await db.Sale.bulkCreate([
                { timestamp: new Date(), supplier: 1, trade_record: 3, trade_status: "PENDING" },
                { timestamp: new Date(), supplier: 2, trade_record: 4, trade_status: "COMPLETED" }
            ]);

            // Seed data for ProductInventory
            await db.ProductInventory.bulkCreate([
                { quantity: 100, product: 1, warehouse: 1 },
                { quantity: 200, product: 1, warehouse: 2 },
                { quantity: 100, product: 2, warehouse: 1 },
                { quantity: 200, product: 2, warehouse: 2 }
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