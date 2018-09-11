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
        place: demand.place,
        deleted: false
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
      this.ctx.body = new Response(Response.PARAM_ERROR, null, '需求列表请求参数错误');
      return;
    } else {
      const demandList = await this.ctx.service.demand.getDemandList(condition, pageSize, currentPage);
      console.log(demandList);

      if (demandList) {
        result = new Response(Response.SUCCESS, demandList, null);
      } else {
        result = new Response(Response.SERVER_ERROR, null, '数据库中暂无符合要求的需求');
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
      for (let i = 0; i < demands.length; i++) {
        // 判断该需求对应的作品是否已经上传到数据库的photo表中
        const res = await this.ctx.service.photo.getPhotoByDemandId(demands[i]._id);
        if (res.length === 0) {
          demands[i].hasPhotos = false;
        } else {
          demands[i].hasPhotos = true;
        }
      }
      result = new Response(Response.SUCCESS, demands, null);
    }
    this.ctx.body = result;
  }
  async updateDemand() {
    let result = '';
    const {
      demandId,
      creatorId
    } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(demandId, creatorId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const demand = await this.service.demand.getDemandById(demandId);
      demand.creatorId = creatorId;
      demand.receiveTime = moment().format('LL');
      const res = await this.ctx.service.demand.update(demand);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async checkDemand() {
    let result = '';
    const {
      demandId,
      creatorId
    } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(demandId, creatorId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const res = await this.ctx.service.demand.checkDemand(demandId, creatorId);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async confirmFinish() {
    const demand_id = this.ctx.request.body.demandId;
    const demand = await this.service.demand.getDemandById(demand_id);
    demand.status = '已完成';
    demand.finishTime = moment().format('LL');
    const res = await this.ctx.service.demand.update(demand);
    this.ctx.body = new Response(Response.SUCCESS, res, null);
  }
  async list() {
    let result = '';
    // const userData = [];
    const demands = await this.ctx.service.demand.list();

    result = new Response(Response.SUCCESS, demands, null);
    this.ctx.body = result;
  }
}
module.exports = DemandController;