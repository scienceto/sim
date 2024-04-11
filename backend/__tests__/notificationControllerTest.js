const { notifyLowInventory } = require('../controller/notificationController');
const { ProductInventory, AppUser } = require('../models/models');
const AWS = require('aws-sdk');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Mock the aws-sdk
jest.mock('aws-sdk', () => {
    // Mock the SES service
    const mockSES = {
        sendRawEmail: jest.fn().mockReturnThis(), // Mock the sendRawEmail method
        promise: jest.fn() // Mock the promise method
    };

    // Return an object with the SES service
    return {
        config: {
            update: jest.fn() // Mock the update method of config
        },
        SES: jest.fn(() => mockSES) // Mock the SES constructor
    };
});

// Mock fs module
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    unlinkSync: jest.fn()
}));

// Mock csv-writer module
jest.mock('csv-writer', () => ({
    createObjectCsvWriter: jest.fn().mockReturnValue({
        writeRecords: jest.fn().mockResolvedValue(true)
    })
}));

// Mock ProductInventory.findAll as a jest mock function
jest.mock('../models/models', () => ({
    ProductInventory: {
        findAll: jest.fn()
    },
    AppUser: {
        findAll: jest.fn()
    }
}));

// Custom mock reset method
const customMockReset = () => {
    AppUser.findAll.mockReset();
    ProductInventory.findAll.mockReset();
    AWS.SES().sendRawEmail.mockReset();
    createCsvWriter.mockReset();
    fs.readFileSync.mockReset();
    fs.unlinkSync.mockReset();
}

describe('notifyLowInventory', () => {
    it('should notify users about low inventory products', async () => {
        // Mock low inventory products
        const mockLowInventoryProducts = [
            {
                id: 1,
                quantity: 5,
                Product: { name: 'Product A' },
                Warehouse: { name: 'Warehouse 1' }
            },
            {
                id: 2,
                quantity: 8,
                Product: { name: 'Product B' },
                Warehouse: { name: 'Warehouse 2' }
            }
        ];
        ProductInventory.findAll.mockResolvedValue(mockLowInventoryProducts);

        // Mock users who receive notifications
        const mockUsers = [{ id: 1 }, { id: 2 }];
        AppUser.findAll.mockResolvedValue(mockUsers);

        // Mock CSV file path
        const mockCsvFilePath = './low_inventory_products.csv';

        // Mock CSV file content
        const mockCsvFileContent = 'id,product,warehouse,quantity\n1,Product A,Warehouse 1,5\n2,Product B,Warehouse 2,8\n';

        // Mock CSV file read
        fs.readFileSync.mockReturnValue(mockCsvFileContent);

        // Call the notifyLowInventory method
        await notifyLowInventory();

        // Assert that ProductInventory.findAll was called
        expect(ProductInventory.findAll).toHaveBeenCalledTimes(1);
        // Assert that AWS SES sendRawEmail method was called
        expect(AWS.SES().sendRawEmail).toHaveBeenCalledTimes(1);
        // Assert that createCsvWriter was called with correct parameters
        expect(createCsvWriter).toHaveBeenCalledWith({
            path: mockCsvFilePath,
            header: [
                { id: 'product', title: 'Product' },
                { id: 'warehouse', title: 'Warehouse' },
                { id: 'quantity', title: 'Quantity' }
            ]
        });
        // Assert that fs.readFileSync was called with correct file path
        expect(fs.readFileSync).toHaveBeenCalledWith(mockCsvFilePath, 'utf8');
        // Assert that fs.unlinkSync was called with correct file path
        expect(fs.unlinkSync).toHaveBeenCalledWith(mockCsvFilePath);
    });

    it('should not notify users if there are no low inventory products', async () => {
        // Reset mocks before evaluating
        customMockReset();
        // Mock empty low inventory products
        ProductInventory.findAll.mockResolvedValue([]);

        // Call the notifyLowInventory method
        await notifyLowInventory();

        // Assert that ProductInventory.findAll was called
        expect(ProductInventory.findAll).toHaveBeenCalledTimes(1);
        // Assert that AWS SES sendRawEmail method was not called
        expect(AWS.SES().sendRawEmail).not.toHaveBeenCalled();
        // Assert that createCsvWriter was not called
        expect(createCsvWriter).not.toHaveBeenCalled();
        // Assert that fs.readFileSync was not called
        expect(fs.readFileSync).not.toHaveBeenCalled();
        // Assert that fs.unlinkSync was not called
        expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
        // Reset mocks before evaluating
        customMockReset();
        // Mock error
        const errorMessage = 'Database error';
        ProductInventory.findAll.mockRejectedValue(new Error(errorMessage));

        // Call the notifyLowInventory method
        await notifyLowInventory();

        // Assert that ProductInventory.findAll was called
        expect(ProductInventory.findAll).toHaveBeenCalledTimes(1);
        // Assert that AWS SES sendRawEmail method was not called
        expect(AWS.SES().sendRawEmail).not.toHaveBeenCalled();
        // Assert that createCsvWriter was not called
        expect(createCsvWriter).not.toHaveBeenCalled();
        // Assert that fs.readFileSync was not called
        expect(fs.readFileSync).not.toHaveBeenCalled();
        // Assert that fs.unlinkSync was not called
        expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
});
