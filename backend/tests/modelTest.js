const {User} = require('../models/App_User');
const {sequelize} = require('../models/Database');

(async () => {
    try {
        await sequelize.sync({ force: false }); // This will create tables based on your models

        // Query data
        const users = await User.findAll();
        console.log(users); // Display all users

        // Find a user by email
        const userEmail = 'example@example.com';
        const user = await User.findOne({ where: { email: userEmail } });
        console.log(user); // Display user with the specified email

    } catch (error) {
        console.error('Error synchronizing models:', error);
    } finally {
        await sequelize.close(); // Close the connection
    }
})();