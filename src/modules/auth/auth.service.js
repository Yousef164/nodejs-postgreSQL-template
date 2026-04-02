import bcrypt from "bcrypt";
import crypto from "crypto";

import authModel     from "./auth.model.js";
import verifyEmail   from "../../utils/mailer.js";
import generateToken from "../../utils/generateToken.js";

class authService {
  static async signup(userData) {
    const { username, email, password } = userData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(32).toString("hex");
      const newUser = await authModel.create({
        username,
        email,
        password: hashedPassword,
        emailToken: token,
      });

      await verifyEmail(newUser.username, newUser.email, newUser.emailToken);

      return {
        status: 201,
        message:
          "User registered successfully. Please check your email to verify your account.",
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(userData) {
    const { email, password } = userData;

    try {
      const user = await authModel.findOne({ where: { email } });

      if (!user) {
        throw {
          status: 400,
          message: "this user is not exist",
        };
      }

      const isPassword = await bcrypt.compare(password, user.password);

      if (!isPassword) {
        throw {
          status: 400,
          message: "wrong password",
        };
      }

      if (!user.emailVerified) {
        throw { status: 404, message: "please verify your email to login" };
      }

      const token = generateToken(user);

      return { status: 200, token };
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const user = await authModel.findOne({ where: { emailToken: token } });

      if (!user) {
        throw { status: 404, message: "Invalid or expired token" };
      }

      user.emailVerified = true;
      user.emailToken = null;

      await user.save();
      return { status: 200, message: "✅ email verified successfuly" };
    } catch (error) {
      throw error;
    }
  }
}

export default authService;
