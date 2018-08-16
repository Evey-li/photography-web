module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const CategorySchema = new mongoose.Schema({
    id: ObjectId,
    name: String
  });
  return mongoose.model('categories', CategorySchema);
};