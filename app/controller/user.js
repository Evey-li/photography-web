const Controller = require('egg').Controller;
const Response = require('../util/response');

class UserController extends Controller {
  async login() {
    const id = this.ctx.query.id;
    this.ctx.user = {};
    this.ctx.body = await this.ctx.service.user.getUserById(id);
  }
  async logout() {
    const {
      ctx
    } = this;
    ctx.session = null;
    ctx.logout();
    this.ctx.body = new Response(Response.SUCCESS, null, null);
  }
  async createUser() {
    const {
      userType,
      realName,
      userName,
      password,
      userDesc,
      country,
      city,
      email,
      tel,
      headImgUrl,
      followers,
      follow,
      confirmPassword
    } = this.ctx.request.body;
    if (this.ctx.helper.checkNullOrUndefined(userName, userType, password, confirmPassword)) {
      this.ctx.body = new Response(Response.PARAM_ERROR, null, '参数错误');
      return;
    }
    let result = '';
    const user = await this.ctx.service.user.getByUserName(userName);
    if (user) {
      result = new Response(Response.USER_EXIST, null, '用户已存在');
    } else if (password !== confirmPassword) {
      result = new Response(Response.PASSWORD_NOT_MATCH, null, '两次密码不一致');
    } else {
      const pwdHash = this.ctx.helper.bhash(password);
      const res = await this.ctx.service.user.save({
        userType,
        realName: '',
        userName,
        password: pwdHash,
        userDesc: '',
        country: '',
        city: '',
        email: '',
        tel: '',
        headImgUrl: `http://${this.ctx.request.host}/public/head.jpg`,
        followers: 0,
        follow: 0
      });

      result = new Response(Response.SUCCESS, res._id && res._id !== undefined, null);
    }
    this.ctx.body = result;
  }

  async getUserById() {
    let result = '';
    const userId = this.ctx.request.body.id;
    if (userId) {
      const user = await this.ctx.service.user.getUserById(userId);
      result = new Response(Response.SUCCESS, user, null);
    } else {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    }
    this.ctx.body = result;
  }

  async list() {
    this.ctx.body = await this.ctx.service.user.getUserList();
  }

  async getUserInfo() {
    let result = '';
    if (this.ctx.user) {
      result = new Response(Response.SUCCESS, this.ctx.user, null);
    } else {
      result = new Response(Response.SUCCESS, null, null);
    }
    this.ctx.body = result;
  }

  async updateUserInfo() {
    let result = '';
    const changedUser = this.ctx.request.body;
    if (changedUser) {
      const userInDB = await this.ctx.service.user.getUserById(changedUser._id);
      if (userInDB.userName !== changedUser.userName) {
        const user = await this.ctx.service.user.getByUserName(changedUser.userName);
        if (user) {
          result = new Response(Response.SAME_USERNAME, null, '已有相同用户名！');
        }
      } else {
        if (changedUser.password !== userInDB.password) {
          changedUser.password = this.ctx.helper.bhash(changedUser.password);
        }
        this.ctx.service.user.update(changedUser);
        result = new Response(Response.SUCCESS, changedUser, null);
      }
    } else {
      result = new Response(Response.USER_NOT_EXIST, null, '该用户不存在');
    }
    this.ctx.body = result;
  }
}

module.exports = UserController;