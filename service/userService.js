const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dto/userDto");
const ApiError = require("../exeptions/apiError");
const userModel = require("../models/userModel");
const tokenModule = require("../models/tokenModule");

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
      role: "User",
      // registrationDate: Date.now(),
      // posts:[],
      // avatar: "",
      // files:[],
      // isActivated: false,
    });
    console.log(user, "user"); // in class give model??
    // await mailService.sendActivationMail(
    //   // for it work - need google admin acc, not usual - buy domen
    // email,
    // `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { tokens, user: userDto };
  }

  async activate(activatedLink) {
    const user = await UserModel.findOne({ activatedLink });
    if (!user) {
      throw ApiError.BadRequest("Некорректная ссылка на активацию");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с email ${email} не существует`);
    }

    const isPasswordEqual = bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      throw ApiError.BadRequest(`Пароль введен неверно`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenModule.findOne({ refreshToken });
    if (!tokenFromDB || !userData) {
      throw ApiError.UnauthorizedError;
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { tokens, user: userDto };
  }

  async getUsers(req, res, next) {
    try {
      const users = await UserModel.find();
      return users;
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserService();
