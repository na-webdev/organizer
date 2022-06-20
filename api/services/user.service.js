const User = require("../models/user.model");

class UserService {
  async createUser(user) {
    const newUser = new User(user);
    return newUser.save();
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async getUserById(id) {
    return User.findById(id);
  }

  async setUserActive(confirmationToken) {
    return User.findOneAndUpdate(
      { confirmationToken },
      { active: true },
      { new: true }
    );
  }
}

module.exports = new UserService();
