<template>
  <div class="container">
    <div class="content">
      <div class="select-btn">
        <span @click="fileClick">
          点我选择您要上传的作品
          <i class="icon-cloud-upload"></i>
        </span>
        <input @change="fileChange($event)" type="file" id="upload_photos" multiple style="display: none" />
      </div>
      <div class="upload-blank">
        <div class="blank" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
          或者将您的作品拖到此处
        </div>
      </div>
      <div class="category">
        <span>作品分类：</span>
        <select v-model="categoryId">
          <option value="">请选择</option>
          <option v-for="category in categories" v-bind:value="category._id" :key="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="placeholder" v-if="photoList.length === 0">
      </div>
      <div class="show-photo" v-else>
        <div class="photos" v-for="photo in photoList" :style="backgroundImgStyle(photo.src)" :key="photo._id">
        </div>
      </div>
      <div class="upload-btn">
        <span @click="uploadPhotos">立即上传</span>
      </div>
    </div>

  </div>
</template>
<script>
import { uploadFile, categoryList, uploadPhotoList } from 'api';
import { mapState } from 'vuex';

export default {
  created() {
    categoryList(this).then(result => {
      this.categories = result;
    });
  },
  data() {
    return {
      photoList: [],
      categories: [],
      categoryId: ''
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    },
    /* 点击打开文件夹上传图片 */
    fileClick() {
      document.getElementById('upload_photos').click();
    },
    fileChange(el) {
      if (!el.target.files.length) return;
      this.fileList(el.target.files);
    },
    /* 拖动图片上传 */
    dragenter(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    dragover(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    drop(el) {
      el.stopPropagation();
      el.preventDefault();
      this.fileList(el.dataTransfer.files);
    },
    /* 处理获取到的图片列表 */
    fileList(fileList) {
      const files = fileList;
      // let _this=this;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== '') {
          const reader = new FileReader();
          const image = new Image();
          reader.readAsDataURL(files[i]);
          reader.onload = function () {
            files[i].src = this.result;
            image.onload = function () {
              files[i].width = image.width;
              files[i].height = image.height;
            };
            image.src = files[i].src;
          };

          uploadFile(this, files[i]).then(result => {
            files[i].src = result.url;
            this.photoList.push(files[i]);
          });
        }
      }
    },
    uploadPhotos() {
      const demandId = this.$route.params.id;
      if (this.photoList.length === 0) {
        this.$toasted.show('请添加您要上传的作品！');
      } else {
        if (!this.categoryId) {
          this.$toasted.show('不要忘记作品分类哦~');
        } else {
          console.log(this.photoList);
          uploadPhotoList(this, { photoList: this.photoList, categoryId: this.categoryId, demandId, creatorId: this.user._id })
            .then(result => {
              if (result === true) {
                this.$toasted.success('您的作品已分享，又能吸引需求人的目光了~');
                this.$router.push('/demandMgmt');
              } else {
                this.$toasted.error('分享失败！请重试');
              }
            });
        }
      }
    }
  }
};
</script>
<style lang="scss">
.container {
  width: 60%;
  display: flex;
  justify-content: center;
}
.content {
  width: 100%;
  .select-btn {
    text-align: center;
    font-size: 20px;
    font-family: '宋体';
    margin: 30px 0;
    span {
      display: inline-block;
      width: 300px;
      height: 45px;
      line-height: 45px;
      border: 1px solid #08af7f;
      border-radius: 5px;
      color: #ffffff;
      background-color: #08af7f;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .upload-blank {
    text-align: center;
    .blank {
      display: inline-block;
      width: 100%;
      height: 150px;
      line-height: 150px;
      color: #aaa;
      font-size: 20px;
      font-family: '幼圆';
      border: 1px dashed #aaa;
    }
  }
  .category {
    border: 1px solid #aaa;
    border-bottom: none;
    margin-top: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    select {
      width: 120px;
      height: 30px;
      padding-left: 5px;
    }
  }
  .placeholder {
    display: block;
    border: 1px solid #aaa;
    height: 300px;
    margin-bottom: 30px;
  }
  .show-photo {
    border: 1px solid #aaa;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    .photos {
      margin: 30px 0;
      display: inline-block;
      width: 300px;
      height: 300px;
      border: 1px solid #aaa;
      background-size: cover;
    }
  }
  .upload-btn {
    text-align: center;
    font-size: 20px;
    font-family: '宋体';
    margin: 10px 0;
    span {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #08af7f;
      border-radius: 5px;
      color: #ffffff;
      background-color: #08af7f;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
