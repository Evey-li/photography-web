const Controller = require('egg').Controller;
const Response = require('../util/response');

class FollowController extends Controller {
  async addFollow() {
    const {
      followId,
      followerId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(followId, followerId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      if (followId !== followerId) {
        const res = await this.ctx.service.follow.save({
          followId: this.app.mongoose.Types.ObjectId(followId),
          followerId: this.app.mongoose.Types.ObjectId(followerId),
          followTime: Date.now()
        });
        result = new Response(Response.SUCCESS, res, null);
      } else {
        result = new Response(Response.SAME_PARAMS, null, '参数值相同');
      }
    }
    this.ctx.body = result;
  }
  async removeFollow() {
    const {
      followId,
      followerId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(followId, followerId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const res = await this.ctx.service.follow.remove(followId, followerId);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async findFollowRecord() {
    const {
      followId,
      followerId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(followId, followerId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      let tmp = '';
      const res = await this.ctx.service.follow.findFollowRecord(followId, followerId);
      if (!res) {
        tmp = false;
      } else {
        tmp = true;
      }
      result = new Response(Response.SUCCESS, tmp, null);
    }
    this.ctx.body = result;
  }
  async getfollowers() {
    const {
      userId
    } = this.ctx.request.body;
    // let uId = this.mongoose
    let result = '';
    if (userId) {
      const res = await this.ctx.service.follow.getfollowers(userId);
      result = new Response(Response.SUCCESS, res, null);
    } else {
      result = new Response(Response.USER_NOT_EXIST, null, '当前未登录');
    }
    this.ctx.body = result;
  }
  async getfollows() {
    const {
      userId
    } = this.ctx.request.body;
    let result = '';
    if (userId) {
      const res = await this.ctx.service.follow.getfollows(userId);
      result = new Response(Response.SUCCESS, res, null);
    } else {
      result = new Response(Response.USER_NOT_EXIST, null, '当前未登录');
    }
    this.ctx.body = result;
  }
}
module.exports = FollowController;