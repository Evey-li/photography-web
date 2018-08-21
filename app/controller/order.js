const Controller = require('egg').Controller;
const Response = require('../util/response');
const moment = require('moment');
moment.locale('zh-CN');
class OrderController extends Controller {
  async addOrder() {
    let result = '';
    const {
      demandId,
      creatorId
    } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(demandId, creatorId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const res = await this.ctx.service.order.save({
        demandId,
        creatorId,
        date: moment().format('LL'),
        success: false,
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
}
module.exports = OrderController;