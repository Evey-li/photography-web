module.exports = app => {
  app.passport.verify(async (ctx, {
    username,
    password
  }) => {
    const existUser = await ctx.service.user.getByUserName(username);
    if (!existUser) {
      return null;
    }

    const passhash = existUser.password;
    const equal = ctx.helper.bcompare(password, passhash);
    // 密码不匹配
    if (!equal) {
      return null;
    }

    // // 用户未激活
    // if (!existUser.active) {
    //     // 发送激活邮件
    //     return null;
    // }
    if (existUser) {
      // id存入Cookie, 用于验证过期.
      const auth_token = existUser._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
      const opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      };
      ctx.cookies.set(app.config.auth_cookie_name, auth_token, opts); // cookie 有效期30天
    }

    // 验证通过

    return existUser;
  });

  app.passport.deserializeUser(async (ctx, user) => {
    if (user) {
      const auth_token = ctx.cookies.get(ctx.app.config.auth_cookie_name, {
        signed: true,
      });

      if (!auth_token) {
        return user;
      }

      const auth = auth_token.split('$$$$');
      const user_id = auth[0];
      user = await ctx.service.user.getUserById(user_id);

      if (!user) {
        return user;
      }
    }

    return user;
  });
};