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
        // Expected response mush be 200 (healthy)
        expect(response.status).toBe(200);
    });

    // Test listing products
    it('should list all products', async () => {
        const response = await request(baseUrl).get('/products');
        // Expected response mush be 200 (successfully listed)
        expect(response.status).toBe(200);
    });

    // Test getting a product
    it('should get the product with id=1', async () => {
        const response = await request(baseUrl).get('/products/1');
        // Expected response mush be 200 (successfully get)
        expect(response.status).toBe(200);
        // Expected product name must match
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
        // Add new product using POST method, defined in the routes
        const response = await request(app)
            .post('/products')
            .send(newProduct);
        expect(response.status).toBe(201);
        // Returned product name must match with the above
        expect(response.body.name).toBe(newProduct.name);
    });

    // Test updating a product
    it('should update the product with id=1', async () => {
        const productId = '1'; // Replace with an existing product ID
        const updatedProduct = { name: 'Updated Product', purchase_price: 150.99 };
        // Update product using put method as defined in the routes
        const response = await request(app)
            .put(`/products/${productId}`)
            .send(updatedProduct);
        expect(response.status).toBe(200);
        // Updated product name must match with the above
        expect(response.body.name).toBe(updatedProduct.name);
    });

    // Test deleting a product
    it('should delete the product with id=1', async () => {
        const productId = '1'; // Replace with an existing product ID
        // Delete product using delete method as defined in the routes
        const response = await request(app)
            .delete(`/products/${productId}`);
        expect(response.status).toBe(204);
    });
});

afterAll(async () => {
    // Stop the Express server after all tests are done
    await server.close();
});
