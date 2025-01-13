const { User, Task } = require("../models/index");

class TaskController {
  static async createTask(req, res, next) {
    try {
      const { title, description, dueDate, time, status, priority, category } =
        req.body;
      const { userId } = req.loginInfo;

      let categoryName = category;

      if (category) {
        const user = await User.findById(userId);
        const existingCategory = user.categories.find(
          (cat) => cat.name.toLowerCase() === category.toLowerCase()
        );

        if (existingCategory) {
          categoryName = existingCategory.name;
        } else {
          const formattedCategoryName =
            category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

          user.categories.push({
            name: formattedCategoryName,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          });
          await user.save();
          categoryName = formattedCategoryName;
        }
      }

      const task = await Task.create({
        title,
        description,
        dueDate,
        time,
        status,
        priority,
        category: categoryName,
        userId: req.loginInfo.userId,
      });

      const categoryInfo = await task.categoryInfo;

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
          category: categoryInfo,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getTasks(req, res, next) {
    try {
      const { sort, category, status, priority } = req.query;
      const { userId } = req.loginInfo;

      let query = { userId };
      if (category) query.category = category;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      let tasks;
      if (sort === "dueDate") {
        tasks = await Task.find(query).sort({
          dueDate: 1,
          time: 1,
        });
      } else {
        tasks = await Task.find(query);
      }

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
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
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
      const { id } = req.params;
      const { userId } = req.loginInfo;

      const task = await Task.findOne({
        _id: id,
        userId,
      });

      if (!task) {
        throw { name: "NotFound" };
      }

      const categoryInfo = await task.categoryInfo;

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
          category: categoryInfo,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
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
      const { userId } = req.loginInfo;
      const { id } = req.params;

      const task = await Task.findOne({
        _id: id,
        userId,
      });

      if (!task) {
        throw { name: "NotFound" };
      }

      // Jika ada perubahan category
      if (category && category !== task.category) {
        const user = await User.findById(userId);

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

      const categoryInfo = await task.categoryInfo;

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
          category: categoryInfo,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const { id } = req.params;

      const task = await Task.findOneAndDelete({
        _id: id,
        userId,
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
}

module.exports = TaskController;
