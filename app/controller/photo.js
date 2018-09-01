const Controller = require('egg').Controller;
const Response = require('../util/response');
const moment = require('moment');
moment.locale('zh-CN');

class PhotoController extends Controller {
  async uploadPhoto() {
    let result = '';
    const photo = this.ctx.request.body.photo;
    if (!photo) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const res = await this.ctx.service.photo.save({
        width: photo.width,
        height: photo.height,
        creatorId: photo.creatorId,
        imgUrl: photo.imgUrl,
        photoDesc: photo.photoDesc,
        categoryId: photo.categoryId,
        uploadTime: moment().format('LL')
      });
      result = new Response(Response.SUCCESS, res, null);
    }
    this.ctx.body = result;
  }
  async uploadPhotoList() {
    let result = '';
    const {
      photoList,
      categoryId,
      demandId,
      creatorId
    } = this.ctx.request.body;
    if (
      this.ctx.helper.checkNullOrUndefined(
        photoList,
        categoryId,
        demandId,
        creatorId
      )
    ) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      let count = 0;
      const photoDesc = (await this.ctx.service.demand.getDemandById(demandId))
        .title;
      for (let i = 0; i < photoList.length; i++) {
        const res = await this.ctx.service.photo.save({
          width: photoList[i].width,
          height: photoList[i].height,
          creatorId,
          imgUrl: photoList[i].src,
          photoDesc,
          categoryId,
          demandId,
          uploadTime: moment().format('LL')
        });
        if (res) count++;
      }
      if (count !== 0) result = new Response(Response.SUCCESS, true, null);
    }
    this.ctx.body = result;
  }
  async getPhotosByCreatorId() {
    let result = '';
    const userId = this.ctx.request.body.userId;
    if (!userId) {
      result = new Response(Response.PARAM_ERROR, null, '参数有误');
    } else {
      const photos = await this.ctx.service.photo.getPhotosByCreatorId(userId);
      result = new Response(Response.SUCCESS, photos, null);
    }
    this.ctx.body = result;
  }
  async getPhotosNum() {
    let result = '';
    const { searchKey } = this.ctx.request.body;
    const photoNum = await this.ctx.service.photo.getPhotosNum(searchKey);
    result = new Response(Response.SUCCESS, photoNum, null);
    this.ctx.body = result;
  }
  async getPhotoList() {
    let result = '';
    let photoList = '';
    const { pageSize, currentPage, searchKey } = this.ctx.request.body;

    if (!searchKey) {
      photoList = await this.ctx.service.photo.getPhotoList(
        pageSize,
        currentPage
      );
    } else {
      const searchList = await this.ctx.service.photo.getPhotoListByKeyword(
        searchKey,
        pageSize,
        currentPage
      );
      if (!searchList) {
        photoList = await this.ctx.service.photo.getPhotoList();
      } else {
        photoList = searchList;
      }
    }

    if (!this.ctx.user) {
      if (photoList) {
        for (let i = 0; i < photoList.length; i++) {
          photoList[i].likeStatus = false;
        }
        result = new Response(Response.SUCCESS, photoList, null);
      } else {
        result = new Response(Response.SERVER_ERROR, null, '服务器错误');
      }
    } else {
      const userLikeRecords = await this.ctx.service.like.getRecordsByUserId(
        this.ctx.user._id
      );
      if (photoList) {
        for (let i = 0; i < photoList.length; i++) {
          photoList[i].likeStatus = false;
          for (let j = 0; j < userLikeRecords.length; j++) {
            if (
              userLikeRecords[j].photoId.toString() ===
              photoList[i]._id.toString()
            ) {
              photoList[i].likeStatus = true;
            }
          }
        }
        result = new Response(Response.SUCCESS, photoList, null);
      } else {
        result = new Response(Response.SERVER_ERROR, null, '服务器错误');
      }
    }
    this.ctx.body = result;
  }
  async updatePhotoInfo() {
    let result = '';
    let changedPhoto = this.ctx.request.body;
    if (changedPhoto) {
      changedPhoto = await this.ctx.service.photo.update(changedPhoto);
      result = new Response(Response.SUCCESS, changedPhoto, null);
    } else {
      result = new Response(Response.ser.SERVER_ERROR, '图片信息获取失败');
    }
    this.ctx.body = result;
  }
  async removePhotoById(pid) {
    this.ctx.body = await this.ctx.service.photo.removeCategoryById(pid);
  }

  async list() {
    let result = '';
    const photos = await this.ctx.service.photo.list();
    for (let i = 0; i < photos.length; i++) {
      const res = await this.ctx.service.like.getRecordsByPhotoId(
        photos[i]._id
      );
      photos[i].likes = res.length;
    }
    result = new Response(Response.SUCCESS, photos, null);
    this.ctx.body = result;
  }

  async groupByCategory() {
    let result = '';
    const res = await this.ctx.service.photo.groupByCategory();
    if (res) {
      const data = [];
      for (let i = 0; i < 5; i++) {
        const cName = (await this.ctx.service.category.getCategoryById(res[i]._id)).name;
        data.push({ value: res[i].total, name: cName });
      }
      result = new Response(Response.SUCCESS, data, null);
    }
    this.ctx.body = result;
  }
}
module.exports = PhotoController;
