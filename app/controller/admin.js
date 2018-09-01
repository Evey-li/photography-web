const Controller = require('egg').Controller;
const Response = require('../util/response');

class AdminController extends Controller {
  async addAdmin() {
    let result = '';
    const { adminName, password } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(adminName, password)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const pwdHash = this.ctx.helper.bhash(password);
      const res = this.ctx.service.admin.save({
        adminName,
        password: pwdHash,
        headImgUrl: `http://${this.ctx.request.host}/public/head.jpg`,
      });
      if (res) {
        result = new Response(Response.SUCCESS, res, null);
      }
    }
    this.ctx.body = result;
  }
  async login() {
    let result = '';
    const { adminName, password } = this.ctx.request.body;

    if (this.ctx.helper.checkNullOrUndefined(adminName, password)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const existAdmin = await this.ctx.service.admin.getByAdminName(adminName);
      if (!existAdmin) {
        result = new Response(Response.NULL_RESULT, null, '该管理员账户不存在!');
      } else {
        const passhash = existAdmin.password;
        const equal = this.ctx.helper.bcompare(password, passhash);
        if (!equal) result = new Response(Response.PASSWORD_NOT_MATCH, null, '您的登录密码有误！');
        const token = this.ctx.app.jwt.sign({
          id: existAdmin._id
        }, this.ctx.app.config.jwt.secret, this.ctx.app.config.jwt.option);

        // existAdmin.token = token;
        // console.log(existAdmin.token);
        const admin = { _id: existAdmin._id, adminName: existAdmin.adminName, headImgUrl: existAdmin.headImgUrl };

        result = new Response(Response.SUCCESS, { admin, token }, null);
      }
    }
    this.ctx.body = result;
  }
  async logout() {
    const {
      ctx
    } = this;
    ctx.session = null;
    ctx.logout();
    this.ctx.body = new Response(Response.SUCCESS, null, null);
  }
  async getAdmin() {
    const id = this.ctx.state.user.id;
    let result = '';
    if (!id) {
      result = new Response(Response.PARAM_ERROR, null, '获取不到管理员ID');
    } else {
      const res = await this.ctx.service.admin.getAdminById(id);
      if (!res) {
        result = new Response(Response.NULL_RESULT, null, '该管理员账户不存在！');
      }
      const admin = { _id: res._id, adminName: res.adminName, headImgUrl: res.headImgUrl };
      result = new Response(Response.SUCCESS, admin, null);
    }
    this.ctx.body = result;
  }
  async getInforCardData() {
    let result = '';
    const userNum = await this.ctx.service.user.count();
    const photoNum = await this.ctx.service.photo.count();
    const demandNum = await this.ctx.service.demand.getDemandsNum();
    if (this.ctx.helper.checkNullOrUndefined(userNum, photoNum, demandNum)) {
      result = new Response(Response.NULL_RESULT, null, '数据库查询结果有误！');
    } else {
      const data = { userNum, photoNum, demandNum };
      result = new Response(Response.SUCCESS, data, null);
    }
    this.ctx.body = result;
  }
  async getDemandBySeason() {
    let result = '';
    let firstSeason = 0;
    let secondSeason = 0;
    let thirdSeason = 0;
    let fourthSeason = 0;
    const demands = await this.ctx.service.demand.list();
    if (!demands) {
      result = new Response(Response.NULL_RESULT, null, '暂无需求数据！');
    } else {
      for (let i = 0; i < demands.length; i++) {
        const date = demands[i].releaseTime;
        const month = date[5];
        if (month >= 1 && month <= 3) {
          firstSeason++;
        }
        if (month >= 4 && month <= 6) {
          secondSeason++;
        }
        if (month >= 7 && month <= 9) {
          thirdSeason++;
        }
        if (month >= 10 && month <= 12) {
          fourthSeason++;
        }
      }
      const data = { firstSeason, secondSeason, thirdSeason, fourthSeason };
      result = new Response(Response.SUCCESS, data, null);
    }
    this.ctx.body = result;
  }
}
module.exports = AdminController;