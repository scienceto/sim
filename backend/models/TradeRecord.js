const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    TradeRecord
};