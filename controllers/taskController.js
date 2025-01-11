const { User, Task } = require("../models/index");

class TaskController {
  static async createTask(req, res, next) {
    try {
      const { title, description, dueDate, time, status, priority, category } =
        req.body;

      // Check and create category if not exists
      if (category) {
        const user = await User.findById(req.loginInfo.userId);
        const categoryExists = user.categories.some(
          (cat) => cat.name === category
        );

        if (!categoryExists) {
          user.categories.push({
            name: category,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            isDefault: false,
          });
          await user.save();
        }
      }

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
          category: task.categoryInfo,
        },
      });
    } catch (error) {
      console.log(error);
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
          category: task.categoryInfo,
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

      // Jika ada perubahan category
      if (category && category !== task.category) {
        const user = await User.findById(req.loginInfo.userId);

        // Check if category exists
        const categoryExists = user.categories.some(
          (cat) => cat.name === category
        );

        // Jika category belum ada, create new
        if (!categoryExists) {
          user.categories.push({
            name: category,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            isDefault: false,
          });
          await user.save();
        }
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
          category: task.categoryInfo,
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

  static async getTasksByPriority(req, res, next) {
    try {
      const tasks = await Task.find({
        userId: req.loginInfo.userId,
        priority: req.params.priority,
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
