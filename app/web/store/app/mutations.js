'use strict';

import {
  SET_USER,
  USER_LOGOUT,
  SET_GETUSERINFO,
  SET_INVITEE,
  UPLOAD_HEAD_IMG
} from './mutation-type'

const mutations = {

  [SET_USER](state, user) {
    state.user = user;
  },
  [USER_LOGOUT](state) {
    state.user = {};
  },
  //status指需不需要获取用户信息，true/false
  [SET_GETUSERINFO](state, status) {
    state.getUserInfo = status;
  },
  [SET_INVITEE](state, user) {
    state.invitee = user;
  },
  [UPLOAD_HEAD_IMG](state, imgUlr) {
    state.user.headImgUrl = imgUlr;
  }
};
export default mutations