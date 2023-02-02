const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" }, // указываю по чем и на что поле ссылается
  refreshToken: { type: String, required: true }, // для юзера генерируется и сохраняеться в базе данных
  // refreshToken - для длительного сохранения в базе токена
});

module.exports = model("Token", TokenSchema);
