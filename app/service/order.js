module.exports = app => {
  class Order extends app.Service {
    async save(order) {
      const newOrder = new this.ctx.model.Order(order);
      return await newOrder.save();
    }
    async update(order) {
      const id = order._id;
      delete order._id;
      return await this.ctx.model.Order.update({
        _id: id
      }, {
        $set: order
      });
    }
    async getOrdersByCreator(user) {
      return await this.ctx.model.Order.aggregate([{
        $lookup: {
          from: 'demands',
          localField: 'demandId',
          foreignField: '_id',
          as: 'demand'
        }
      },
      {
        $unwind: '$demand'
      }, {
        $match: {
          creatorId: user._id,
          deleted: false
        }
      }]);
    }
    async getOrdersByDemandId(id) {
      return await this.ctx.model.Order.aggregate([{
        $match: {
          demandId: id,
          deleted: false
        }
      }]);
    }
    async getOrderById(id) {
      const order = await this.ctx.model.Order.findOne({
        _id: id
      }, {
        __v: 0
      });
      return order;
    }
    async getOrderByDemander(user) {
      return await this.ctx.model.Order.aggregate([{
        $lookup: {
          from: 'demands',
          localField: 'demandId',
          foreignField: '_id',
          as: 'demand'
        }
      },
      {
        $unwind: '$demand'
      }, {
        $match: {
          'demand.demanderId': user._id,
          deleted: false
        }
      }]);
    }
    async checkOrder(demandId, creatorId) {
      const order = await this.ctx.model.Order.findOne({
        demandId,
        creatorId
      });
      // console.log(order);
      if (order) {
        return order.status;
      } else {
        return '';
      }
    }
    async getOrdersByUserId(userId) {
      const orders = await this.ctx.model.Order.find({
        creatorId: userId,
        status: '已完成'
      });
      return orders;
    }
  }
  return Order;
};