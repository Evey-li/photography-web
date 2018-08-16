module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const LikeSchema = new mongoose.Schema({
    id: ObjectId,
    photoId: ObjectId,
    admirerId: ObjectId,
    likesTime: Date
  });
  return mongoose.model('like', LikeSchema);
};