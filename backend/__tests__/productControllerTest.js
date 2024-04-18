// Importing necessary modules and functions
const { addProduct, deleteProduct, updateProduct, listProducts, getProduct } = require('../controller/productController');
const { Product, ProductInventory, Warehouse, sequelize,} = require('../models/models');

// Mocking the database models
jest.mock('../models/models', () => ({
  Product: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Warehouse: {
    findAll: jest.fn(),
  },
  ProductInventory: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

// Test suite for the Product Controller
describe('Product Controller', () => {
  // Resetting mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test suite for the addProduct method
  describe('addProduct', () => {
    // Test case for adding a new product
    test('should add a new product', async () => {
      // Mocking request and response objects
      const req = {
        body: {
          name: 'Test Product',
          category: 'Test Category',
          description: 'Test Description',
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

      // Mocking the Sequelize models
      Product.create = jest.fn().mockResolvedValueOnce({ id: 1 });
      Warehouse.findAll = jest.fn().mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      ProductInventory.create = jest.fn().mockResolvedValueOnce();

      // Call the controller function
      await addProduct(req, res);

      // Assertions
      expect(sequelize.transaction).toHaveBeenCalledTimes(1);
      expect(Product.create).toHaveBeenCalledTimes(1);
      expect(ProductInventory.create).toHaveBeenCalledTimes(2); // Two warehouses
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
      expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });
  
    // Test case for handling errors when adding a product
    test('should handle errors when adding a product', async () => {
      // Mocking request and response objects
      const req = {
        body: {
          name: 'Test Product',
          category: 'Test Category',
          description: 'Test Description',
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

  
      // // Mocking transaction to throw an error
      // sequelize.transaction.mockRejectedValueOnce(new Error('Transaction error'));
  
      // Calling the addProduct method
      await addProduct(req, res);
  
      // Assertions
      expect(sequelizeMock.transaction).toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add product' });
    });
  });

  // Test suite for the deleteProduct method
  describe('deleteProduct', () => {
    // Resetting mocks after each test
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    // Test case for deleting a product
    test('should delete a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      const mockProduct = { id: 1, destroy: jest.fn() };
      Product.findByPk.mockResolvedValueOnce(mockProduct);
  
      // Calling the deleteProduct method
      await deleteProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  
    // Test case for handling error when deleting a product
    test('should handle error when deleting a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mocking findByPk to return null, indicating product not found
      Product.findByPk.mockResolvedValueOnce(null);
  
      // Calling the deleteProduct method
      await deleteProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  
    // Test case for handling database error when deleting a product
    test('should handle database error when deleting a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const errorMessage = 'Database error';
  
      // Mocking findByPk to throw an error
      Product.findByPk.mockRejectedValueOnce(new Error(errorMessage));
  
      // Calling the deleteProduct method
      await deleteProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete product' });
    });
  });

  // Test suite for the updateProduct method
  describe('updateProduct', () => {
    // Test case for updating a product
    test('should update a product', async () => {
      // Mocking request and response objects
      const req = {
        params: { id: 1 },
        body: {
          name: 'Updated Product Name',
          category: 'Updated Category',
          description: 'Updated Description',
          disabled: false,
        },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const mockProduct = { id: 1, update: jest.fn() };
      Product.findByPk.mockResolvedValueOnce(mockProduct);

      // Calling the updateProduct method
      await updateProduct(req, res);

      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(mockProduct.update).toHaveBeenCalledWith({
        name: 'Updated Product Name',
        category: 'Updated Category',
        description: 'Updated Description',
        disabled: false,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    // Test case for handling error when updating a product
    test('should handle error when updating a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 }, body: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      // Mocking findByPk to return null, indicating product not found
      Product.findByPk.mockResolvedValueOnce(null);
  
      // Calling the updateProduct method
      await updateProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });
  });

  // Test suite for the listProducts method
  describe('listProducts', () => {
    // Test case for listing all products
    test('should list all products', async () => {
      // Mocking request and response objects
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      Product.findAll.mockResolvedValueOnce(mockProducts);

      // Calling the listProducts method
      await listProducts(req, res);

      // Assertions
      expect(Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    // Test case for handling error when listing products
    test('should handle error when listing products', async () => {
      // Mocking request and response objects
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      // Mocking findAll to throw an error
      Product.findAll.mockRejectedValueOnce(new Error('Database error'));
  
      // Calling the listProducts method
      await listProducts(req, res);
  
      // Assertions
      expect(Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
     });
  });

  // Test suite for the getProduct method
  describe('getProduct', () => {
    // Test case for getting a product by id
    test('should get a product by id', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const mockProduct = { id: 1, name: 'Test Product' };
      Product.findByPk.mockResolvedValueOnce(mockProduct);

      // Calling the getProduct method
      await getProduct(req, res);

      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    // Test case for handling error when getting a product
    test('should handle error when getting a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      // Mocking findByPk to return null, indicating product not found
      Product.findByPk.mockResolvedValueOnce(null);
  
      // Calling the getProduct method
      await getProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    // Test case for handling database error when getting a product
    test('should handle database error when getting a product', async () => {
      // Mocking request and response objects
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const errorMessage = 'Database error';
  
      // Mocking findByPk to throw an error
      Product.findByPk.mockRejectedValueOnce(new Error(errorMessage));
  
      // Calling the getProduct method
      await getProduct(req, res);
  
      // Assertions
      expect(Product.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});
