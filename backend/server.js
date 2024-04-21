const { db, app } = require("./index");
const PORT = process.env.PORT || 5000;

const server = new Promise(async (resolve) => {
    await db.sequelize.sync();
    resolve(app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }));
});

module.exports = {
    server
};