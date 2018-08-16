<template>
    <div class="setting-container">

        <div class="settings-info">
            <div class="wrapper1">
                <div>
                    <img :src="user.headImgUrl" alt="头像">
                    <div class="modify-img" @click="fileClick">点击修改头像</div>
                    <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none" />
                </div>
                <div class="save-btn" @click="saveInfoChange">保存修改</div>
            </div>
            <div class="wrapper2">
                <div>
                    <span>真实姓名：</span><input type="text" name="realName" v-model="user.realName">
                </div>
                <div>
                    <span>用户昵称：</span><input type="text" name="userName" v-model="user.userName">
                </div>
                <div>
                    <span>用户类型：</span>
                    <input type="text" name="userType" v-if='user.userType===0' value="创作人" readonly>
                    <input type="text" name="userType" v-else value="需求人" readonly>
                </div>

            </div>
            <div class="wrapper3">
                <span>个人描述：</span>
                <textarea name="userDesc" id="" cols="74" rows="3" v-model="user.userDesc" />
            </div>
            <div class="wrapper4">
                <div>
                    <span>邮箱地址：</span><input type="text" name="email" v-model="user.email">
                </div>
                <div>
                    <span>联系电话：</span><input type="text" name="tel" v-model="user.tel">
                </div>
            </div>
            <div class="wrapper5">
                <div>
                    <span>来自国家：</span><input type="text" name="country" v-model="user.country">
                </div>
                <div>
                    <span>来自城市：</span><input type="text" name="city" v-model="user.city">
                </div>
            </div>

            <div class="modify-pwd">
                <div class="title">
                    <p>如果你想修改密码：</p>
                    <span class="confirm-btn" @click="resetPassword">重置密码</span>
                </div>
                <div class="content">
                    <div>
                        <span>输入新密码：</span><input type="password" name="password" v-model="newPwd">
                    </div>
                    <div>
                        <span>确认新密码：</span><input type="password" name="confirmPassword" v-model="confirmNewPwd">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script>
import {mapState,mapMutations} from 'vuex';
import {updateUserInfo,uploadAvatar} from 'api';
import { log } from 'util';


export default {
   
 computed:{
    ...mapState(['user']),
  },
  data(){
      return{
        //   imgList: [],
        newImg:{},
        size: 0,
        newPwd:'',
        confirmNewPwd:'',
        
      }
  },
  methods:{
      ...mapMutations({uploadHeadImg:'UPLOAD_HEAD_IMG',userLogout:'USER_LOGOUT'}),
      saveInfoChange(){
          updateUserInfo(this,this.user)
          .then((result) => {
            //   console.log("**************修改信息返回结果：***********");
            //   console.log(result);
              if(result){
                this.$toasted.show('用户个人信息修改成功！');
              }
          });
      },
      fileClick() {
        document.getElementById('upload_file').click()
      },
      fileChange(el) {
        if (!el.target.files[0].size) return;
        //  console.log(this.user._id);
        uploadAvatar(this,el.target.files[0],this.user._id).then(result => {
            // console.log("*******************");
            // console.log(this.user._id);
            this.user.headImgUrl = result.url;
            // console.log(this.user);
        });
        el.target.value = ''
      },
      resetPassword(){
          if(!this.newPwd){
              this.$toasted.show("请输入新密码后进行重置！")
          }else{
              if(!this.confirmNewPwd){
              this.$toasted.show("请输入新密码进行确认！")
              }else{
                  if(this.newPwd !== this.confirmNewPwd){
                    this.$toasted.show("两次密码输入不一致！")
                  }else{
                      this.user.password = this.newPwd;
                      updateUserInfo(this,this.user)
                      .then((result) => {
                         if(result){
                            console.log(result);
                            this.$toasted.show('您的密码已重置，请重新登录！');
                            this.userLogout();
                            localStorage.removeItem("user");
                            this.$router.push('/login');
                        }
                    });
                  }
              }
          }
      }
  }
};
</script>

<style lang="scss">
.setting-container {
  display: flex;
  justify-content: center;
}
.settings-info {
  width: 50%;
  border: 1px solid #444;
  padding: 20px;
  margin: 55px 0;
  input,
  textarea {
    padding-left: 10px;
  }
}
.wrapper1,
.wrapper2,
.wrapper3,
.wrapper4,
.wrapper5 {
  display: flex;
  align-items: center;
  margin: 15px 0;
  div {
    margin: 0 10px;
  }
}
.wrapper1 {
  margin: 10px 0;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .modify-img {
    display: inline-block;
    border: 1px solid #444;
    width: 120px;
    height: 30px;
    &:hover {
      cursor: pointer;
    }
  }
  .save-btn {
    width: 110px;
    height: 40px;
    line-height: 40px;
    margin-right: 20px;
    border-radius: 10px;
    background-color: #08af7f;
    color: #fff;
    &:hover {
      cursor: pointer;
    }
  }
}
.wrapper2 {
  input {
    width: 60%;
  }
}
.wrapper3 {
  margin-left: 10px;
}
.wrapper4,
.wrapper5 {
  div {
    flex: 1;
  }
  input {
    width: 76%;
  }
}
.modify-pwd {
  border: 1px solid #b0b0b0;
  margin-top: 30px;
  border-radius: 10px;
  padding: 20px;
  .title {
    display: flex;
    justify-content: space-between;
    .confirm-btn {
      width: 90px;
      height: 30px;
      border-radius: 5px;
      text-align: center;
      background-color: #08af7f;
      color: #fff;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    div {
      flex: 1;
    }
    input {
      width: 71%;
    }
  }
}
</style>

