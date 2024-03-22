// productRoutes.test.js
const request = require('supertest');
const { app, server, dbSync} = require('../index');

const baseUrl = "http://localhost:3000";

beforeAll(async () => {
    // Await express server to be ready before running tests
    await dbSync;
    await server;
});

describe('Product Routes', () => {
    // Test server is healthy
    it('server must be healthy', async () => {
        const response = await request(baseUrl).get('/health');
        expect(response.status).toBe(200);
    });

    // Test listing products
    it('should list all products', async () => {
        const response = await request(baseUrl).get('/products');
        expect(response.status).toBe(200);
    });

    // Test getting a product
    it('should get the product with id=1', async () => {
        const response = await request(baseUrl).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
    });

    // Test adding a product
    it('should add a new product', async () => {
        const newProduct = {
            name:"Test Product 100",
            category:"Cosmetics",
            description:"Lip balm",
            purchase_price:"15",
            sale_price:"20"
        };
        const response = await request(app)
            .post('/products')
            .send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newProduct.name);
    });

    // Test updating a product
    it('should update the product with id=1', async () => {
        const productId = '1'; // Replace with an existing product ID
        const updatedProduct = { name: 'Updated Product', purchase_price: 150.99 };
        const response = await request(app)
            .put(`/products/${productId}`)
            .send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedProduct.name);
    });

    // Test deleting a product
    it('should delete the product with id=1', async () => {
        const productId = '1'; // Replace with an existing product ID
        const response = await request(app)
            .delete(`/products/${productId}`);
        expect(response.status).toBe(204);
    });
});

afterAll(async () => {
    // Stop the Express server after all tests are done
    await server.close();
});
