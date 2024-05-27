import userModel from "../model/userModel.js";

const syncDB = async () => {
  await userModel.sync({ alter: true, force: false });
};

export default syncDB;
