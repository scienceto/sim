const { listPurchases, getPurchase } = require('../../controller/purchaseController');
const { Purchase, TradeRecord } = require('../../models/models');
const { Op } = require('sequelize');

jest.mock('../../models/models', () => ({
    Purchase: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    TradeRecord: {
        findAll: jest.fn(),
    }
}));

describe('listPurchases', () => {
    it('should return all purchases with their associated trade records', async () => {
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
            status: jest.fn().mockReturnThis(), // Mock the status method of response object
            json: jest.fn() // Mock the json method of response object
        };

        // Call the listPurchases method
        await listPurchases(req, res);

        // Assert that Purchase.findAll was called once
        expect(Purchase.findAll).toHaveBeenCalledTimes(1);

        // Assert that TradeRecord.findAll was called once with the correct where clause
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
            status: jest.fn().mockReturnThis(), // Mock the status method of response object
            json: jest.fn() // Mock the json method of response object
        };

        // Call the listPurchases method
        await listPurchases(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('getPurchase', () => {
    it('should return the purchase with associated trade records', async () => {
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
            status: jest.fn().mockReturnThis(), // Mock the status method of response object
            json: jest.fn() // Mock the json method of response object
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
        // Mock Purchase.findByPk to return null (purchase not found)
        Purchase.findByPk.mockResolvedValue(null);

        // Mock the request and response objects
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the status method of response object
            json: jest.fn() // Mock the json method of response object
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
            status: jest.fn().mockReturnThis(), // Mock the status method of response object
            json: jest.fn() // Mock the json method of response object
        };

        // Call the getPurchase method
        await getPurchase(req, res);

        // Assert that the response status is 500 (Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);

        // Assert that the response JSON contains the error message
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});