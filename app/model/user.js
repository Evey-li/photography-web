module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const UserSchema = new mongoose.Schema({
    id: ObjectId,
    userType: Number,
    realName: String,
    userName: String,
    password: String,
    userDesc: String,
    country: String,
    city: String,
    email: String,
    tel: String,
    headImgUrl: String
  });

  return mongoose.model('users', UserSchema);
};