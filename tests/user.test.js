const request = require('supertest');
const app = require('../app');
const { query, pool } = require('../models/db'); // Ensure pool is exported from db.js

let token;

// Clean up the database before each test
beforeEach(async () => {
    await query('DELETE FROM income');
    await query('DELETE FROM users');

    const registerRes = await request(app).post('/api/users/register').send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
    });

    const loginRes = await request(app).post('/api/users/login').send({
        email: 'testuser@example.com',
        password: 'password123',
    });

    token = loginRes.body.token;
});

// Close the pool connection after all tests
afterAll(async () => {
    await pool.end();
});

describe('User API', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('should authenticate a user', async () => {
        await request(app).post('/api/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get user profile', async () => {
        const registerRes = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        const loginRes = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        const token = loginRes.body.token;

        const profileRes = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(profileRes.statusCode).toEqual(200);
        expect(profileRes.body).toHaveProperty('username', 'testuser');
    });
});
