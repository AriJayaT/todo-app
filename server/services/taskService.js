// services/taskService.js
const { Task } = require('../db/models');
const { Op } = require('sequelize');

/**
 * Service to handle all task-related operations using Sequelize ORM
 * This replaces the Firebase Firestore implementation in useTasks.js
 */
class TaskService {
  /**
   * Get all tasks for a specific user
   * @param {string} userId - The Firebase UID of the user
   * @returns {Promise<Array>} - Promise resolving to array of tasks
   */
  static async getTasks(userId) {
    try {
      const tasks = await Task.findAll({
        where: {
          user_id: userId
        },
        order: [['created_at', 'DESC']] // Sort by created_at in descending order (newest first)
      });
      
      return tasks.map(task => task.toJSON());
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Add a new task for a user
   * @param {string} userId - The Firebase UID of the user
   * @param {string} text - The task description
   * @returns {Promise<Object>} - Promise resolving to the created task
   */
  static async addTask(userId, text) {
    try {
      const task = await Task.create({
        text,
        completed: false,
        user_id: userId
      });
      
      return task.toJSON();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  /**
   * Delete a task by ID
   * @param {number} taskId - The ID of the task to delete
   * @param {string} userId - The Firebase UID of the user (for security verification)
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  static async deleteTask(taskId, userId) {
    try {
      const deleted = await Task.destroy({
        where: {
          id: taskId,
          user_id: userId
        }
      });
      
      return deleted > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Toggle the completion status of a task
   * @param {number} taskId - The ID of the task to toggle
   * @param {string} userId - The Firebase UID of the user (for security verification)
   * @returns {Promise<Object|null>} - Promise resolving to the updated task or null if not found
   */
  static async toggleTask(taskId, userId) {
    try {
      // First find the task to get current completion status
      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: userId
        }
      });
      
      if (!task) return null;
      
      // Toggle the completion status
      task.completed = !task.completed;
      await task.save();
      
      return task.toJSON();
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  }

  /**
   * Update the text of a task
   * @param {number} taskId - The ID of the task to update
   * @param {string} newText - The new text for the task
   * @param {string} userId - The Firebase UID of the user (for security verification)
   * @returns {Promise<Object|null>} - Promise resolving to the updated task or null if not found
   */
  static async updateTask(taskId, newText, userId) {
    try {
      const [updated, tasks] = await Task.update(
        { text: newText },
        {
          where: {
            id: taskId,
            user_id: userId
          },
          returning: true // Return the updated record
        }
      );
      
      if (updated === 0) return null;
      
      // For databases that don't support returning (like MySQL)
      // we need to fetch the updated task
      const task = await Task.findOne({
        where: {
          id: taskId,
          user_id: userId
        }
      });
      
      return task ? task.toJSON() : null;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Get tasks filtered by completion status
   * @param {string} userId - The Firebase UID of the user
   * @param {boolean} completed - Filter by completion status
   * @returns {Promise<Array>} - Promise resolving to filtered array of tasks
   */
  static async getFilteredTasks(userId, completed) {
    try {
      const tasks = await Task.findAll({
        where: {
          user_id: userId,
          completed
        },
        order: [['created_at', 'DESC']]
      });
      
      return tasks.map(task => task.toJSON());
    } catch (error) {
      console.error('Error fetching filtered tasks:', error);
      throw error;
    }
  }
}

module.exports = TaskService;