// Import the function to be tested
const { notifyLowInventory } = require('../controller/notificationController');
const process = require("process");

// Mock the required modules
jest.mock('aws-sdk', () => {
    return {
        SES: jest.fn(() => ({
            sendRawEmail: jest.fn().mockReturnThis(),
            promise: jest.fn(),
        })),
        config: {
            update: jest.fn()
        },
    };
});
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    unlinkSync: jest.fn(),
}));

// Test suite for the notifyLowInventory function
describe('notifyLowInventory', () => {
    // Test case for successful notification
    it('should send notification email with CSV attachment for low inventory products', async () => {
        // Mock low inventory products data
        const lowInventoryProducts = [
            {
                Product: { name: 'Product 3', disabled: false, description: 'Description 3', category: "DEFAULT" },
                Warehouse: { name: 'Warehouse 1', address: 'Address 1', disabled: false },
                quantity: 5,
            }
        ];

        // Mock users data
        const users = [
            { id: 'jp9959@g.rit.edu', name: 'Jheel Patel', disabled: false, role: "VIEWER" }
        ];

        // Mock CSV file content
        const csvFileContent = 'product,warehouse,quantity\nProduct 1,Warehouse 1,5\nProduct 2,Warehouse 2,8\n';

        // Mock fs.readFileSync to return CSV file content
        require('fs').readFileSync.mockReturnValue(csvFileContent);

        // Call the function
        await notifyLowInventory();

        // Expectations
        expect(require('aws-sdk').SES).toHaveBeenCalledTimes(1);
        expect(require('aws-sdk').SES.mock.instances[0].sendRawEmail).toHaveBeenCalledTimes(1);
        expect(require('fs').readFileSync).toHaveBeenCalledTimes(1);
        expect(require('fs').unlinkSync).toHaveBeenCalledTimes(1);
    });

    // Test case for no low inventory products
    it('should not send notification email if there are no low inventory products', async () => {
        // Mock low inventory products data
        const lowInventoryProducts = [];

        // Call the function
        await notifyLowInventory();

        // Expectations
        expect(require('aws-sdk').SES).not.toHaveBeenCalled();
        expect(require('fs').readFileSync).not.toHaveBeenCalled();
        expect(require('fs').unlinkSync).not.toHaveBeenCalled();
    });
});
