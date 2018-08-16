module.exports = app => {
  const localStrategy = app.passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login',
  });

  app.post('/api/login', localStrategy);
  app.post('/api/regist', app.controller.user.createUser);
  app.all('/api/logout', app.controller.user.logout);
  app.get('/api/userinfo', app.controller.user.getUserInfo);
  app.post('/api/getUserById', app.controller.user.getUserById);
  app.post('/api/updateUserInfo', app.controller.user.updateUserInfo);
  app.get('/api/list', app.controller.user.list);

  app.post('/api/getPhotosNum', app.controller.photo.getPhotosNum);
  app.post('/api/getPhotoList', app.controller.photo.getPhotoList);
  app.post('/api/updatePhotoInfo', app.controller.photo.updatePhotoInfo);
  app.post('/api/uploadPhoto', app.controller.photo.uploadPhoto);

  app.post('/api/addLike', app.controller.like.addLike);
  app.post('/api/removeLike', app.controller.like.removeLike);
  app.post('/api/getRecordsByPId', app.controller.like.getRecordsByPId);

  app.post('/api/addFollow', app.controller.follow.addFollow);
  app.post('/api/removeFollow', app.controller.follow.removeFollow);
  app.post('/api/findFollowRecord', app.controller.follow.findFollowRecord);
  app.post('/api/getfollowers', app.controller.follow.getfollowers);
  app.post('/api/getfollows', app.controller.follow.getfollows);

  app.get('/api/getDemandsNum', app.controller.demand.getDemandsNum);
  app.post('/api/addDemand', app.controller.demand.addDemand);
  app.post('/api/getDemandList', app.controller.demand.getDemandList);
  app.post('/api/getDemandById', app.controller.demand.getDemandById);
  app.get('/api/getAllDemandsByUser', app.controller.demand.getAllDemandsByUser);

  app.post('/api/avatarUpload', app.controller.file.uploadAvatar);
  app.post('/api/uploadFile', app.controller.file.uploadFile);

  app.post('/api/addCategory', app.controller.category.addCategory);
  app.get('/api/categoryList', app.controller.category.categoryList);

  app.get('/*', app.controller.app.index);
};