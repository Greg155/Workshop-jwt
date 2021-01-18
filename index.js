require("dotenv").config();
const express = require("express");
const User = require("./models/User");
const auth = require("./authentication");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// step 1 workshop Get in the get method, async,
// step 4 : add security
app.get("/api/v1/users", auth.isAuthenticated, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json(error);
  }
});

// step 2 workshop
app.post("/api/v1/users", async (req, res, next) => {
  const { email, password } = { ...req.body };

  try {
    await auth.register({ email, password });
    res.status(200).json("User created");
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await auth.authenticate({ email, password });
    res.status(200).json(token);
  } catch (error) {
    res.status(401).json(error);
  }
});

app.listen(4000, () => {
  console.log("Server is running on 4000 port");
});
