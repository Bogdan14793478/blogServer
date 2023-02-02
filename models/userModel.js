const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  isActivated: { type: Boolean, default: false }, // активирована запись через имейл
  activatedLink: { type: String }, // по переходу по этой ссылке - активировать isActivated
  role: { type: String },
});

module.exports = model("User", UserSchema);
