<template>
  <div>
    <div class="app-head">
      <div class="app-head-inner">

        <router-link to="/index"><img src="../../component/app/assets/logo.png" class="logo"></router-link>
        <div class="head-nav">
          <ul class="nav-list">
            <router-link tag="li" to="/index">首页</router-link>
            <router-link tag="li" to="/gallery">摄影集</router-link>
            <router-link tag="li" to="/demandMarket">需求市场</router-link>
            <router-link tag="li" to="/creatDemand" v-show="user.userType === 1">发布需求</router-link>
            <router-link tag="li" to="/login" v-show="!userExist">登录</router-link>
            <li class="about-user" v-show="userExist">
              <img :src="user.headImgUrl" alt="" class="userImg">
              <div class="dropdown-content">
                <router-link tag="div" :to="{name:'user',params: {id:user._id}}" v-show="user.userType === 0">个人主页</router-link>
                <router-link tag="div" to="/demandMgmt">需求管理</router-link>
                <router-link tag="div" to="/settings">我的设置</router-link>
                <div @click="logout">退出登录</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="app-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div class="app-foot">
      <div class="foot1">
        <a href="#">关于我们</a>
        <a href="#">人才招聘</a>
        <a href="#">商务合作</a>
        <a href="#">常见问题</a>
        <a href="#">意见反馈</a>
        <a href="#">友情链接</a>
      </div>
      <div class="foot2">© 2018 by Evey</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState ,mapMutations} from 'vuex';
import {logout} from 'api';
import { Result } from 'range-parser';
import {getUserInfo} from 'api';

export default {
  created(){
    if(this.getUserInfo){
      getUserInfo(this).then((user)=>{
        if(user !== null){
          this.setUser(user);
          this.setGetUserInfo(false);
          localStorage.setItem("user",JSON.stringify(user));
        }
      });
    }
  },
  computed:{
    ...mapState(['user','getUserInfo']),
    userExist(){
      return this.user._id !== null && this.user._id !== undefined;
    }
  },
  methods:{
    ...mapMutations({setUser:'SET_USER',setGetUserInfo:'SET_GETUSERINFO',userLogout:'USER_LOGOUT'}),
    logout(){
      logout(this).then((result) =>{
        console.log(result);
        this.userLogout();
        localStorage.removeItem("user");
        this.$router.push('/index');
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../component/app/assets/css/bootstrap.min.css';
@import '../../component/app/assets/css/font-awesome.min.css';

blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
a {
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
}
ul {
  list-style: none;
}
body {
  background: #fff;
  font-family: 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB',
    'Hiragino Sans GB W3', 'Microsoft YaHei UI', 'Microsoft YaHei',
    'WenQuanYi Micro Hei', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #444;
}
.app-head {
  background: rgba(37, 43, 51, 1);
  color: #fff;
  height: 60px;
  line-height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 101;
  .app-head-inner {
    margin: 0 auto;
    .logo {
      width: 50px;
      margin-left: 30px;
    }
  }
}

.head-nav {
  float: right;
  ul {
    list-style: none;
    // margin: 0 50px;
    margin-right: 50px;
  }
  li {
    cursor: pointer;
    float: left;
    margin-left: 30px;
    // border: 1px solid black;
    text-align: center;
  }
  .share-photos {
    background-color: #08af7f;
    padding: 8px 35px;
    font-size: 16px;
    color: #fff;
    border-radius: 5px;
  }
  .about-user {
    position: relative;
    .userImg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      display: inline-block;
    }
    .dropdown-content {
      position: absolute;
      display: none;
      background: rgba(37, 43, 51, 1);
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      padding: 5px 10px;
      width: 100px;
      left: -30px;
      // border-radius: 5px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    &:hover {
      .dropdown-content {
        display: block;
        color: #fff;
      }
    }
  }
}

.app-content {
  color: #444;
  margin-top: 60px;
}

.app-foot {
  text-align: center;
  width: 100%;
  background: #dad9d4;
  clear: both;
  padding-top: 20px;
  z-index: 102;
  bottom: 0;
  color: #252b33;
  .foot1 {
    padding: 20px 0px;
    a {
      text-decoration: none;
      margin: 0px 10px;
      color: #444;
    }
  }
  .app-foot .foot2 {
    padding-bottom: 20px;
  }
}
</style>
