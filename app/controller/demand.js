const Controller = require('egg').Controller;
const Response = require('../util/response');
const moment = require('moment');
moment.locale('zh-CN');

class DemandController extends Controller {
  async addDemand() {
    const {
      demand
    } = this.ctx.request.body;
    let result = '';
    if (!demand) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const res = await this.ctx.service.demand.save({
        title: demand.title,
        demanderId: demand.demanderId,
        demandDesc: demand.demandDesc,
        workTime: demand.workTime,
        payment: demand.payment,
        email: demand.email,
        tel: demand.tel,
        creatorId: demand.creatorId,
        preference: demand.preference,
        releaseTime: moment().format('LL'),
        finishTime: '',
        status: '未完成',
        place: demand.place
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async getDemandsNum() {
    let result = '';
    const num = await this.ctx.service.demand.getDemandsNum();
    if (num) {
      result = new Response(Response.SUCCESS, num, null);
    } else {
      result = new Response(Response.NULL_RESULT, '无返回结果');
    }
    this.ctx.body = result;
  }
  async getDemandList() {
    let result = '';
    const {
      condition,
      pageSize,
      currentPage
    } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(condition, pageSize, currentPage)) {
      this.ctx.body = new Response(Response.PARAM_ERROR, null, '参数错误');
      return;
    } else {
      const demandList = await this.ctx.service.demand.getDemandList(condition, pageSize, currentPage);
      if (demandList) {
        result = new Response(Response.SUCCESS, demandList, null);
      } else {
        result = new Response(Response.SERVER_ERROR, null, '服务器错误');
      }
    }
    this.ctx.body = result;
  }
  async getDemandById() {
    let result = '';
    const demandId = this.ctx.request.body.demandId;
    if (!demandId) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const demand = await this.ctx.service.demand.getDemandById(demandId);
      result = new Response(Response.SUCCESS, demand, null);
    }
    this.ctx.body = result;
  }
  async getAllDemandsByUser() {
    let result = '';
    if (!this.ctx.user) {
      result = new Response(Response.USER_NOT_EXIST, null, '用户未登录');
    } else {
      const demands = await this.ctx.service.demand.getAllDemandsByUser(this.ctx.user);
      result = new Response(Response.SUCCESS, demands, null);
    }
    this.ctx.body = result;
  }
}
module.exports = DemandController;