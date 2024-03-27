const request = require('supertest');
const { app, server, dbSync } = require('../index');

const baseUrl = "http://localhost:3000";

beforeAll(async () => {
    // Await express server to be ready before running tests
    await dbSync;
    await server;
});

describe('Purchase Routes', () => {
    // Test server is healthy
    it('server must be healthy', async () => {
        const response = await request(baseUrl).get('/health');
        // Expected response mush be 200 (healthy)
        expect(response.status).toBe(200);
    });

    // Test listing purchases
    it('should list all purchases', async () => {
        const response = await request(baseUrl).get('/purchase');
        // Expected response mush be 200 (successfully listed)
        expect(response.status).toBe(200);
    });

    // Test getting a purchase
    it('should get the purchase with id=1', async () => {
        const response = await request(baseUrl).get('/purchase/1');
        // Expected response mush be 200 (successfully get)
        expect(response.status).toBe(200);
        // Expected product name must match
        expect(response.body.name).toBe("Purchase 1");
    });

    // Test adding a purchase
    it('should add a new purchase', async () => {
        const newPurchase = {
            timestamp: Date.now(),
            status: true,
        };
        // Add new purchase using POST method, defined in the routes
        const response = await request(app)
            .post('/purchase')
            .send(newPurchase);
        expect(response.status).toBe(201);
        // Returned purchase timestamp must match with the generated timestamp
        expect(response.body.timestamp).toBe(newPurchase.timestamp);
    });
});

afterAll(async () => {
    // Stop the Express server after all tests are done
    await server.close();
});
