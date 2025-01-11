const { User, Task } = require("../models/index");

class CategoryController {
  static async addCategory(req, res, next) {
    try {
      const { name, color } = req.body;
      const user = await User.findById(req.loginInfo.userId);

      // Check if category already exists
      const categoryExists = user.categories.some((cat) => cat.name === name);
      if (categoryExists) {
        throw { name: "BadRequest", message: "Category already exists" };
      }

      user.categories.push({
        name,
        color: color || "#" + Math.floor(Math.random() * 16777215).toString(16),
        isDefault: false,
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
      const user = await User.findById(req.loginInfo.userId);

      const category = user.categories.find(
        (cat) => cat.name === req.params.name
      );
      if (!category) {
        throw { name: "NotFound" };
      }

      // Check if category is being used
      const taskUsingCategory = await Task.findOne({
        userId: req.loginInfo.userId,
        category: req.params.name,
      });

      if (taskUsingCategory && name && name !== req.params.name) {
        throw {
          name: "BadRequest",
          message: "Cannot change name of category that is being used by tasks",
        };
      }

      category.name = name || category.name;
      category.color = color || category.color;

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
      const user = await User.findById(req.loginInfo.userId);
      const categoryName = req.params.name;

      const category = user.categories.find((cat) => cat.name === categoryName);
      if (!category) {
        throw { name: "NotFound" };
      }

      // Check if category is being used by any active task (not completed)
      const activeTaskUsingCategory = await Task.findOne({
        userId: req.loginInfo.userId,
        category: categoryName,
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
        (cat) => cat.name !== categoryName
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
      const user = await User.findById(req.loginInfo.userId);

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
