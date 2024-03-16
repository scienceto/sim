const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    Purchase
};