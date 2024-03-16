const {sequelize, DataTypes} = require('./Database');

const App_User = sequelize.define('User', {
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
});

module.exports = {
    User: App_User
};