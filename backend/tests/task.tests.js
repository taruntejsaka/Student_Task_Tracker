const request = require('supertest');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  const user = { name: 'Tester', email: 'test@demo.com', password: 'Pass1234' };
  await request(app).post('/api/auth/register').send(user);
  const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
  token = res.body.token;

  // seed tasks
  await Task.create([
    { title: "Task1", priority: "High", status: "Pending", category: "Work", dueDate: new Date(), assignedTo: res.body.user.id },
    { title: "Task2", priority: "Low", status: "Completed", category: "Study", dueDate: new Date(), assignedTo: res.body.user.id }
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task filtering", () => {
  test("Filter by status", async () => {
    const res = await request(app).get("/api/tasks?status=Pending").set("Authorization", "Bearer " + token);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("Pending");
  });

  test("Filter by priority", async () => {
    const res = await request(app).get("/api/tasks?priority=Low").set("Authorization", "Bearer " + token);
    expect(res.body[0].priority).toBe("Low");
  });

  test("Search by title", async () => {
    const res = await request(app).get("/api/tasks?search=Task1").set("Authorization", "Bearer " + token);
    expect(res.body[0].title).toBe("Task1");
  });
});
