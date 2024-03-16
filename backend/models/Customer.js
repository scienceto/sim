const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    Customer
};