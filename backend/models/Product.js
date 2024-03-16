const {sequelize, DataTypes} = require('./Database');

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
    purchasePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

module.exports = {
    Product
};