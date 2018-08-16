module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const FollowSchema = new mongoose.Schema({
    id: ObjectId,
    followId: ObjectId,
    followerId: ObjectId,
    followTime: Date
  });
  return mongoose.model('follow', FollowSchema);
};