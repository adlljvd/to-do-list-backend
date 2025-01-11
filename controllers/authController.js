const { User } = require("../models/index");

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const user = await User.create({ name, email, password, role });
      res.status(201).json({ user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
