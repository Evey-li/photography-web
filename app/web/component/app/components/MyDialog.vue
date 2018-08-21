<template>
  <div class="dialog">
    <div class="dialog-cover"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
      <div class="dialog-content-wrapper">
        <div class="dialog-content">
          <div class="dialog_head" :style="backgroundImgStyle(currentPhoto.imgUrl)">
            <div class="dialog-close" @click="closeMyself">
              <i class="icon-remove"></i>
            </div>
          </div>

          <div class="dialog_main">

            <div class="img-info">
              <div class="title">
                上传时间:
                <span class="upload-time">{{currentPhoto.uploadTime}}</span>
              </div>
              <div class="like-num">
                <i class="icon-heart"></i>
                <span class="num">{{totalLikes}}</span> 喜欢
              </div>
            </div>
            <hr>
            <div class="about-creator">
              <div class="creator">
                <span class="head-img" :style="backgroundImgStyle(currentPhoto.user.headImgUrl)"></span>
                <div class="creator-name">{{currentPhoto.user.userName}}</div>
              </div>
              <div>
                <div class="follow-creator" v-if="!isFollowed" @click="follow(currentPhoto.user._id)">
                  <i class="icon-plus"></i>
                  <span> 关注</span>
                </div>
                <div class="unfollow-creator" v-else @click="unfollow(currentPhoto.user._id)">
                  <i class="icon-minus-sign"></i>
                  <span> 取消关注</span>
                </div>
                <div class="invite-creator" v-if="notInvited" @click="inviteCreator(currentPhoto.user)">
                  <i class="icon-hand-right"></i>
                  <span>发出邀请</span>
                </div>
                <div class="invited" v-else>
                  <i class="icon-ok"></i>
                  <span>已邀请</span>
                </div>
              </div>
            </div>
            <hr>
            <div class="description">
              {{currentPhoto.photoDesc}}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {mapState ,mapMutations} from 'vuex';
import {addFollow} from 'api';
import {removeFollow} from 'api';
import { throws } from 'assert';
/** 弹窗组件*/
export default {
  props: {
    currentPhoto:{},
    totalLikes:0,
    isFollowed:false,
  },
  computed:{
    ...mapState(['user','invitee'])
  },
  data(){
    return{
    // showFollow:true,
    notInvited:true
    }
  },
  methods: {
    ...mapMutations({setInvitee:'SET_INVITEE'}),
    inviteCreator(photoCreator){
      if(this.user.userType === 0){
        this.$toasted.show("只有需求方才能进行邀请哦~")
      }else{
         if(photoCreator._id === this.user._id){
          this.$toasted.show('自己不能邀请自己哦~')
        }else{
          this.closeMyself();
          this.setInvitee(photoCreator);
          
          this.notInvited = false;
          this.$router.push('/creatDemand');
        }
      }
    },
    closeMyself() {
      this.$emit('closeMyself');
    },
     backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    },
   
    follow(followId){
      if(followId === this.user._id){
        this.$toasted.show("自己就不用关注自己咯~")
      }else{
        this.isFollowed = true;
        addFollow(this,{followId:followId,followerId:this.user._id}).then(result => {
          this.$toasted.show('关注成功！');   
         });
      }  
    },
    unfollow(followId){
       this.isFollowed = false;
       removeFollow(this,{followId:followId,followerId:this.user._id}).then(result => {
        this.$toasted.show('已取消关注！');           
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/** 弹窗动画*/
.drop-enter-active {
  // 动画进入过程：0.5s
  transition: all 0.5s ease;
}
.drop-leave-active {
  // 动画离开过程：0.5s
  transition: all 0.3s ease;
}
.drop-enter {
  //动画之前的位置
  transform: translateY(-500px);
}
.drop-leave-active {
  //动画之后的位置
  transform: translateY(-500px);
}
// 最外层 设置position定位
.dialog {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  color: #2e2c2d;
  font-size: 16px;
  overflow-y: scroll;
}
// 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩
.dialog-cover {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.dialog-content-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
}
// 内容层 z-index要比遮罩大，否则会被遮盖，
.dialog-content {
  // border: 1px solid #fff;
  color: #ffffff;
  position: absolute;
  width: 60%;
  top: 5%;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .dialog_head {
    // border: 1px solid #fff;
    background-position: center center;
    width: 80%;
    height: 500px;
    background-size: contain;
    background-repeat: no-repeat;
    .dialog-close {
      position: absolute;
      right: 11%;
      top: 2%;
      font-size: 24px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
  }
  .dialog_main {
    width: 80%;
    font-size: 20px;
    font-family: '宋体';
    hr {
      border-color: rgba(255, 255, 255, 0.2);
    }
    .img-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px 0 10px;

      .title,
      .like-num {
        display: inline;
      }
      .title {
        font-size: 17px;
        .upload-time {
          font-size: 20px;
          &:hover {
            color: #08af7f;
            cursor: pointer;
          }
        }
      }
    }
    .about-creator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .creator {
        display: flex;
        align-items: center;
      }
      .head-img,
      .creator-name,
      .follow-creator,
      .unfollow-creator,
      .invite-creator,
      .invited {
        display: inline;
        padding: 0 10px;
      }
      .follow-creator,
      .unfollow-creator,
      .invite-creator {
        &:hover {
          cursor: pointer;
          color: #08af7f;
        }
      }
      .head-img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: inline-block;
        background-size: contain;
      }
    }
    .description {
      // border-bottom: 1px solid #fff;
      padding: 10px;
    }
  }
}
</style>
