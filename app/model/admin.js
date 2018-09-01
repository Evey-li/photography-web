module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const AdminSchema = new mongoose.Schema({
    id: ObjectId,
    adminName: String,
    password: String,
    headImgUrl: String
  });

  return mongoose.model('admins', AdminSchema);
};