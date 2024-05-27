import userModel from "../../model/userModel.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  signup: async (req, res) => {
    try {
      const userSignup = req.body;

      const checkUser = await userModel.findOne({
        where: {
          email: userSignup.email,
        },
      });
      if (checkUser)
        return res.status(401).json({ message: "Email already exists" });

      const hPassword = await hash(userSignup.password, 10);

      const user = await userModel.create({
        firstName: userSignup.firstName,
        lastName: userSignup.lastName,
        email: userSignup.email,
        password: hPassword,
      });
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  signin: async (req, res) => {
    try {
      const signin = req.body;

      const checkUser = await userModel.findOne({
        where: {
          email: signin.email,
        },
      });

      if (!checkUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const comparePassword = await compare(
        signin.password,
        checkUser.password
      );
      if (!comparePassword) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      const data = {
        id: checkUser.id,
        email: checkUser.email,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: "10min",
      });

      res.json({ data, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default userController;
