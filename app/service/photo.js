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
      await this.ctx.model.Photo.update({
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
      }
      ]).skip((currentPage - 1) * pageSize).limit(pageSize);
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
  }
  return Photo;
};