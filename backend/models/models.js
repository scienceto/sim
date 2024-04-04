// Import Sequelize and define connection
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
});

const UserRole = sequelize.define('UserRole', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "user_role",
    timestamps: false
});

const AppUser = sequelize.define('AppUser', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT
    },
    receive_notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: "app_user",
    timestamps: false
});
AppUser.belongsTo(UserRole, { foreignKey: {
        name: 'role',
        allowNull: true,
    }, onDelete: 'SET NULL'
});


const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: "supplier",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

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
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'warehouse', // Specify the table name if it's different from the model name
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});

const ProductCategory = sequelize.define('ProductCategory', {
    id: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "product_category",
    timestamps: false
});

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
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "product",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
Product.belongsTo(ProductCategory, { foreignKey: {
        name: 'category',
        allowNull: true,
    }, onDelete: 'SET NULL'
});

const ProductInventory = sequelize.define('ProductInventory', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'product',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    warehouse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'warehouse',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: "product_inventory",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
ProductInventory.belongsTo(Product, { foreignKey: 'product' });
ProductInventory.belongsTo(Warehouse, { foreignKey: 'warehouse' });

const TradeStatus = sequelize.define('TradeStatus', {
    id: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "trade_status",
    timestamps: false
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
    metadata: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "purchase",
    timestamps: false,
});
Purchase.belongsTo(Supplier, { foreignKey: {
        name: 'supplier',
        allowNull: false,
    }
});
Purchase.belongsTo(TradeStatus, { foreignKey: {
        name: 'trade_status',
        allowNull: false,
    }
});

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
    metadata: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "sale",
    timestamps: false,
});
Sale.belongsTo(Customer, { foreignKey: {
        name: 'customer',
        allowNull: false,
    }
});
Sale.belongsTo(TradeStatus, { foreignKey: {
        name: 'trade_status',
        allowNull: false,
    }
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
        validate: {
            min: 0,
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
}, {
    tableName: "trade_record",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
});
TradeRecord.belongsTo(Warehouse, { foreignKey: {
        name: 'warehouse',
        allowNull: false,
    }
});
TradeRecord.belongsTo(Product, { foreignKey: {
        name: 'product',
        allowNull: false,
    }
});
TradeRecord.belongsTo(Purchase, { foreignKey: {
        name: 'purchase',
        allowNull: true,
    }
});
TradeRecord.belongsTo(Sale, { foreignKey: {
        name: 'sale',
        allowNull: true,
    }
});


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
    ProductInventory,
    UserRole,
    ProductCategory,
    TradeStatus
};