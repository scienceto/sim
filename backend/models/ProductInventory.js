const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    ProductInventory
};