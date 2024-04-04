const { ProductInventory, Product, Warehouse, AppUser } = require('../models/models');
const { Op } = require('sequelize');
const AWS = require('aws-sdk');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const notifyLowInventory = async () => {
    try {
        AWS.config.update({
            region: process.env.AWS_REGION
        });

        const ses = new AWS.SES();

        const thresholdQuantity = 10;

        const lowInventoryProducts = await ProductInventory.findAll({
            where: {
                quantity: {
                    [Op.lt]: thresholdQuantity
                }
            },
            include: [
                { model: Product },
                { model: Warehouse }
            ]
        });

        if (lowInventoryProducts.length > 0) {
            const users = await AppUser.findAll({
                where: {
                    receive_notification: true
                }
            });

            const csvFilePath = './low_inventory_products.csv';

            const csvWriter = createCsvWriter({
                path: csvFilePath,
                header: [
                    { id: 'product', title: 'Product' },
                    { id: 'warehouse', title: 'Warehouse' },
                    { id: 'quantity', title: 'Quantity' }
                ]
            });

            // Write low inventory products data to CSV file
            await csvWriter.writeRecords(lowInventoryProducts.map(product => ({
                product: product.Product.name,
                warehouse: product.Warehouse.name,
                quantity: product.quantity
            })));

            const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

            const emailParams = {
                Destinations: users.map(user => user.id),
                RawMessage: {
                    Data: `From: ${process.env.SES_EMAIL_SENDER}\n`
                        + `To: ${users.map(user => user.id).join(',')}\n`
                        + `Subject: Low Inventory Products Notification\n`
                        + `Content-Type: multipart/mixed; boundary="nextPart"\n\n`
                        + `--nextPart\n`
                        + `Content-Type: text/plain\n\n`
                        + `Dear user,\n\nPlease find the attached CSV file containing low inventory products.\n\nThank you.\n\n`
                        + `--nextPart\n`
                        + `Content-Type: text/csv; name="low_inventory_products.csv"\n`
                        + `Content-Disposition: attachment; filename="low_inventory_products.csv"\n\n`
                        + `${csvFileContent}\n\n`
                        + `--nextPart--`
                }
            };

            await ses.sendRawEmail(emailParams).promise();

            console.log('Notification email with CSV attachment sent successfully.');

            fs.unlinkSync(csvFilePath);
        }

    } catch (error) {
        console.error('Error in notifying users about low inventory:', error);
    }
};

module.exports = {
    notifyLowInventory
};

// notifyLowInventory().then(() => {
//     console.log("Success");
// }).catch((err) => {
//     console.log(err);
// })