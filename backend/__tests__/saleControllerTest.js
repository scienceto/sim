// Import controller methods to be tested
const { listSales, getSale, addSale, fulfillSale } = require('../controller/saleController');

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
    Sale: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    TradeRecord: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn()
    },
    ProductInventory: {
        findOne: jest.fn()
    }
}));
// Import models used by the controller methods, after mocking the models
const { Sale, TradeRecord, ProductInventory } = require('../models/models');

// Test addsale method of the controller (2 unittests)
describe('addSale', () => {
    it('should add a sale and trade records', async () => {
        /**
         * This unittest tests the addSale method of the saleController for successful response.
         * The method expects proper req and res object and uses sequelize transactions hence the unittest mocks the following dependencies:
         * - res and req arguments
         * - sequelize.transaction
         */
        // Mock request and response objects to be passed to the method
        const req = {
            body: {
                customer: 'Customer',
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

        // Create a mock transaction used by the controller to add new sale record
        // along with its corresponding trade records
        const mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        const sequelizeMock = require('../models/models').sequelize;
        sequelizeMock.transaction.mockResolvedValue(mockTransaction);

        // Mock a new sale
        // and resolve Sale.create mock method to the new mock sale
        const mockNewSale = { id: 1, timestamp: new Date(), trade_status: 'PENDING', customer: 'Customer' };
        const saleCreateMock = require('../models/models').Sale.create;
        saleCreateMock.mockResolvedValue(mockNewSale);

        // Mock trade records corresponding to the new sale
        // and resolve TradeRecord.create mock method to the new mock trade records
        const tradeRecordCreateMock = require('../models/models').TradeRecord.create;
        tradeRecordCreateMock.mockResolvedValue();

        // Call the actual method
        await addSale(req, res);

        // Assert method calls and resolved objects
        // expect mock transaction to be called once
        expect(sequelizeMock.transaction).toHaveBeenCalledTimes(1);
        // check Purchase.create is called once with the correct argument
        expect(saleCreateMock).toHaveBeenCalledWith(
            {
                timestamp: expect.any(Date),
                trade_status: 'PENDING',
                customer: 'Customer',
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
                sale: mockNewSale.id,
            },
            { transaction: mockTransaction }
        );
        expect(tradeRecordCreateMock).toHaveBeenCalledWith(
            {
                quantity: 20,
                price: 200,
                product: 'Product 2',
                warehouse: 'Warehouse 2',
                sale: mockNewSale.id,
            },
            { transaction: mockTransaction }
        );
        // Check if commit is called on the mock transaction
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
        // check if the expected status and response is returned
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewSale);
    });

    it('should handle error during sale creation', async () => {
        /**
         * This unittest tests the error handling of addSale method.
         * Just like above unittest, it creates mock dependencies.
         * But incorrect argument is passed to check the error response from the method.
         */
        // Mock request and response objects
        const req = {
            body: {
                customer: 'Customer',
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

        // Mock creation of Sale to simulate an error
        const saleCreateMock = require('../models/models').Sale.create;
        saleCreateMock.mockRejectedValue(new Error('Failed to create sale'));

        // Call the actual method
        await addSale(req, res);

        // Check the expected values for function calls and resolved objects
        expect(sequelizeMock.transaction).toHaveBeenCalled();
        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add sale.' });
    });
});

describe('listSales', () => {
    it('should return all sales with their associated trade records', async () => {
        /**
         * This unittest tests the listSale method of saleController.
         * The method to expected to resolve a list of all the sales along with the corresponding trade_records.
         */
        // Mock data for sales
        const mockSales = [
            { id: 1, timestamp: new Date(), metadata: 'metadata' },
            { id: 2, timestamp: new Date(), metadata: 'metadata' }
        ].map(sale => ({
            ...sale,
            toJSON: jest.fn().mockReturnValue(sale)
        }));

        // Mock data for associated trade records
        const mockTradeRecords = [
            { id: 1, sale: 1, quantity: 10, price: 100 },
            { id: 2, sale: 2, quantity: 5, price: 50 }
        ];

        // Mock the implementation of Sale.findAll to return the mock sales
        Sale.findAll.mockResolvedValue(mockSales);

        // Mock the implementation of TradeRecord.findAll to return the mock trade records
        TradeRecord.findAll.mockResolvedValue(mockTradeRecords);

        // Mock the request and response objects
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the listSales method
        await listSales(req, res);

        // Assert that Sale.findAll was called once
        expect(Sale.findAll).toHaveBeenCalledTimes(1);

        // Assert that TradeRecord.findAll was called once with the correct where clause for query
        expect(TradeRecord.findAll).toHaveBeenCalledWith({
            where: { sale: { [Op.ne]: null } }
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
                        sale: expect.any(Number),
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

        // Call the listSales method
        await listSales(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        // This is to mock if the controller returns right status code
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('getSale', () => {
    it('should return the sale with associated trade records', async () => {
        /**
         * This unittest tests the getSale method of saleController.
         * The method to expected to resolve the sale, belonging to the id passed in the req object,
         * along with the corresponding trade_records.
         */
        // Mock data for the sale
        const mockSale = {
            id: 1,
            timestamp: new Date(),
            metadata: 'metadata',
        };
        mockSale.toJSON = jest.fn().mockReturnValue(mockSale);

        // Mock data for associated trade records
        const mockTradeRecords = [
            { id: 1, sale: 1, quantity: 10, price: 100 },
            { id: 2, sale: 1, quantity: 5, price: 50 }
        ];

        // Mock the implementation of Sale.findByPk to return the mock sale
        Sale.findByPk.mockResolvedValue(mockSale);

        // Mock the implementation of TradeRecord.findAll to return the mock trade records
        TradeRecord.findAll.mockResolvedValue(mockTradeRecords);

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the getSale method
        await getSale(req, res);

        // Assert that Sale.findByPk was called once with the correct id
        expect(Sale.findByPk).toHaveBeenCalledWith(req.params.id);

        // Assert that TradeRecord.findAll was called once with the correct where clause
        expect(TradeRecord.findAll).toHaveBeenCalledWith({
            where: { sale: mockSale.id }
        });

        // Assert that the response status is 200 (OK)
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the response JSON is the expected sale object with trade_records
        expect(res.json).toHaveBeenCalledWith({
            ...mockSale,
            trade_records: mockTradeRecords
        });
    });

    it('should handle sale not found', async () => {
        /**
         * This unittest tests the getSale method of saleController when there is no sale
         * record corresponding to the id passed in the req object
         */
        // Mock Sale.findByPk to return null (sale not found)
        Sale.findByPk.mockResolvedValue(null);

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the getSale method
        await getSale(req, res);

        // Assert that Sale.findByPk was called once with the correct id
        expect(Sale.findByPk).toHaveBeenCalledWith(req.params.id);

        // Assert that the response status is 404 (Not Found)
        expect(res.status).toHaveBeenCalledWith(404);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found.' });
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

        // Call the getSale method
        await getSale(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('fulfillSale', () => {
    it('should fulfill a sale successfully', async () => {
        /**
         * This unittest tests the fulfillSale method of the saleController for successful response.
         * The method expects proper req and res object and uses sequelize transactions hence the unittest mocks the following dependencies:
         * - res and req arguments
         * - sequelize.transaction
         */
        // Mock request parameters
        const req = { params: { id: 1 } };
        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock transaction
        const mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };
        const sequelizeMock = require('../models/models').sequelize;
        // Reset mock transaction call count
        sequelizeMock.transaction.mockReset();
        sequelizeMock.transaction.mockResolvedValue(mockTransaction);
        
        // Mock Purchase.findByPk to return a sale
        const mockSale = {
            id: 1,
            trade_record: 1,
            save: jest.fn().mockResolvedValue(true) // Mock the save method
        };
        Sale.findByPk.mockResolvedValue(mockSale);
        // Mock TradeRecord.findByPk to return a trade record
        const mockTradeRecord = {
            product: 1,
            warehouse: 1,
            quantity: 10,
            save: jest.fn().mockResolvedValue(true) // Mock the save method
        };
        TradeRecord.findByPk.mockResolvedValue(mockTradeRecord);
        // Mock ProductInventory.findOne to return a product inventory
        const mockProductInventory = {
            quantity: 20,
            save: jest.fn().mockResolvedValue(true) // Mock the save method
        };
        ProductInventory.findOne.mockResolvedValue(mockProductInventory);
        
        // Call the fulfillSale method
        await fulfillSale(req, res);
        
        // Assert that sequelize.transaction was called 3 times (in addSale test too it was called hence 3)
        expect(sequelizeMock.transaction).toHaveBeenCalledTimes(1);
        // Assert that SAle.findByPk was called once with the correct id
        expect(Sale.findByPk).toHaveBeenCalledWith(req.params.id);
        // Assert that TradeRecord.findByPk was called once with the correct trade record id
        expect(TradeRecord.findByPk).toHaveBeenCalledWith(mockSale.trade_record);
        // Assert that ProductInventory.findOne was called once with the correct parameters
        expect(ProductInventory.findOne).toHaveBeenCalledWith({
            where: {
                product: mockTradeRecord.product,
                warehouse: mockTradeRecord.warehouse,
            }
        });
        // Assert that mockSale.trade_status was updated to "COMPLETED"
        expect(mockSale.trade_status).toBe("COMPLETED");
        // Assert that mockProductInventory.quantity was updated correctly
        expect(mockProductInventory.quantity).toBe(20 - mockTradeRecord.quantity); // 20 is the initial quantity
        // Assert that transaction.commit was called once
        expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
        // Assert that the response status is 201 (Created)
        expect(res.status).toHaveBeenCalledWith(201);
        // Assert that the response JSON is the updated sale object
        expect(res.json).toHaveBeenCalledWith(mockSale);
    });

    it('should handle sale not found', async () => {
        // Mock request parameters
        const req = { params: { id: 1 } };
        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock Sale.findByPk to return null (sale not found)
        Sale.findByPk.mockResolvedValue(null);
        
        // Call the fulfillSale method
        await fulfillSale(req, res);
        
        // Assertions
        // Assert that Sale.findByPk was called once with the correct id
        expect(Sale.findByPk).toHaveBeenCalledWith(req.params.id);
        // Assert that the response status is 404 (Not Found)
        expect(res.status).toHaveBeenCalledWith(404);
        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found.' });
    });

    it('should handle product inventory not found', async () => {
        // Mock request parameters
        const req = { params: { id: 1 } };
        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock Sale.findByPk to return a sale
        const mockSale = { id: 1, trade_record: 1 };
        Sale.findByPk.mockResolvedValue(mockSale);
        // Mock TradeRecord.findByPk to return a trade record
        const mockTradeRecord = { product: 1, warehouse: 1 };
        TradeRecord.findByPk.mockResolvedValue(mockTradeRecord);
        // Mock ProductInventory.findOne to return null (product inventory not found)
        ProductInventory.findOne.mockResolvedValue(null);
        
        // Call the fulfillSale method
        await fulfillSale(req, res);
        
        // Assertions
        // Assert that ProductInventory.findOne was called once with the correct parameters
        expect(ProductInventory.findOne).toHaveBeenCalledWith({
            where: {
                product: mockTradeRecord.product,
                warehouse: mockTradeRecord.warehouse,
            }
        });
        // Assert that the response status is 404 (Not Found)
        expect(res.status).toHaveBeenCalledWith(404);
        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Product inventory not found.' });
    });

    it('should handle errors', async () => {
        // Mock request parameters
        const req = { params: { id: 1 } };
        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Mock Sale.findByPk to throw an error
        Sale.findByPk.mockRejectedValue(new Error('Database error'));
        
        // Call the fulfillSale method
        await fulfillSale(req, res);
        
        // Assertions
        // Assert that the response status is 500 (Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);
        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});