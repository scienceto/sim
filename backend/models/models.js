// Import Sequelize and define connection
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const AppUser = sequelize.define('AppUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    metadata: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "app_user",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "customer",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "supplier",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const Purchase = sequelize.define('Purchase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: "purchase",
    timestamps: false,
});
Purchase.belongsTo(Supplier, { foreignKey: 'supplier', onDelete: 'CASCADE' });
Purchase.belongsTo(AppUser, { foreignKey: 'app_user', onDelete: 'CASCADE' });

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: "sale",
    timestamps: false,
});
Sale.belongsTo(Customer, { foreignKey: 'customer', onDelete: 'CASCADE' });
Sale.belongsTo(AppUser, { foreignKey: 'app_user', onDelete: 'CASCADE' });

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: "product",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const TradeRecord = sequelize.define('TradeRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: "trade_record",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
TradeRecord.belongsTo(Product, { foreignKey: 'product', onDelete: 'CASCADE' });
TradeRecord.belongsTo(Purchase, { foreignKey: 'purchase', onDelete: 'CASCADE' });
TradeRecord.belongsTo(Sale, { foreignKey: 'sale', onDelete: 'CASCADE' });

const Warehouse = sequelize.define('Warehouse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'warehouse', // Specify the table name if it's different from the model name
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const ProductInventory = sequelize.define('ProductInventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "product_inventory",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
ProductInventory.belongsTo(Product, { foreignKey: 'product', onDelete: 'CASCADE' });
ProductInventory.belongsTo(Warehouse, { foreignKey: 'warehouse', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    DataTypes,
    AppUser,
    Supplier,
    Customer,
    Purchase,
    Sale,
    Product,
    TradeRecord,
    Warehouse,
    ProductInventory
};