module.exports = app => {
  class Demand extends app.Service {
    async save(demand) {
      const newDemand = new this.ctx.model.Demand(demand);
      return await newDemand.save();
    }
    async getDemandsNum() {
      return await this.ctx.model.Demand.count({});
    }
    async getDemandList(condition, pageSize, currentPage) {
      let demands;
      if (!condition || condition === 'all') {
        demands = await this.ctx.model.Demand.aggregate([{
          $lookup: {
            from: 'users',
            localField: 'demanderId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            status: '未完成',
            creatorId: null,
            deleted: false
          }
        }
        ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      } else if (condition === 'recent') {
        demands = await this.ctx.model.Demand.aggregate([{
          $lookup: {
            from: 'users',
            localField: 'demanderId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            status: '未完成',
            creatorId: null,
            deleted: false

          }
        }, {
          $sort: {
            _id: -1
          }
        }
        ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      } else if (condition === 'payment') {
        demands = await this.ctx.model.Demand.aggregate([{
          $lookup: {
            from: 'users',
            localField: 'demanderId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            status: '未完成',
            creatorId: null,
            deleted: false

          }
        },
        {
          $sort: {
            payment: -1
          }
        }
        ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      } else if (condition === 'workTime') {
        demands = await this.ctx.model.Demand.aggregate([{
          $lookup: {
            from: 'users',
            localField: 'demanderId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            status: '未完成',
            creatorId: null,
            deleted: false

          }
        },
        {
          $sort: {
            workTime: 1
          }
        }
        ]).skip((currentPage - 1) * pageSize).limit(pageSize);
      }

      return demands;
    }
    async getDemandById(d_id) {
      const demand = await this.ctx.model.Demand.findOne({
        _id: d_id
      }, {
        __v: 0
      });
      return demand;
    }
    async getAllDemandsByUser(user) {
      let demands = null;
      if (user.userType === 1) {
        demands = await this.ctx.model.Demand.find({
          demanderId: user._id
        }).lean();
      } else {
        demands = await this.ctx.model.Demand.find({
          creatorId: user._id
        }).lean();
      }
      for (let i = 0; i < demands.length; i++) {
        if (demands[i].demanderId) {
          demands[i].demanderName = (await this.ctx.service.user.getUserById(demands[i].demanderId)).userName;
        }
        if (demands[i].creatorId) {
          demands[i].creatorName = (await this.ctx.service.user.getUserById(demands[i].creatorId)).userName;
        }
      }
      return demands;
    }
    async checkDemand(demandId, creatorId) {
      const demand = await this.ctx.model.Demand.findOne({
        _id: demandId,
        creatorId
      });
      if (!demand) {
        return false;
      } else {
        return true;
      }
    }
    async update(demand) {
      const id = demand._id;
      delete demand._id;
      await this.ctx.model.Demand.update({
        _id: id
      }, {
        $set: demand
      });
    }
    async list() {
      return await this.ctx.model.Demand.find({ deleted: false }, {
        __v: 0
      });
    }
  }
  return Demand;
};