const {AppUser} = require('../models/models');
const {sequelize} = require('../models/database');

(async () => {
    try {
        const users = await AppUser.findAll();
        console.log(users);
    } catch (error) {
        console.error('Error querying users:', error);
    } finally {
        await sequelize.close();
    }
})();