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
  async getCategory() {
    let result = '';
    const categoryData = [];
    const categories = await this.service.category.getCategoryList();
    if (!categories) {
      result = new Response(Response.NULL_RESULT, null, '类别数据为空！');
    } else {
      for (let i = 0; i < categories.length; i++) {
        const photos = await this.ctx.service.photo.getPhotoByCategoryId(categories[i]._id);
        const imgUrl = [];
        for (let j = 0; j < photos.length; j++) {
          // 判断图片地址是网址类型，还是在public文件夹
          const isHttp = photos[j].imgUrl && photos[j].imgUrl.indexOf('http') !== -1;
          let img = photos[j].imgUrl;
          if (!isHttp) {
            img = `http://127.0.0.1:7001${img}`;
          }
          imgUrl.push(img);
        }
        categoryData.push({ id: categories[i]._id, name: categories[i].name, photos: imgUrl, modify: false });
      }
      result = new Response(Response.SUCCESS, categoryData, null);
    }
    this.ctx.body = result;
  }
  async updateCategoryName() {
    let result = '';
    const data = this.ctx.request.body;
    if (!data) {
      result = new Response(Response.PARAM_ERROR, null, '要修改的信息为空！');
    } else {
      const category = {
        _id: data.id,
        name: data.newName
      };
      await this.ctx.service.category.update(category);
      result = new Response(Response.SUCCESS, category, null);
    }
    this.ctx.body = result;
  }
  async addCategory() {
    const categoryName = this.ctx.request.body.newCategory;

    let result = '';
    if (!categoryName) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const res = await this.ctx.service.category.save({
        name: categoryName,
        deleted: false
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async removeUserById() {
    const id = this.ctx.request.body.id;
    let result = '';
    if (!id) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const user = await this.ctx.service.user.getUserById(id);
      user.deleted = true;
      const res = await this.ctx.service.user.update(user);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async removeDemandById() {
    const id = this.ctx.request.body.id;
    let result = '';
    if (!id) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const demand = await this.ctx.service.demand.getDemandById(id);
      demand.deleted = true;
      const res = await this.ctx.service.demand.update(demand);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async removePhotoById() {
    const id = this.ctx.request.body.id;
    let result = '';
    if (!id) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const photo = await this.ctx.service.photo.getPhotoById(id);
      photo.deleted = true;
      const res = await this.ctx.service.photo.update(photo);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
}
module.exports = AdminController;