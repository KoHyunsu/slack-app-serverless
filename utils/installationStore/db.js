const mongoose = require('mongoose');

const connect = async () => mongoose.connect(process.env.DB_CONNECTION_URI);

const usersSchema = mongoose.Schema(
  {
    _id: String,
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: { token: String, scopes: [String], id: String },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    bot: {
      scopes: [
        String,
      ],
      token: String,
      userId: String,
      id: String,
    },
  },
  { _id: false },
);

const User = mongoose.model('User', usersSchema);

// eslint-disable-next-line consistent-return
const findUser = async (id) => {
  try {
    const user = await User.find({ _id: id });
    // return first user we find
    if (user[0] !== undefined) {
      return user[0];
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  User,
  connect,
  findUser,
};
