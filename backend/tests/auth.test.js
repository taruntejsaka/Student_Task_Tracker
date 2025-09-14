const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('../server');
const User = require('../models/User');

const TEST_DB = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

beforeAll(async () => {
  await mongoose.connect(TEST_DB, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth endpoints', () => {
  const user = { name: 'Test User', email: 'test@example.com', password: 'Password123' };

  test('Register user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });

  test('Login user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Login fails with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrong' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });
});
