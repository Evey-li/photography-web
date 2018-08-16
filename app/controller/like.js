const Controller = require('egg').Controller;
const Response = require('../util/response');

class LikeController extends Controller {
  async addLike() {
    const {
      photoId,
      admirerId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(photoId, admirerId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const res = await this.ctx.service.like.save({
        photoId: this.app.mongoose.Types.ObjectId(photoId),
        admirerId: this.app.mongoose.Types.ObjectId(admirerId),
        likesTime: Date.now()
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async removeLike() {
    const {
      photoId,
      admirerId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(photoId, admirerId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const res = await this.ctx.service.like.remove(photoId, admirerId);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async getRecordsByPId() {
    const {
      photoId
    } = this.ctx.request.body;
    let result = '';
    if (this.ctx.helper.checkNullOrUndefined(photoId)) {
      result = new Response(Response.PARAM_ERROR, null, '参数错误');
    } else {
      const res = await this.ctx.service.like.getRecordsByPhotoId(photoId);
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
}
module.exports = LikeController;