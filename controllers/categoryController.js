const { User, Task } = require("../models/index");

class CategoryController {
  static async addCategory(req, res, next) {
    try {
      const { name, color } = req.body;
      const { userId } = req.loginInfo;

      const user = await User.findById(userId);

      const formattedName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      // Check if category already exists (case insensitive)
      const categoryExists = user.categories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );
      if (categoryExists) {
        throw { name: "BadRequest", message: "Category already exists" };
      }

      user.categories.push({
        name: formattedName,
        color: color || "#" + Math.floor(Math.random() * 16777215).toString(16),
      });

      await user.save();

      res.status(201).json({
        message: "Category added successfully",
        data: user.categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { name, color } = req.body;
      const { userId } = req.loginInfo;
      const { name: paramName } = req.params;

      const user = await User.findById(userId);

      const category = user.categories.find(
        (cat) => cat.name.toLowerCase() === paramName.toLowerCase()
      );
      if (!category) {
        throw { name: "NotFound" };
      }

      // Check if category is being used
      const taskUsingCategory = await Task.findOne({
        userId,
        category: category.name,
      });

      if (
        taskUsingCategory &&
        name &&
        name.toLowerCase() !== category.name.toLowerCase()
      ) {
        throw {
          name: "BadRequest",
          message: "Cannot change name of category that is being used by tasks",
        };
      }

      if (name) {
        category.name =
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }
      if (color) {
        category.color = color;
      }

      await user.save();

      res.json({
        message: "Category updated successfully",
        data: user.categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const { name } = req.params;

      const user = await User.findById(userId);

      const category = user.categories.find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );
      if (!category) {
        throw { name: "NotFound" };
      }

      // Check if category is being used by any active task (not completed)
      const activeTaskUsingCategory = await Task.findOne({
        userId,
        category: category.name,
        status: { $ne: "completed" },
      });

      if (activeTaskUsingCategory) {
        throw {
          name: "BadRequest",
          message: "Cannot delete category that is being used by active tasks",
        };
      }

      // Remove category
      user.categories = user.categories.filter(
        (cat) => cat.name.toLowerCase() !== name.toLowerCase()
      );
      await user.save();

      res.json({
        message: "Category deleted successfully",
        data: user.categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const user = await User.findById(userId);

      res.json({
        message: "Categories retrieved successfully",
        data: user.categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
