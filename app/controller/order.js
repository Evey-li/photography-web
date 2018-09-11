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
        receiveDate: moment().format('LL'),
        finishDate: '',
        status: '待回复',
        invited: false,
        deleted: false,
      });
      // 同步需求表中的状态
      const demand = { _id: demandId, status: '待回复' };
      await this.ctx.service.demand.update(demand);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async getOrdersByCreator() {
    let result = '';
    const user = this.ctx.user;
    // console.log(this.ctx.user);

    if (!user) {
      result = new Response(Response.USER_NOT_EXIST, null, '请登录创作人账户');
    } else {
      const orders = await this.ctx.service.order.getOrdersByCreator(user);
      const data = [];
      for (let i = 0; i < orders.length; i++) {
        // 查询改需求是否已经上传过对应的照片
        const photo = await this.ctx.service.photo.getPhotoByDemandId(orders[i].demandId);
        if (!photo.length) {
          orders[i].hasPhoto = false;
        } else {
          orders[i].hasPhoto = true;
        }
        // 获取需求人姓名
        const demander = await this.ctx.service.user.getUserById(orders[i].demand.demanderId);
        if (demander) {
          orders[i].demander = demander.realName;
        }
        // 合成前台需要的数据
        data.push({
          demandId: orders[i].demand._id,
          title: orders[i].demand.title,
          demander: orders[i].demander,
          email: orders[i].demand.email,
          payment: orders[i].demand.payment,
          status: orders[i].status,
          receiveDate: orders[i].receiveDate,
          finishDate: orders[i].finishDate,
          invited: orders[i].invited,
          hasPhoto: orders[i].hasPhoto
        });
      }
      result = new Response(Response.SUCCESS, data, null);
    }
    this.ctx.body = result;
  }
  async getDemandsOfDemander() {
    let result = '';
    if (this.ctx.user.userType !== 1) {
      result = new Response(Response.USER_NOT_LOGIN, null, '请登录需求人账户');
    } else {
      const data = [];
      const demands = await this.ctx.service.demand.getAllDemandsByUser(this.ctx.user);
      if (demands) {
        for (let i = 0; i < demands.length; i++) {
          if (demands[i].status === '待接单') {
            data.push({
              demandId: demands[i]._id,
              title: demands[i].title,
              status: demands[i].status,
              receiveDate: '',
              creatorId: '',
              creatorName: '',
              finishDate: '',
              invited: false
            });
          }
        }
      }
      const orders = await this.ctx.service.order.getOrderByDemander(this.ctx.user);
      if (orders) {
        for (let i = 0; i < orders.length; i++) {
          data.push({
            orderId: orders[i]._id,
            demandId: orders[i].demandId,
            title: orders[i].demand.title,
            status: orders[i].status,
            creatorId: orders[i].creatorId,
            creatorName: (await this.ctx.service.user.getUserById(orders[i].creatorId)).userName,
            finishDate: orders[i].finishDate,
            invited: orders[i].invited
          });
        }
      }
      result = new Response(Response.SUCCESS, data, null);
    }
    this.ctx.body = result;
  }
  async confirmCreator() {
    const { orderId } = this.ctx.request.body;
    let result = '';
    if (!orderId) {
      result = new Response(Response.PARAM_ERROR, null, '订单ID为空');
    } else {
      // 更新订单表状态
      const order = await this.ctx.service.order.getOrderById(orderId);
      order.status = '创作中';
      await this.ctx.service.order.update(order);
      // 处理其他同属一个需求的订单状态
      const sameDemandOrders = await this.ctx.service.order.getOrdersByDemandId(order.demandId);
      for (let i = 0; i < sameDemandOrders.length; i++) {
        if (sameDemandOrders[i].status === '待回复') {
          sameDemandOrders[i].status = '订单关闭';
          await this.ctx.service.order.update(sameDemandOrders[i]);
        }
      }
      // 更新需求表状态
      const demand = await this.ctx.service.demand.getDemandById(order.demandId);
      demand.status = '创作中';
      await this.ctx.service.demand.update(demand);
      result = new Response(Response.SUCCESS, 'success', null);
    }
    this.ctx.body = result;
  }
}
module.exports = OrderController;