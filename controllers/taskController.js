const { Task } = require("../models/index");

class TaskController {
  static async createTask(req, res, next) {
    try {
      const { title, description, dueDate, time, status, priority, category } =
        req.body;

      const task = await Task.create({
        title,
        description,
        dueDate,
        time,
        status,
        priority,
        category,
        userId: req.loginInfo.userId,
      });

      res.status(201).json({
        message: "Task created successfully",
        data: {
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: await task.categoryInfo,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req, res, next) {
    try {
      const tasks = await Task.find({ userId: req.loginInfo.userId });

      const formattedTasks = await Promise.all(
        tasks.map(async (task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: await task.categoryInfo,
        }))
      );

      res.json({
        message: "Tasks retrieved successfully",
        data: formattedTasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        userId: req.loginInfo.userId,
      });

      if (!task) {
        throw { name: "NotFound" };
      }

      res.json({
        message: "Task retrieved successfully",
        data: {
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: await task.categoryInfo,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { title, description, dueDate, time, status, priority, category } =
        req.body;

      const task = await Task.findOne({
        _id: req.params.id,
        userId: req.loginInfo.userId,
      });

      if (!task) {
        throw { name: "NotFound" };
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.time = time || task.time;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.category = category || task.category;

      await task.save();

      res.json({
        message: "Task updated successfully",
        data: {
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: await task.categoryInfo,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.loginInfo.userId,
      });

      if (!task) {
        throw { name: "NotFound" };
      }

      res.json({
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTasksByCategory(req, res, next) {
    try {
      const tasks = await Task.find({
        userId: req.loginInfo.userId,
        category: req.params.category,
      });

      const formattedTasks = await Promise.all(
        tasks.map(async (task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: await task.categoryInfo,
        }))
      );

      res.json({
        message: "Tasks retrieved successfully",
        data: formattedTasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTasksByStatus(req, res, next) {
    try {
      const tasks = await Task.find({
        userId: req.loginInfo.userId,
        status: req.params.status,
      });

      const formattedTasks = await Promise.all(
        tasks.map(async (task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          time: task.time,
          date: task.formattedDate,
          status: task.status,
          priority: task.priority,
          category: task.categoryInfo,
        }))
      );

      res.json({
        message: "Tasks retrieved successfully",
        data: formattedTasks,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
