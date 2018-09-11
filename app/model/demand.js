module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const DemandSchema = new mongoose.Schema({
    id: ObjectId,
    title: String,
    demandDesc: String,
    status: String,
    demanderId: ObjectId,
    workTime: Number,
    payment: Number,
    email: String,
    tel: String,
    // creatorId: ObjectId,
    releaseTime: String,
    // receiveTime: String,
    finishTime: String,
    preference: String,
    place: String,
    deleted: Boolean
  });
  return mongoose.model('demands', DemandSchema);
};