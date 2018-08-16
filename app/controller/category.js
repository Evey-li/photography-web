const Controller = require('egg').Controller;
const Response = require('../util/response');

class CategoryController extends Controller {
  async addCategory() {
    const categoryName = this.ctx.request.body.name;

    let result = '';
    if (!categoryName) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const res = await this.ctx.service.category.save({
        name: categoryName
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async removeCategory(cid) {
    this.ctx.body = await this.ctx.service.category.removeCategoryById(cid);
  }
  async categoryList() {
    let result = '';
    const categoryList = await this.ctx.service.category.getCategoryList();
    // console.log(categoryList);

    if (categoryList) {
      result = new Response(Response.SUCCESS, categoryList, null);
    }
    this.ctx.body = result;
  }
}
module.exports = CategoryController;