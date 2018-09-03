module.exports = app => {
  class Photo extends app.Service {
    async getPhotoById(id) {
      const photo = await this.ctx.model.Photo.findOne({
        _id: id
      }, {
        __v: 0
      });
      return photo;
    }
    async save(photo) {
      const newPhoto = new this.ctx.model.Photo(photo);
      return await newPhoto.save();
    }
    async getPhotosByCreatorId(id) {
      const photo = await this.ctx.model.Photo.find({
        creatorId: id
      }, {
        __v: 0
      });
      return photo;
    }
    async getPhotoByDemandId(id) {
      const photo = await this.ctx.model.Photo.find({
        demandId: id
      }, {
        __v: 0
      });
      return photo;
    }
    async getPhotoByCategoryId(c_id) {
      const photos = await this.ctx.model.Photo.find({
        categoryId: c_id
      }, {
        __v: 0
      });
      return photos;
    }
    async removePhotoById(p_id) {
      const photo = await this.ctx.model.Photo.findOne({
        _id: p_id
      }, {
        __v: 0
      });
      await photo.remove({
        _id: p_id
      });
    }
    async update(changedPhoto) {
      const id = changedPhoto._id;
      delete changedPhoto._id;
      return await this.ctx.model.Photo.update({
        _id: id
      }, {
        $set: changedPhoto
      });
    }
    async getPhotosNum(searchKey) {
      let photos = '';
      if (!searchKey) {
        photos = await this.ctx.model.Photo.find({});
      } else {
        photos = await this.ctx.model.Photo.aggregate([{
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $match: {
            $or: [{
              photoDesc: {
                $regex: searchKey
              }
            }, {
              'category.name': {
                $regex: searchKey
              }
            }]
          }
        },
        {
          $project: {
            'user.password': 0,
            'user.userDesc': 0,
            'user.country': 0,
            'user.city': 0,
          }
        }
        ]);
      }
      return photos.length;
    }
    async getPhotoList(pageSize, currentPage) {
      const photos = await this.ctx.model.Photo.aggregate([{
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          deleted: false
        }
      }
      ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      return photos;
    }
    async list() {
      const photos = await this.ctx.model.Photo.aggregate([{
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $match: {
          deleted: false
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$user',
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          'user.password': 0,
          'user.userDesc': 0,
          'user.country': 0,
          'user.city': 0,
          'user.headImgUrl': 0,
        }
      }
      ]);
      return photos;
    }
    async getPhotoListByKeyword(keyword, pageSize, currentPage) {
      const photos = await this.ctx.model.Photo.aggregate([{
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$category'
      },
      {
        $match: {
          $or: [{
            photoDesc: {
              $regex: keyword
            }
          }, {
            'category.name': {
              $regex: keyword
            }
          }]
        }
      },
      {
        $project: {
          'user.password': 0,
          'user.userDesc': 0,
          'user.country': 0,
          'user.city': 0,
        }
      }
      ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      return photos;
    }
    async groupByCategory() {
      const result = await this.ctx.model.Photo.aggregate([
        {
          $group: { _id: '$categoryId', total: { $sum: 1 } }
        },
        { $sort: { total: -1 } }
      ]);
      return result;
    }
    async count() {
      return await this.ctx.model.Photo.count({});
    }
  }
  return Photo;
};