const { Task } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { userId } = req.loginInfo;
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: userId,
    });

    if (!task) {
      throw { name: "NotFound" };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
