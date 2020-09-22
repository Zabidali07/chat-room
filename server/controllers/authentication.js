const User = require("../models/user");

const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  if (!emailRegex.test(email)) {
    return res.json({
      error: "Email is invalid",
    });
  }
  if (password.length < 6) {
    return res.json({
      error: "Password will be minimum of 6 characters long",
    });
  }

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.json({
        error: "Email already exist",
      });
    }
  });

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.MAKE_SALT),
  });

  user.save((err, data) => {
    if (err) {
      return res.json({
        error: "Something went wrong",
      });
    }

    return res.json({ message: `${name} welcome to Chat Room` });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  if (!emailRegex.test(email)) {
    return res.json({
      error: "Email is invalid",
    });
  }
  User.findOne({
    email,
    password: sha256(password + process.env.MAKE_SALT),
  }).exec((err, user) => {
    if (err || !user) {
      return res.json({
        error: "Email and Passworddidn't match",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    //const { _id, name } = user;
    return res.json({
      message: "User logged in sucessfully",
      token: token,
      user: { id: user._id, name: user.name },
    });
  });
};
