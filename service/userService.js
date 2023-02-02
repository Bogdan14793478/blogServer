const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dto/userDto");
const ApiError = require("../exeptions/apiError");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с email ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    console.log(user, "user"); // in class give model??
    // await mailService.sendActivationMail(
    //   // for it work - need google admin acc, not usual - buy domen
    //   email,
    //   `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activatedLink) {
    const user = await UserModel.findOne({ activatedLink });
    if (!user) {
      throw ApiError.BadRequest("Некорректная ссылка на активацию");
    }
    user.isActivated = true;
    await user.save();
  }
}

module.exports = new UserService();
