<template>
  <div class="log_container">

    <div id="login_box" v-show="isShow">
      <h3>欢迎登录</h3>
      <form action="/api/login" method="post">
        <div class="input_outer">
          <i class="icon-user"></i>
          <input type="text" name="username" id="log_name" placeholder="请输入账户">
        </div>
        <div class="input_outer">
          <i class="icon-lock"></i>
          <input type="password" name="password" id="log_password" placeholder="请输入密码">
        </div>

        <div class="login">
          <input type="submit" class="btn btn-success" value="立即登录" @click="login" />
        </div>
      </form>
      <div class="to-register" @click="toRegister">
        <a id="reg">还没有账户？立即注册
          <i class="icon-double-angle-right"></i>
        </a>
      </div>
    </div>

    <div id="register_box" v-show="!isShow">
      <h3>欢迎注册</h3>
      <!-- <form action="/api/regist" ref="regist" method="post"> -->
      <div class="input_outer">
        <i class="icon-user"></i>
        <input type="text" name="userName" v-model="registData.userName" id="reg_name" placeholder="请输入账户">
      </div>
      <div class="input_outer">
        <i class="icon-lock"></i>
        <input type="password" name="password" id="reg_password" v-model="registData.password" placeholder="请输入密码">
      </div>
      <div class="input_outer">
        <i class="icon-ok-circle"></i>
        <input type="password" name="comfirmPassword" id="confirm_password" v-model="registData.confirmPassword" placeholder="请确认密码">
      </div>
      <div class="select_user_type">
        <label @click="asCreator">
          <i class="icon-check-empty" v-show="!selected"></i>
          <i class="icon-check" v-show="selected"></i>
          <span>创作人</span>
        </label>
        <label @click="asDemander">
          <i class="icon-check-empty" v-show="selected"></i>
          <i class="icon-check" v-show="!selected"></i>
          <span>需求人</span>
        </label>
      </div>

      <div class="register">
        <input type="button" @click="postRegistData" class="btn btn-success" value="立即注册" />
      </div>
      <input type="hidden" v-model="registData.userType" name="usertype" />
      <!-- </form> -->
      <div class="to-login" @click="toLogin">
        <a id="log">已有账户？立即登录
          <i class="icon-double-angle-right"></i>
        </a>
      </div>
    </div>

  </div>
</template>
<script>
import {regist} from 'api';
import {mapMutations} from 'vuex';
import { throws } from 'assert';

export default {
  data() {
    return {
      registData:{
        userName:'',
        password:'',
        confirmPassword:'',
        userType:0
      },
      isShow: true,
      selected: true,
    };
  },
  created(){
    this.setGetUserInfo(false);
  },
  methods: {
    ...mapMutations({setGetUserInfo:'SET_GETUSERINFO'}),
    login(){
      this.setGetUserInfo(true);
    },
    postRegistData(){
      if(this.registData.password === this.registData.confirmPassword){
         regist(this,this.registData)
         .then((result)=>{
          //  console.log(result);
          this.$toasted.show('注册成功！可以登录啦!')
          this.isShow = !this.isShow;
         });
      }
      else{
        this.$toasted.show('两次输入密码不一致')
      }
    },
    toRegister() {
      this.isShow = !this.isShow;
    },
    toLogin() {
      this.isShow = !this.isShow;
    },
    asCreator() {
      this.selected = !this.selected;
      if (this.registData.userType == 1) {
        this.registData.userType = 0;
      } else {
        this.registData.userType = 1;
      }
      console.log(this.registData.userType);
    },
    asDemander() {
      this.selected = !this.selected;
      if (this.registData.userType == 0) {
        this.registData.userType = 1;
      } else {
        this.registData.userType = 0;
      }
      console.log(this.registData.userType);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scope>
$input_height: 46px;

.log_container {
  height: 720px;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  background-image: url('../assets/img/login_bg.jpg');
  background-position: 20% 70%;
}
#login_box,
#register_box {
  width: 400px;
  padding: 35px;
  color: #444;
  text-align: center;
  z-index: 1;
  margin-top: 5%;

  h3 {
    color: #fff;
    margin: 20px 0;
  }
  .input_outer {
    display: flex;
    height: $input_height;
    line-height: $input_height;
    margin-bottom: 20px;
    border-radius: 50px;
    padding: 0;
    border: rgba(255, 255, 255, 0.2) 2px solid !important;
    i {
      flex: 1;
      height: $input_height;
      line-height: $input_height;
      color: white;
      font-size: 25px;
    }
  }
  .select_user_type {
    color: #fff;
    margin-bottom: 15px;
    text-align: center;
    label {
      margin: 0 20px;
      span {
        margin-left: 2px;
      }
    }
  }
  .to-register,
  .to-login {
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin: 20px 0;
  }
}
#reg:hover,
#log:hover {
  text-decoration: none;
  color: #08af7f;
  cursor: pointer;
}
#log_name,
#log_password,
#reg_name,
#reg_password,
#confirm_password {
  flex: 4;
  background-color: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 17px;
}
#login_box .login input,
#register_box .register input {
  background: #08af7f;
  border-color: #08af7f;
  width: 330px;
  height: 46px;
  border-radius: 50px;
  padding: 10px 0;
  color: white;
}
</style>

