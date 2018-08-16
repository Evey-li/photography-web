module.exports = app => {
  class Category extends app.Service {
    async save(category) {
      const newCategory = new this.ctx.model.Category(category);
      await newCategory.save();
    }
    async getCategoryByName(c_name) {
      const category = await this.ctx.model.Category.findOne({
        name: c_name
      });
      return category;
    }
    async removeCategoryById(c_id) {
      const category = await this.ctx.model.Category.findOne({
        _id: c_id
      }, {
        __v: 0
      });
      await category.remove({
        _id: c_id
      });
    }
    async getCategoryList() {
      return await this.ctx.model.Category.find({});
    }
  }
  return Category;
};