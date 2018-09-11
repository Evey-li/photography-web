module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const OrderSchema = new mongoose.Schema({
    id: ObjectId,
    demandId: ObjectId,
    creatorId: ObjectId,
    receiveDate: String,
    finishDate: String,
    status: String,
    invited: Boolean,
    deleted: Boolean,
  });
  return mongoose.model('orders', OrderSchema);
};