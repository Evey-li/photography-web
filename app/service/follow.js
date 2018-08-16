module.exports = app => {
  class Follow extends app.Service {
    async save(follow) {
      const newFollow = new this.ctx.model.Follow(follow);
      return await newFollow.save();
    }
    async remove(followId, followerId) {
      return await this.ctx.model.Follow.remove({
        followId,
        followerId
      });
    }
    async findFollowRecord(followId, followerId) {
      return await this.ctx.model.Follow.findOne({
        followId,
        followerId
      });
    }
    // 获取关注列表
    async getfollows(userId) {
      return await this.ctx.model.Follow.find({
        followerId: userId
      });
    }
    // 获取粉丝列表
    async getfollowers(userId) {
      return await this.ctx.model.Follow.find({
        followId: userId
      });
    }
  }
  return Follow;
};