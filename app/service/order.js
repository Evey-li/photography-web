module.exports = app => {
  class Order extends app.Service {
    async save(order) {
      const newOrder = new this.ctx.model.Order(order);
      return await newOrder.save();
    }
  }
  return Order;
};