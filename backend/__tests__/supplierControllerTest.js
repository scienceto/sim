const { listSuppliers, getSupplier, addSupplier, updateSupplier } = require('../controller/supplierController');
const { Supplier } = require('../models/models');

// Mocking the response object
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe('listSuppliers', () => {
    it('should return a list of suppliers', async () => {
        const mockSuppliers = [{ id: 1, name: 'Supplier A' }, { id: 2, name: 'Supplier B' }];
        Supplier.findAll = jest.fn().mockResolvedValue(mockSuppliers);
        
        await listSuppliers({}, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSuppliers);
    });

    it('should handle errors', async () => {
        const errorMessage = 'Failed to fetch suppliers';
        Supplier.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));
        
        await listSuppliers({}, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('getSupplier', () => {
    it('should return a supplier by id', async () => {
        const mockSupplier = { id: 1, name: 'Supplier A' };
        const req = { params: { id: 1 } };
        Supplier.findByPk = jest.fn().mockResolvedValue(mockSupplier);
        
        await getSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSupplier);
    });

    it('should handle supplier not found', async () => {
        const req = { params: { id: 999 } };
        Supplier.findByPk = jest.fn().mockResolvedValue(null);
        
        await getSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Supplier not found.' });
    });

    it('should handle errors', async () => {
        const errorMessage = 'Failed to fetch supplier';
        const req = { params: { id: 1 } };
        Supplier.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));
        
        await getSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('addSupplier', () => {
    it('should add a new supplier', async () => {
        const req = { body: { name: 'Supplier A', address: '123 Street', contact_email: 'supplier@example.com', metadata: {} } };
        const mockNewSupplier = { id: 1, ...req.body };
        Supplier.create = jest.fn().mockResolvedValue(mockNewSupplier);
        
        await addSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockNewSupplier);
    });

    it('should handle errors', async () => {
        const errorMessage = 'Failed to add supplier';
        const req = { body: { name: 'Supplier A', address: '123 Street', contact_email: 'supplier@example.com', metadata: {} } };
        Supplier.create = jest.fn().mockRejectedValue(new Error(errorMessage));
        
        await addSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});

describe('updateSupplier', () => {
    it('should update an existing supplier', async () => {
        const req = { params: { id: 1 }, body: { name: 'Supplier A', address: '123 Street', contact_email: 'supplier@example.com', metadata: {} } };
        const mockUpdatedSupplier = { id: 1, ...req.body };
        const mockSupplierInstance = { update: jest.fn().mockResolvedValue(mockUpdatedSupplier) };
        Supplier.findByPk = jest.fn().mockResolvedValue(mockSupplierInstance);
        
        await updateSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedSupplier);
    });

    it('should handle supplier not found', async () => {
        const req = { params: { id: 999 }, body: { name: 'Supplier A', address: '123 Street', contact_email: 'supplier@example.com', metadata: {} } };
        Supplier.findByPk = jest.fn().mockResolvedValue(null);
        
        await updateSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Supplier not found.' });
    });

    it('should handle errors', async () => {
        const errorMessage = 'Failed to update supplier';
        const req = { params: { id: 1 }, body: { name: 'Supplier A', address: '123 Street', contact_email: 'supplier@example.com', metadata: {} } };
        const mockSupplierInstance = { update: jest.fn().mockRejectedValue(new Error(errorMessage)) };
        Supplier.findByPk = jest.fn().mockResolvedValue(mockSupplierInstance);
        
        await updateSupplier(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});
