module.exports = app => {
  class Like extends app.Service {
    async getRecordsByUserId(u_id) {
      const records = await this.ctx.model.Like.find({
        admirerId: u_id
      });
      return records;
    }
    async save(like) {
      const newLike = new this.ctx.model.Like(like);
      return await newLike.save();
    }
    async remove(pId, uId) {
      return await this.ctx.model.Like.remove({
        photoId: pId,
        admirerId: uId
      });
    }
    async getRecordsByPhotoId(p_id) {
      const records = await this.ctx.model.Like.find({
        photoId: p_id
      });
      return records;
    }
  }
  return Like;
};