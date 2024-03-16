const {sequelize, DataTypes} = require('./Database');

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
});

module.exports = {
    Sale
};