const Response = require('../util/response');
module.exports = options => {
  return async (ctx, next) => {
    const { username } = ctx.request.body;
    const existUser = await ctx.service.user.getByUserName(username);
    if (existUser && existUser.userType === -1) {
      await next();
    } else {
      ctx.body = new Response(Response.NULL_RESULT, null, '该授权管理员不存在');
    }
  };
};