<template>
  <div ref="content">
    <div class="gallery-header">
      <h2>The Photo Gallery</h2>
      <div :class="{focus:inputFocus}" class="search-box">
        <input @blur="inputFocus=false" @focus="inputFocus=true" @keyup.enter="searchPhoto" v-model="searchKey" type="text" placeholder="发现你感兴趣的作品">
        <span class="search-btn">
          <i class="icon-search"></i>
        </span>
      </div>
    </div>

    <div id="photos">
      <waterfall :min-line-gap="250" :max-line-gap="350" :line-gap="300" :watch="items" :auto-resize="true">
        <!-- each component is wrapped by a waterfall slot -->
        <waterfall-slot :class="{box:true}" v-for="(item, index) in items" :width="item.width" :height="item.height" :order="index" :key="item.id">

          <div class="item" :style="backgroundImgStyle(item.imgUrl)">
            <div class="item-container">
              <div class="item-top">
                优质佳作
              </div>
              <div class="item-mid" @click="showDialog(item)"></div>
              <div class="item-bottom">
                <router-link :to="{name:'user',params: {id:item.user._id}}">
                  <span :style="backgroundImgStyle(item.user.headImgUrl)" class="head-img"></span>
                </router-link>
                <span class="creator-name">{{item.user.userName}}</span>

                <span class="like" @click="onLike(index)">
                  <i class="icon-heart-empty" v-show="!item.likeStatus"></i>
                  <i class="icon-heart" v-show="item.likeStatus"></i>
                </span>
              </div>
            </div>
          </div>

        </waterfall-slot>
      </waterfall>
    </div>

    <div class="pagination">
      <pagination :count="totalPages" @onItemClick="onPageItemClick"></pagination>
    </div>
    <my-dialog v-show="dialogShow" @closeMyself="closeDialog" :currentPhoto="currentPhoto" :totalLikes="totalLikes" :isFollowed="isFollowed"></my-dialog>

  </div>
</template>
<script>
import Waterfall from 'vue-waterfall/lib/waterfall';
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';
import Pagination from '../components/Pagination';
import MyDialog from '../components/MyDialog';
import { mapState } from 'vuex';
import { getPhotoList, getPhotosNum } from 'api';
import { addLike, removeLike } from 'api';
import { getRecordsByPId, findFollowRecord } from 'api';
import { log } from 'util';


export default {
  data() {
    return {
      searchKey: '',
      align: 'center',
      items: [],
      currentUserLikeRecords: [],
      isBusy: false,
      inputFocus: false,
      dialogShow: false,
      currentPhoto: { user: {} },
      totalLikes: 0,
      isFollowed: false,
      totalPages: 0,
      pageSize: 12
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    getPhotosNum(this, { searchKey: '' }).then(result => {
      if (result) {
        this.totalPages = Math.ceil(result / this.pageSize);
      }
    });
    getPhotoList(this, { searchKey: '', pageSize: this.pageSize, currentPage: 1 }).then(result => {
      if (result) {
        this.items = result;
      }
    });
  },
  components: {
    Waterfall,
    WaterfallSlot,
    Pagination,
    MyDialog
  },
  methods: {
    searchPhoto() {
      if (this.searchKey) {
        getPhotosNum(this, { searchKey: this.searchKey }).then(result => {
          this.totalPages = Math.ceil(result / this.pageSize);
        });
        getPhotoList(this, { searchKey: this.searchKey, pageSize: this.pageSize, currentPage: 1 }).then(result => {
          this.items = result;
        });
      }
    },
    backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    },
    onPageItemClick(page) {
      if (!this.searchKey) {
        getPhotoList(this, { searchKey: '', pageSize: this.pageSize, currentPage: page }).then(result => {
          this.items = result;
        });
      } else {
        getPhotoList(this, { searchKey: this.searchKey, pageSize: this.pageSize, currentPage: page }).then(result => {
          this.items = result;
        });
      }
    },
    addItems() {
      if (!this.isBusy && this.items.length < 500) {
        this.isBusy = true;
        this.items.push.apply(this.items, ItemFactory.get(50));
      }
    },
    shuffle() {
      this.items.sort(function () {
        return Math.random() - 0.5;
      });
    },
    reflowed() {
      this.isBusy = false;
    },
    onLike(index) {
      if (!this.user._id) {
        this.$router.push('/login');
        this.$toasted.show('您还没登录！登录了再点赞也不晚哦~')
      }

      let photo = this.items[index];
      photo.likeStatus = !photo.likeStatus;
      if (photo.likeStatus === true) {
        addLike(this, { photoId: photo._id, admirerId: this.user._id }).then(result => {
          console.log('added!');
        });
      }
      if (photo.likeStatus === false) {
        removeLike(this, { photoId: photo._id, admirerId: this.user._id }).then(result => {
          console.log('removed!');
        })
      }
    },
    showDialog(item) {
      getRecordsByPId(this, { photoId: item._id }).then(result => {
        this.totalLikes = result.length;
      });
      this.currentPhoto = item;

      if (this.user._id) {
        findFollowRecord(this, { followId: item.creatorId, followerId: this.user._id })
          .then(result => {
            this.isFollowed = result;
          });
      }
      this.dialogShow = !this.dialogShow;
      this.$refs.content.parentNode.parentNode.parentNode.className +=
        'overHid';
    },
    closeDialog() {
      this.dialogShow = false;
      this.$refs.content.parentNode.parentNode.parentNode.className = '';
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.overHid {
  overflow: hidden;
}
.gallery-header {
  width: 100%;
  height: 300px;
  position: relative;
  background-image: url('https://s3.amazonaws.com/snapwire/images/home/541dc36373ac9979736e08f0.jpg');
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  .focus {
    border: 1.5px solid #444;
  }
  h2 {
    // border: 1px solid black;

    width: 100%;
    text-align: center;
    color: #444;
    position: absolute;
    top: 25%;
  }
}

.search-box {
  width: 30%;
  height: 50px;
  text-align: center;
  border: 1px solid black;
  position: absolute;
  display: inline-block;
  left: 35%;
  top: 45%;
  padding: 6px 0;
  input {
    width: 90%;
    outline: none;
    border: none;
    background-color: transparent;
  }
  .search-btn {
    font-size: 18px;
    color: #979797;
  }
}
#photos {
  margin: 30px 0;
  width: 80%;
  margin-left: 10%;
  .box {
    background-size: cover;
    background-repeat: no-repeat;
    transition: ease-in-out 0.5s;
    transform: translate;

    .item {
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      background-repeat: no-repeat;
      background-color: #eee;
      background-size: cover;
      color: #ccc;
      font-family: '宋体';
      .item-container {
        opacity: 0;
      }
      &:hover {
        .item-container {
          opacity: 1;
        }
      }
    }
    .item-top {
      width: 100%;
      height: 35px;
      // border: 1px solid #fff;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(37, 43, 51, 0.7);
      padding: 3px 0 3px 10px;
    }
    .item-mid {
      position: absolute;
      top: 35px;
      bottom: 35px;
      right: 0;
      left: 0;
      // border: 1px solid #fff;
    }
    .item-bottom {
      width: 100%;
      height: 35px;
      // border: 1px solid #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      background: rgba(37, 43, 51, 0.7);
      padding: 3px 0 3px 10px;
      .head-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-block;
        background-size: contain;
        padding-left: 5px;
      }
      .creator-name {
        font-size: 17px;
        margin-left: 10px;
      }
      .like {
        position: absolute;
        right: 0;
        padding-right: 10px;
        font-size: 20px;
      }
    }
  }
}
.pagination {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>


