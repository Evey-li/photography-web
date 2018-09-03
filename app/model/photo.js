module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const PhotoSchema = new mongoose.Schema({
    id: ObjectId,
    width: Number,
    height: Number,
    creatorId: ObjectId,
    imgUrl: String,
    demandId: ObjectId,
    photoDesc: String,
    categoryId: ObjectId,
    uploadTime: String,
    likes: Number,
    deleted: Boolean
  });
  return mongoose.model('photos', PhotoSchema);
};