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
  }
  return Order;
};