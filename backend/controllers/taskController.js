const Task = require('../models/Task');

// Create a task
const createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, assignedTo: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Error creating task" });
  }
};

// Get tasks with filters & sorting
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy, order } = req.query;
    let query = { assignedTo: req.user.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    let sort = {};
    if (sortBy) {
      const dir = order === "desc" ? -1 : 1;
      sort[sortBy] = dir;
    } else {
      sort["dueDate"] = 1; // default ascending
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.user.userId });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
