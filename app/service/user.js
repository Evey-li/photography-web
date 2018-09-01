module.exports = app => {
  class User extends app.Service {
    async getByUserName(username) {
      const user = await this.ctx.model.User.findOne({
        userName: username
      });
      return user;
    }

    async getUserById(s_id) {
      const user = await this.ctx.model.User.findOne({
        _id: s_id
      }, {
        password: 0,
        __v: 0
      });
      return user;
    }

    async save(user) {
      const newUser = new this.ctx.model.User(user);
      return await newUser.save();
    }

    async getUserList() {
      return await this.ctx.model.User.aggregate([
        {
          $project: {
            password: 0,
            __v: 0
          }
        }
      ]);
    }

    async update(changedUser) {
      const id = changedUser._id;
      delete changedUser._id;
      await this.ctx.model.User.update({
        _id: id
      }, {
        $set: changedUser
      });
    }

    async count() {
      return await this.ctx.model.User.count({});
    }
  }
  return User;
};