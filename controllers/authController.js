const { User } = require("../models/index");
const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

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
      const { email, password } = req.body;
      console.log(req.body);

      if (!email || !password) {
        throw { name: "BadRequest" };
      }

      const user = await User.findOne({ email });

      console.log(user);
      if (!user) {
        throw { name: "LoginError" };
      }

      if (!compare(password, user.password)) {
        throw { name: "LoginError" };
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = signToken(payload);

      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      res.status(200).json(req.loginInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
