const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    Warehouse
};