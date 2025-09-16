const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');
const authMiddleware = require('../middleware/auth.js');

// ------------------- GET TASKS -------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, priority, category, search, sortBy, order } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Optional: only fetch tasks for logged-in user
    filter.user = req.user.userId;

    let sort = {};
    if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------- CREATE TASK -------------------
router.post('/', authMiddleware, async (req, res) => {
  try {
    let { title, status, priority, category, dueDate } = req.body;

    // Ensure enums are valid
    const validStatus = ['Pending', 'In Progress', 'Completed'];
    const validPriority = ['Low', 'Medium', 'High'];

    if (!validStatus.includes(status)) status = 'Pending';
    if (!validPriority.includes(priority)) priority = 'Low';

    const task = new Task({
      title,
      status,
      priority,
      category,
      dueDate,
      user: req.user.userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------- UPDATE TASK STATUS -------------------
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['Pending', 'In Progress', 'Completed'];
    if (!validStatus.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------- DELETE TASK -------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
