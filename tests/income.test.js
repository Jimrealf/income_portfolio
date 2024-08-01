const request = require('supertest');
const app = require('../app');
const { query, pool } = require('../models/db');

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

describe('Income API', () => {
    it('should add a new income entry', async () => {
        const res = await request(app)
            .post('/api/income')
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 500.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('source', 'Freelance Work');
    });

    it('should get all income entries', async () => {
        await request(app)
            .post('/api/income')
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 500.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        const res = await request(app)
            .get('/api/income')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should get a single income entry', async () => {
        const addRes = await request(app)
            .post('/api/income')
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 500.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        const incomeId = addRes.body.id;

        const res = await request(app)
            .get(`/api/income/${incomeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', incomeId);
    });

    it('should update an income entry', async () => {
        const addRes = await request(app)
            .post('/api/income')
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 500.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        const incomeId = addRes.body.id;

        const res = await request(app)
            .put(`/api/income/${incomeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 600.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('amount', '600.00');
    });

    it('should delete an income entry', async () => {
        const addRes = await request(app)
            .post('/api/income')
            .set('Authorization', `Bearer ${token}`)
            .send({
                source: 'Freelance Work',
                amount: 500.0,
                date: '2024-07-01',
                category: 'Freelance',
            });

        const incomeId = addRes.body.id;

        const res = await request(app)
            .delete(`/api/income/${incomeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty(
            'message',
            'Income deleted successfully'
        );
    });
});
