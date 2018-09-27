const SUCCESS = 0;
const USER_EXIST = 0x10;
const PARAM_ERROR = 0x11;
const PASSWORD_NOT_MATCH = 0x12;
const USER_NOT_LOGIN = 0x13;
const USER_NOT_EXIST = 0x14;
const SERVER_ERROR = 0x15;
const SAME_PARAMS = 0x16;
const SAME_USERNAME = 0x17;
const NULL_RESULT = 0x18;

function getError(code) {
  switch (code) {
    case USER_EXIST:
      return '账户已存在';
    case PARAM_ERROR:
      return '参数错误';
    case PASSWORD_NOT_MATCH:
      return '两次密码不一致';
    case USER_NOT_LOGIN:
      return '用户未登录';
    case USER_NOT_EXIST:
      return '用户不存在';
    case SERVER_ERROR:
      return '服务器错误';
    case SAME_PARAMS:
      return '参数相同';
    case SAME_USERNAME:
      return '已有相同用户名';
    case NULL_RESULT:
      return '无返回结果';
    default:
      return '未知错误';
  }
}

function postRequest(vue, url, data) {
  return new Promise((resolve, reject) => {
    vue.$http
      .post(url, data)
      .then(res => {
        if (res.data.code !== SUCCESS) {
          vue.$toasted.error(getError(res.data.code));
          resolve(null);
          return;
        }
        resolve(res.data.result);
      })
      .catch(error => {
        vue.$toasted.error(error);
      });
  });
}

function filePostRequest(vue, url, formData) {
  return new Promise((resolve, reject) => {
    vue.$http
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        if (res.data.code !== SUCCESS) {
          vue.$toasted.error(getError(res.data.code));
          resolve(null);
          return;
        }
        resolve(res.data.result);
      })
      .catch(error => {
        vue.$toasted.error(error);
      });
  });
}

function getRequest(vue, url) {
  return new Promise((resolve, reject) => {
    vue.$http
      .get(url)
      .then(res => {
        if (res.data.code !== SUCCESS) {
          vue.$toasted.error(getError(res.data.code));
          resolve(null);
          return;
        }
        resolve(res.data.result);
      })
      .catch(error => {
        vue.$toasted.error(error);
      });
  });
}

exports.regist = (vue, data) => {
  return postRequest(vue, '/api/regist', data);
};
exports.logout = vue => {
  return getRequest(vue, '/api/logout');
};
exports.getUserInfo = vue => {
  return getRequest(vue, '/api/userinfo');
};
exports.updateUserInfo = (vue, data) => {
  return postRequest(vue, '/api/updateUserInfo', data);
};
exports.getUserById = (vue, data) => {
  return postRequest(vue, '/api/getUserById', data);
};

exports.getPhotosForIndex = vue => {
  return getRequest(vue, '/api/getPhotosForIndex');
};
exports.getPhotosByCreatorId = (vue, data) => {
  return postRequest(vue, '/api/getPhotosByCreatorId', data);
};
exports.getPhotosNum = (vue, data) => {
  return postRequest(vue, '/api/getPhotosNum', data);
};
exports.uploadPhoto = (vue, data) => {
  return postRequest(vue, '/api/uploadPhoto', data);
};
exports.getPhotoList = (vue, data) => {
  return postRequest(vue, '/api/getPhotoList', data);
};
exports.updatePhotoInfo = (vue, data) => {
  return postRequest(vue, '/api/updatePhotoInfo', data);
};
exports.uploadPhotoList = (vue, data) => {
  return postRequest(vue, '/api/uploadPhotoList', data);
};

exports.addLike = (vue, data) => {
  return postRequest(vue, '/api/addLike', data);
};
exports.removeLike = (vue, data) => {
  return postRequest(vue, '/api/removeLike', data);
};
exports.getLikeRecordsByUserId = (vue, data) => {
  return postRequest(vue, '/api/getLikeRecordsByUserId', data);
};

exports.getRecordsByPId = (vue, data) => {
  return postRequest(vue, '/api/getRecordsByPId', data);
};
exports.addFollow = (vue, data) => {
  return postRequest(vue, '/api/addFollow', data);
};
exports.removeFollow = (vue, data) => {
  return postRequest(vue, '/api/removeFollow', data);
};
exports.findFollowRecord = (vue, data) => {
  return postRequest(vue, '/api/findFollowRecord', data);
};
exports.getfollowers = (vue, data) => {
  return postRequest(vue, '/api/getfollowers', data);
};
exports.getfollows = (vue, data) => {
  return postRequest(vue, '/api/getfollows', data);
};
exports.getSuccesOrders = (vue, data) => {
  return postRequest(vue, '/api/getSuccesOrders', data);
};

exports.getDemandsNum = vue => {
  return getRequest(vue, '/api/getDemandsNum');
};
exports.addDemand = (vue, data) => {
  return postRequest(vue, '/api/addDemand', data);
};
exports.getDemandList = (vue, data) => {
  return postRequest(vue, '/api/getDemandList', data);
};
exports.getDemandById = (vue, data) => {
  return postRequest(vue, '/api/getDemandById', data);
};
exports.getAllDemandsByUser = vue => {
  return getRequest(vue, '/api/getAllDemandsByUser');
};
exports.updateDemand = (vue, data) => {
  return postRequest(vue, '/api/updateDemand', data);
};
exports.checkOrder = (vue, data) => {
  return postRequest(vue, '/api/checkOrder', data);
};


exports.uploadAvatar = (vue, file, userId) => {
  const formData = new FormData();
  formData.append('id', userId);
  formData.append('file', file);
  return filePostRequest(vue, '/api/avatarUpload', formData);
};
exports.uploadFile = (vue, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return filePostRequest(vue, '/api/uploadFile', formData);
};

exports.addCategory = (vue, data) => {
  return postRequest(vue, '/api/addCategory', data);
};
exports.categoryList = vue => {
  return getRequest(vue, '/api/categoryList');
};


exports.addOrder = (vue, data) => {
  return postRequest(vue, '/api/addOrder', data);
};
exports.getOrdersByCreator = (vue) => {
  return getRequest(vue, '/api/getOrdersByCreator');
};
exports.getDemandsOfDemander = (vue) => {
  return getRequest(vue, '/api/getDemandsOfDemander');
};
exports.confirmCreator = (vue, data) => {
  return postRequest(vue, '/api/confirmCreator', data);
};
exports.confirmFinish = (vue, data) => {
  return postRequest(vue, '/api/confirmFinish', data);
};
exports.receiveOrder = (vue, data) => {
  return postRequest(vue, '/api/receiveOrder', data);
};
exports.refuseOrder = (vue, data) => {
  return postRequest(vue, '/api/refuseOrder', data);
};