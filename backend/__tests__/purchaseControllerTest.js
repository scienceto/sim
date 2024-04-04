// Import controller methods to be tested
const { listPurchases, getPurchase, addPurchase } = require('../controller/purchaseController');

// Mock sequelize dependencies (OpTypes)
jest.mock('sequelize', () => ({
    Op: {
        eq: 'mocked_eq_operator',
        ne: 'mocked_ne_operator',
    },
}));
// Once mocked Op dependency can be imported from mock
const { Op } = require('sequelize');

// Mock models being used/called by the controller methods
jest.mock('../models/models', () => ({
    sequelize: {
        transaction: jest.fn(),
    },
    Purchase: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    TradeRecord: {
        findAll: jest.fn(),
        create: jest.fn(),
    }
}));
// Import models used by the controller methods, after mocking the models
const { Purchase, TradeRecord } = require('../models/models');

// Test addPurchase method of the controller (2 unittests)
describe('addPurchase', () => {
    it('should add a purchase and trade records', async () => {
        /**
         * This unittest tests the addPurchase method of the purchaseController for successful response.
         * The method expects proper req and res object and uses sequelize transactions hence the unittest mocks the following dependencies:
         * - res and req arguments
         * - sequelize.transaction
         */
        // Mock request and response objects to be passed to the method
        const req = {
            body: {
                supplier: 'Supplier',
                trade_records: [
                    {
                        quantity: 10,
                        price: 100,
                        product: 'Product 1',
                        warehouse: 'Warehouse 1',
                    },
                    {
                        quantity: 20,
                        price: 200,
                        product: 'Product 2',
                        warehouse: 'Warehouse 2',
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Create a mock transaction used by the controller to add new purchase record
        // along with its corresponding trade records
        const mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        const sequelizeMock = require('../models/models').sequelize;
        sequelizeMock.transaction.mockResolvedValue(mockTransaction);

        // Mock a new purchase
        // and resolve Purchase.create mock method to the new mock purchase
        const mockNewPurchase = { id: 1, timestamp: new Date(), trade_status: 'PENDING', supplier: 'Supplier' };
        const purchaseCreateMock = require('../models/models').Purchase.create;
        purchaseCreateMock.mockResolvedValue(mockNewPurchase);

        // Mock trade records corresponding to the new purchase
        // and resolve TradeRecord.create mock method to the new mock trade records
        const tradeRecordCreateMock = require('../models/models').TradeRecord.create;
        tradeRecordCreateMock.mockResolvedValue();

        // Call the actual method
        await addPurchase(req, res);

        // Assert method calls and resolved objects
        // expect mock transaction to be called once
        expect(sequelizeMock.transaction).toHaveBeenCalled();
        // check Purchase.create is called once with the correct argument
        expect(purchaseCreateMock).toHaveBeenCalledWith(
            {
                timestamp: expect.any(Date),
                trade_status: 'PENDING',
                supplier: 'Supplier',
            },
            { transaction: mockTransaction }
        );
        // expect the TradeRecord.create() called 2 times for the 2 mock trade records
        expect(tradeRecordCreateMock).toHaveBeenCalledTimes(2);
        expect(tradeRecordCreateMock).toHaveBeenCalledWith(
            {
                quantity: 10,
                price: 100,
                product: 'Product 1',
                warehouse: 'Warehouse 1',
                purchase: mockNewPurchase.id,
            },
            { transaction: mockTransaction }
        );
        expect(tradeRecordCreateMock).toHaveBeenCalledWith(
            {
                quantity: 20,
                price: 200,
                product: 'Product 2',
                warehouse: 'Warehouse 2',
                purchase: mockNewPurchase.id,
            },
            { transaction: mockTransaction }
        );
        // Check if commit is called on the mock transaction
        expect(mockTransaction.commit).toHaveBeenCalled();
        // check if the expected status and response is returned
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewPurchase);
    });

    it('should handle error during purchase creation', async () => {
        /**
         * This unittest tests the error handling of addPurchase method.
         * Just like above unittest, it creates mock dependencies.
         * But incorrect argument is passed to check the error response from the method.
         */
        // Mock request and response objects
        const req = {
            body: {
                supplier: 'Supplier',
                trade_records: [
                    {
                        quantity: 10,
                        price: 100,
                        product: 'Product 1',
                        warehouse: 'Warehouse 1',
                    },
                ],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock transaction
        const mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        const sequelizeMock = require('../models/models').sequelize;
        sequelizeMock.transaction.mockResolvedValue(mockTransaction);

        // Mock creation of Purchase to simulate an error
        const purchaseCreateMock = require('../models/models').Purchase.create;
        purchaseCreateMock.mockRejectedValue(new Error('Failed to create purchase'));

        // Call the actual method
        await addPurchase(req, res);

        // Check the expected values for function calls and resolved objects
        expect(sequelizeMock.transaction).toHaveBeenCalled();
        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add purchase.' });
    });
});

describe('listPurchases', () => {
    it('should return all purchases with their associated trade records', async () => {
        /**
         * This unittest tests the listPurchase method of purchaseController.
         * The method to expected to resolve a list of all the purchases along with the corresponding trade_records.
         */
        // Mock data for purchases
        const mockPurchases = [
            { id: 1, timestamp: new Date(), metadata: 'metadata' },
            { id: 2, timestamp: new Date(), metadata: 'metadata' }
        ].map(purchase => ({
            ...purchase,
            toJSON: jest.fn().mockReturnValue(purchase)
        }));

        // Mock data for associated trade records
        const mockTradeRecords = [
            { id: 1, purchase: 1, quantity: 10, price: 100 },
            { id: 2, purchase: 2, quantity: 5, price: 50 }
        ];

        // Mock the implementation of Purchase.findAll to return the mock purchases
        Purchase.findAll.mockResolvedValue(mockPurchases);

        // Mock the implementation of TradeRecord.findAll to return the mock trade records
        TradeRecord.findAll.mockResolvedValue(mockTradeRecords);

        // Mock the request and response objects
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the listPurchases method
        await listPurchases(req, res);

        // Assert that Purchase.findAll was called once
        expect(Purchase.findAll).toHaveBeenCalledTimes(1);

        // Assert that TradeRecord.findAll was called once with the correct where clause for query
        expect(TradeRecord.findAll).toHaveBeenCalledWith({
            where: { purchase: { [Op.ne]: null } }
        });

        // Assert that the response status is 200 (OK)
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the response JSON is the expected data
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                timestamp: expect.any(Date),
                metadata: expect.any(String),
                tradeRecords: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        purchase: expect.any(Number),
                        quantity: expect.any(Number),
                        price: expect.any(Number)
                    })
                ])
            })
        ]));
    });

    it('should handle errors', async () => {
        // Mock the error
        const errorMessage = 'Database error';
        Purchase.findAll.mockRejectedValue(new Error(errorMessage));

        // Mock the request and response objects
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the listPurchases method
        await listPurchases(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        // This is to mock if the controller returns right status code
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('getPurchase', () => {
    it('should return the purchase with associated trade records', async () => {
        /**
         * This unittest tests the getPurchase method of purchaseController.
         * The method to expected to resolve the purchase, belonging to the id passed in the req object,
         * along with the corresponding trade_records.
         */
        // Mock data for the purchase
        const mockPurchase = {
            id: 1,
            timestamp: new Date(),
            metadata: 'metadata',
        };
        mockPurchase.toJSON = jest.fn().mockReturnValue(mockPurchase);

        // Mock data for associated trade records
        const mockTradeRecords = [
            { id: 1, purchase: 1, quantity: 10, price: 100 },
            { id: 2, purchase: 1, quantity: 5, price: 50 }
        ];

        // Mock the implementation of Purchase.findByPk to return the mock purchase
        Purchase.findByPk.mockResolvedValue(mockPurchase);

        // Mock the implementation of TradeRecord.findAll to return the mock trade records
        TradeRecord.findAll.mockResolvedValue(mockTradeRecords);

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the getPurchase method
        await getPurchase(req, res);

        // Assert that Purchase.findByPk was called once with the correct id
        expect(Purchase.findByPk).toHaveBeenCalledWith(req.params.id);

        // Assert that TradeRecord.findAll was called once with the correct where clause
        expect(TradeRecord.findAll).toHaveBeenCalledWith({
            where: { purchase: mockPurchase.id }
        });

        // Assert that the response status is 200 (OK)
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the response JSON is the expected purchase object with trade_records
        expect(res.json).toHaveBeenCalledWith({
            ...mockPurchase,
            trade_records: mockTradeRecords
        });
    });

    it('should handle purchase not found', async () => {
        /**
         * This unittest tests the getPurchase method of purchaseController when there is no purchase
         * record corresponding to the id passed in the req object
         */
        // Mock Purchase.findByPk to return null (purchase not found)
        Purchase.findByPk.mockResolvedValue(null);

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the getPurchase method
        await getPurchase(req, res);

        // Assert that Purchase.findByPk was called once with the correct id
        expect(Purchase.findByPk).toHaveBeenCalledWith(req.params.id);

        // Assert that the response status is 404 (Not Found)
        expect(res.status).toHaveBeenCalledWith(404);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Purchase not found.' });
    });

    it('should handle errors', async () => {
        // Mock the error
        const errorMessage = 'Database error';
        Purchase.findByPk.mockRejectedValue(new Error(errorMessage));

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the getPurchase method
        await getPurchase(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

