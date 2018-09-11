<template>
  <div ref="userContent">
    <div class="user-info">
      <div class="black-bg"></div>
      <div class="white-bg"></div>
      <div class="info-container">
        <div class="container-top">
          <div class="showEmail" v-show="emailShow">{{currentUser.email}}</div>
          <div class="email" v-on:mouseover="emailShow=true" v-on:mouseleave="emailShow=false">
            <i class="icon-envelope"></i>
          </div>
          <div class="follow" @click="follow(currentUser._id)" v-if="!isFollowed">
            <i class="icon-plus"></i>
          </div>
          <div class="unfollow" @click="unfollow(currentUser._id)" v-else>
            <i class="icon-ok"></i>
          </div>
        </div>
        <div class="container-main">
          <img :src="currentUser.headImgUrl" alt="">
          <div class="real-name">{{currentUser.realName}}</div>
          <div class="region-info">
            <div>
              <i class="icon-user"></i>
              <span class="user-name">{{currentUser.userName}}</span>
            </div>
            <div v-show="currentUser.country !== '' || currentUser.city !== ''">
              <i class="icon-location-arrow"></i>
              <span class="country">{{currentUser.country}}</span>
              <span class="city">{{currentUser.city}}</span>
            </div>
            <div v-if="currentUser.userType === 0">
              <i class="icon-tag"></i>
              <span class="level">创作人</span>
            </div>
            <div v-else>
              <i class="icon-tag"></i>
              <span class="level">需求人</span>
            </div>
            <div>
              <i class="icon-group"></i>
              <span class="fans">{{fansNum}} </span>粉丝
            </div>
            <div>
              <i class="icon-eye-open"></i>
              <span class="follows">{{followsNum}} </span>关注
            </div>
          </div>
          <div class="invite" v-show="!isOwner">
            <span class="invite-btn">发出邀请</span>
          </div>
          <div class="upload" @click="showUploadDialog" v-show="isOwner">
            <span class="upload-btn">上传作品</span>
          </div>
        </div>
        <div class="container-bottom">
          <div class="user-descr">
            <span v-if="currentUser.userDesc == ''">还没添加任何描述哦......</span>
            <span v-else>{{currentUser.userDesc}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="user-photos">
      <div class="filter">
        <div>
          <span>全部作品 </span>
          <span class="total-photos">11</span>
        </div>
        <div>
          <span>成交作品 </span>
          <span class="total-photos">10</span>
        </div>
        <div>
          <span>赞过作品 </span>
          <span class="total-photos">8</span>
        </div>
      </div>
      <div class="tab-photos">
        <waterfall :min-line-gap="250" :max-line-gap="350" :line-gap="300" :watch="items" :auto-resize="true">
          <!-- each component is wrapped by a waterfall slot -->
          <waterfall-slot :class="{photoBox:true}" v-for="(item, index) in items" :width="item.width" :height="item.height" :order="index" :key="item.id">
            <div class="item" :style="backgroundImgStyle(item.imgUrl)">
            </div>
          </waterfall-slot>
        </waterfall>
      </div>
    </div>
    <upload-dialog v-show="dialogShow" @closeMyself="closeUploadDialog"></upload-dialog>
  </div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall';
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';
import UploadDialog from '../components/UploadDialog';
import { mapState } from 'vuex';
import { getUserById } from 'api';
import { getfollowers, getfollows, findFollowRecord, addFollow, removeFollow } from 'api';
import { getPhotosByCreatorId } from 'api';
import { Result } from 'range-parser';
import { toUnicode } from 'punycode';
import { log } from 'util';


export default {
  created() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.handleCurrentUser(this.id);
      this.findFollowRecord(this.id);
      this.getPhotosByCreatorId(this.id);
    }
  },
  watch: {
    $route(to, from) {
      const tmp = to.path.split('/');
      if (tmp[1] === 'user' && tmp[2]) {
        this.handleCurrentUser(tmp[2]);
        this.findFollowRecord(tmp[2]);
        this.getPhotosByCreatorId(tmp[2]);
      }
    }
  },
  components: {
    Waterfall,
    WaterfallSlot,
    UploadDialog
  },
  data() {
    return {
      dialogShow: false,
      emailShow: false,
      isBusy: false,
      isOwner: true,
      align: 'center',
      items: [],
      currentUser: {},
      fansNum: 0,
      followsNum: 0,
      isFollowed: true
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    getPhotosByCreatorId(id) {
      getPhotosByCreatorId(this, { userId: id }).then(result => {
        // console.log("*********************");
        // console.log(result);
        this.items = result;
      });
    },
    findFollowRecord(currentId) {
      findFollowRecord(this, { followId: currentId, followerId: this.user._id })
        .then(result => {
          this.isFollowed = result;
        });
    },
    handleCurrentUser(currentId) {
      let uId = '';
      if (currentId !== this.user._id) {
        getUserById(this, { id: currentId })
          .then((result) => {
            this.currentUser = result;
          });
        this.isOwner = false;
        uId = currentId;

      } else {
        this.currentUser = this.user;
        this.isOwner = true;
        uId = this.user._id;
      }
      getfollowers(this, { userId: uId })
        .then(result => {
          this.fansNum = result.length;
        });
      getfollows(this, { userId: uId })
        .then(result => {
          this.followsNum = result.length;
        });
    },
    backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    },
    addItems: function() {
      if (!this.isBusy && this.items.length < 500) {
        this.isBusy = true;
        this.items.push.apply(this.items, ItemFactory.get(50));
      }
    },
    shuffle: function() {
      this.items.sort(function() {
        return Math.random() - 0.5;
      });
    },
    reflowed: function() {
      this.isBusy = false;
    },
    showUploadDialog() {
      this.dialogShow = !this.dialogShow;
      this.$refs.userContent.parentNode.parentNode.parentNode.className +=
        'overHid';
    },
    closeUploadDialog() {
      this.dialogShow = false;
      this.$refs.userContent.parentNode.parentNode.parentNode.className = '';
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

<style lang="scss">
.overHid {
  overflow: hidden;
}
.user-info {
  width: 100%;
  .black-bg {
    background: rgba(37, 43, 51, 1);
    height: 300px;
  }
  .white-bg {
    background-color: #fff;
    height: 200px;
  }
  .info-container {
    position: absolute;
    width: 50%;
    top: 15%;
    left: 25%;
  }
  .container-top {
    // border: 1px solid white;
    background: rgba(37, 43, 51, 1);
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .showEmail {
      position: absolute;
      top: 2%;
      left: 7%;
      color: #fff;
    }
    .email,
    .follow,
    .unfollow {
      color: #fff;
      width: 35px;
      height: 35px;
      line-height: 35px;
      border-radius: 50%;
      border: 1px solid #fff;
      font-size: 16px;
      text-align: center;
      margin: 0 10px;
      &:hover {
        cursor: pointer;
        span {
          display: inline;
        }
      }
    }
  }
  .container-main {
    background: rgba(37, 43, 51, 1);
    text-align: center;
    color: #fff;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    .region-info {
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        margin: 0 10px;
      }
    }
    .real-name,
    .region-info,
    .invite,
    .upload {
      margin: 10px 0;
    }
    .invite-btn,
    .upload-btn {
      width: 90px;
      height: 35px;
      line-height: 35px;
      border-radius: 10px;
      display: inline-block;
      border: 1px solid #fff;
      font-size: 14px;
      margin: 10px 0 25px 0;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .container-bottom {
    border: 1px solid #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
    .user-descr {
      height: 60px;
      line-height: 60px;
    }
  }
}
.user-photos {
  width: 80%;
  margin-left: 10%;
  .filter {
    display: flex;
    justify-content: center;
    div {
      margin: 10px 50px;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #444;
      border-radius: 5px;
    }
  }
  .tab-photos {
    // border: 1px solid black;
    margin: 20px 0;
  }
  .photoBox {
    background-size: cover;
    background-repeat: no-repeat;
    transition: ease-in-out 0.5s;
    transform: translate;
  }
  .item {
    background-color: #eee;
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background-repeat: no-repeat;
    background-size: cover;
    color: #ccc;
    font-family: '宋体';
  }
}
</style>

