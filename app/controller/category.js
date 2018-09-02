const Controller = require('egg').Controller;
const Response = require('../util/response');

class CategoryController extends Controller {

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