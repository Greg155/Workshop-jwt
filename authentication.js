const argon2 = require("argon2");
const randomBytes = require("randombytes");
const jwt = require(`jsonwebtoken`);
const User = require("./models/User");
require("dotenv").config();
const expressJWT = require("express-jwt");

const secret = process.env.JWT_SECRET;

// authentification.js
const register = async ({ email, password }) => {
  const salt = randomBytes(32);
  const hashedPassword = await argon2.hash(password, { salt });

  const user = await User.create({
    email,
    password: hashedPassword,
  });
  // Be careful not to send password or salt
  return {
    email: user.email,
  };
};

const authenticate = async ({ email, password }) => {
  const user = await User.findOne({ email });
  const isPasswordCorrect = await argon2.verify(user.password, password);
  const payload = { id: user.id };

  if (!user) {
    throw new Error("User not found");
  }
  if (isPasswordCorrect == false) {
    throw new Error("Password incorrect");
  }
  return {
    token: jwt.sign(payload, secret, { expiresIn: `6h` }),
  };
};

const isAuthenticated = expressJWT({
  secret,
  algorithms: ["sha1", "RS256", "HS256"],
});

module.exports = {
  authenticate,
  isAuthenticated,
  register,
};
