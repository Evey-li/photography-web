<template>
  <div class="upload-dialog">
    <div class="upload-dialog-cover"></div>
    <div class="dialog-content-wrapper">
      <div class="dialog-content">
        <div class="uplog-img">
          <img :src="photo.imgUrl" alt="" @click="fileClick">
          <input @change="fileChange($event)" type="file" id="upload_photo" multiple style="display: none" />
        </div>
        <div class="info-wrapper2">
          <div>
            <span>来自作者：</span><input type="text" :value="user.userName" class="demand-name" readonly>
          </div>
          <div>
            <span>作品分类：</span>
            <select v-model="photo.categoryId">
              <option disabled value="">请选择</option>
              <option v-for="category in categories" v-bind:value="category._id" :key="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="info-wrapper1">
          <span>添加描述：</span>
          <textarea name="" class="img-desc" rows="3" v-model="photo.photoDesc" />
        </div>

        <div @click="addPhoto">
          <span class="upload-btn">立即上传</span>
        </div>
        <div class="close-btn" @click="closeMyself">
          <i class="icon-remove"></i>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { uploadFile, categoryList, uploadPhoto } from 'api';
import { mapState } from 'vuex';
import placeHolder from '../assets/img/upload-img.png';
import { log } from 'util';
export default {
  data() {
    return {
      photo: {
        imgUrl: placeHolder,
        creatorId: '',
        width: 0,
        height: 0,
        photoDesc: '',
        categoryId: ''
      },
      categories: []
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    categoryList(this).then(result => {
      // console.log(result);
      this.categories = result;
    });
  },
  methods: {
    closeMyself() {
      this.photo.imgUrl = placeHolder;
      this.photo.photoDesc = '';
      this.$emit('closeMyself');
    },
    fileClick() {
      document.getElementById('upload_photo').click();
    },
    fileChange(el) {
      if (!el.target.files[0].size) return;
      const _this = this;
      const file = el.target.files[0];
      const reader = new FileReader();
      const image = new Image();
      reader.readAsDataURL(file);
      reader.onload = function () {
        file.src = this.result;
        image.onload = function () {
          file.width = image.width;
          file.height = image.height;
          _this.photo.width = file.width;
          _this.photo.height = file.height;
        };
        image.src = file.src;
      };

      uploadFile(this, el.target.files[0]).then(result => {
        this.photo.imgUrl = result.url;
        // console.log(result.url);
        // console.log("********************");
      });
      el.target.value = '';
    },
    addPhoto() {
      if (!this.photo.categoryId) {
        this.$toasted.show('不要忘记作品分类哦~');
      } else {
        if (!this.photo.photoDesc) {
          this.$toasted.show('不要忘记作品描述哦~');
        } else {
          this.photo.creatorId = this.user._id;

          uploadPhoto(this, { photo: this.photo }).then(result => {
            if (result) {
              this.$toasted.success('您的作品已分享成功！');
              this.$emit('closeMyself');
            } else {
              this.$toasted.error('作品分享失败，请您重试！');
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.upload-dialog {
  position: fixed;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  color: #2e2c2d;
  font-size: 16px;
  overflow-y: scroll;
  .upload-dialog-cover {
    background: rgba(0, 0, 0, 0.92);
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
    // position: relative;
  }
  .dialog-content {
    border: 1px solid #e6e6e6;
    color: #ffffff;
    // position: absolute;
    position: relative;
    width: 50%;
    top: 5%;
    z-index: 101;
    padding-bottom: 20px;
    margin-bottom: 60px;
    text-align: center;
    .close-btn {
      position: absolute;
      color: black;
      left: 47.5%;
      bottom: -20px;
      border: 1px solid #fff;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 50%;
      font-size: 22px;
      color: #444;
      background-color: #e6e6e6;
    }
    .uplog-img {
      // border: 2px solid #e6e6e6;
      text-align: center;
      // width: 500px;
      // height: 400px;
      line-height: 400px;
      display: inline-block;
      img {
        max-width: 100%;
        padding: 10px;
      }
    }
    .info-wrapper1,
    .info-wrapper2 {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 15px 0;
    }
    textarea,
    input {
      background-color: transparent;
      border: 1px solid #e6e6e6;
      color: #e6e6e6;
      padding-left: 15px;
    }
    .info-wrapper1 {
      textarea {
        width: 80%;
      }
    }
    .info-wrapper2 {
      div {
        // margin: 0 10px;
        width: 47%;
      }
      input {
        width: 70%;
      }
      select {
        width: 50%;
        height: 33px;
        background-color: transparent;
        color: #e6e6e6;
        padding-left: 10px;
        option {
          color: #444;
        }
      }
    }
    .upload-btn {
      display: inline-block;
      width: 500px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      background-color: #08af7f;
      border-radius: 10px;
      color: rgb(247, 245, 245);
      margin: 15px 0;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
