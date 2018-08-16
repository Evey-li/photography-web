module.exports = options => {
  return async function authorize(ctx, next) {
    // const success = ctx.cookies.get('login', {
    //   encrypt: true
    // });
    // if (!success)
    //   if (!ctx.user) {
    //     return ctx.redirect('/login');
    //   }
    await next();
  };
};