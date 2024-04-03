const request = require('supertest');
const { app, server, dbSync } = require('../../index');

const baseUrl = "http://localhost:3000";

beforeAll(async () => {
    // Await express server to be ready before running tests
    await dbSync;
    await server;
});

describe('Sale Routes', () => {
    // Test server is healthy
    it('server must be healthy', async () => {
        const response = await request(baseUrl).get('/health');
        // Expected response mush be 200 (healthy)
        expect(response.status).toBe(200);
    });

    // Test listing sales
    it('should list all sales', async () => {
        const response = await request(baseUrl).get('/sales');
        // Expected response mush be 200 (successfully listed)
        expect(response.status).toBe(200);
    });

    // Test getting a sale
    it('should get the sale with id=1', async () => {
        const response = await request(baseUrl).get('/sales/1');
        // Expected response mush be 200 (successfully get)
        expect(response.status).toBe(200);
        // Expected product name must match
        expect(response.body.id).toBe(1);
    });

    // Test adding a purchase
    it('should add a new sale', async () => {
        const newSale = {
            customer: 1,
            warehouse: 1,
            product: 2,
            quantity: 5,
            price: 400
        };
        // Add new sale using POST method, defined in the routes
        const response = await request(app)
            .post('/sales')
            .send(newSale);
        expect(response.status).toBe(201);
        // Returned sale timestamp must match with the generated timestamp
        // expect(response.body.timestamp).toBe(newSale.timestamp);
    });
});

afterAll(async () => {
    // Stop the Express server after all tests are done
    await server.close();
});
