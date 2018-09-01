module.exports = app => {
  class Admin extends app.Service {
    async save(admin) {
      const newAdmin = new this.ctx.model.Admin(admin);
      return await newAdmin.save();
    }
    async getByAdminName(adminName) {
      const admin = await this.ctx.model.Admin.findOne({
        adminName
      });
      return admin;
    }
    async getAdminById(id) {
      const admin = await this.ctx.model.Admin.findOne({
        _id: id
      });
      return admin;
    }
  }
  return Admin;
};