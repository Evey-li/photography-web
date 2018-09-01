const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  exports.auth_cookie_name = 'photography';

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/component/app/assets/img/favicon.ico'))
  };

  exports.view = {
    cache: false
  };

  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      // 告诉 vue-server-renderer 去 app/view 查找异步 chunk 文件
      basedir: path.join(app.baseDir, 'app/view')
    }
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  exports.keys = '123456';
  exports.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [
      'http://localhost:8080'
    ]
  };

  exports.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  exports.middleware = [
    'access'
  ];

  exports.mongoose = {
    url: 'mongodb://127.0.0.1/photography',
    options: {}
  };

  exports.passportLocal = {
    // usernameField: 'username',
    // passwordField: 'password',
  };


  exports.multipart = {
    fileExtensions: [],
  };

  exports.jwt = {
    secret: '123456',
    getToken(ctx) {
      return ctx.get('authorization');
    }
  };

  return exports;
};