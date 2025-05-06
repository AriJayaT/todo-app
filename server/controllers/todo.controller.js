// controllers/todo.controller.js
const { Todo } = require('../models');
const { validationResult } = require('express-validator');

// Get all todos for current user
exports.getAllTodos = async (req, res) => {
  try {
    const userId = req.userId; // Set by auth middleware

    // Find all todos for the user
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ todos });
  } catch (error) {
    console.error('Get all todos error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId; // Set by auth middleware
    const { title, description, dueDate, priority } = req.body;

    // Create new todo
    const todo = await Todo.create({
      title,
      description,
      dueDate,
      priority,
      user: userId
    });

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const userId = req.userId; // Set by auth middleware
    const todoId = req.params.id;

    // Validate todoId
    if (!todoId || todoId === 'undefined') {
      return res.status(400).json({ message: 'Invalid todo ID provided' });
    }

    // Find todo by ID and user ID
    const todo = await Todo.findOne({
      _id: todoId,
      user: userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ todo });
  } catch (error) {
    console.error('Get todo by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a todo by ID
exports.updateTodo = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId; // Set by auth middleware
    const todoId = req.params.id;
    
    // Validate todoId is provided and is a valid ObjectId
    if (!todoId || todoId === 'undefined') {
      return res.status(400).json({ message: 'Invalid todo ID provided' });
    }

    const { title, description, completed, dueDate, priority } = req.body;

    // Find todo by ID and user ID
    const todo = await Todo.findOne({
      _id: todoId,
      user: userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update todo
    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.dueDate = dueDate || todo.dueDate;
    todo.priority = priority || todo.priority;

    await todo.save();

    res.status(200).json({
      message: 'Todo updated successfully',
      todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a todo by ID
exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.userId; // Set by auth middleware
    const todoId = req.params.id;

    // Validate todoId
    if (!todoId || todoId === 'undefined') {
      return res.status(400).json({ message: 'Invalid todo ID provided' });
    }

    // Find todo by ID and user ID
    const todo = await Todo.findOne({
      _id: todoId,
      user: userId
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Delete todo
    await Todo.deleteOne({ _id: todoId });

    res.status(200).json({
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};