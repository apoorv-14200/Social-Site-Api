const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports.createSession = async function (req, res) {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    console.log("body", req.body);
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.json(200, {
        message: "Unauthorized User",
        error: "Invalid Username or Password",
        success: false,
      });
    } else {
      console.log(user);
      return res.json(200, {
        message: "Successfully Signed in Here is your token",
        success: true,
        error: "",
        data: {
          token: jwt.sign(user.toJSON(), "secret", { expiresIn: "1000000" }),
          user: {
            name: user.name,
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
          },
        },
      });
    }
    //req.flash("success","Logged in successfully!");
    //return res.redirect("/");
  } catch (err) {
    return res.json(500, {
      message: "Server error",
      success: false,
      error: "Server Error",
    });
  }
};

module.exports.signup = async function (req, res) {
  console.log(req.body);
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json(200, {
        message:
          "You have already registered with this email try doing singin instead",
        success: false,
        error:
          "You are already registered with this email try doing singin instead",
      });
    } else if (req.body.password != req.body.confirmpassword) {
      return res.json(200, {
        message: "Password does'not matches with confirm password",
        success: false,
        error: "Password does'not matches with confirm password",
      });
    } else {
      let user = await User.create(req.body);
      return res.json(200, {
        message:
          "Successfully registered and signed in to your account.Here is your token",
        success: true,
        data: {
          token: jwt.sign(user.toJSON(), "secret", { expiresIn: "1000000" }),
          user: {
            name: user.name,
            _id: user._id,
            email: user.email,
          },
        },
      });
    }
  } catch (err) {
    // console.log("Error in creating user", err);
    return res.json(401, {
      message: "Error in crearting user pls try again",
      error: "Server error",
    });
  }
};

module.exports.search = async function (req, res) {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    const s = req.query.text;
    const regex = new RegExp(s, "i"); // i for case insensitive
    let users = await User.find({ name: { $regex: regex } }).select({
      name: 1,
      _id: 1,
      email: 1,
      avatar: 1,
    });
    res.json(200, {
      success: true,
      message: "List of users having name related",
      data: {
        users: users,
      },
    });
  } catch (err) {
    res.json(401, {
      success: false,
      message: "Error in searching user",
    });
  }
};

module.exports.profile = async function (req, res) {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    let user = await User.findOne({ _id: req.params.id }).select({
      name: 1,
      _id: 1,
      email: 1,
      avatar: 1,
    });
    if (user) {
      return res.json(200, {
        success: true,
        message: "User Profile",
        error: "",
        data: {
          user: user,
        },
      });
    } else {
      res.json(200, {
        success: false,
        error: "User Not Found",
        message: "User Not found",
      });
    }
  } catch (err) {
    res.json(401, {
      success: false,
      message: "Error in showing profile",
      error: "Server Error",
    });
  }
};

module.exports.edit = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  try {
    console.log(req.body.id);
    if (req.user.id != req.body.id) {
      return res.json(200, {
        message: "You are not authorized to change the profile",
        success: false,
        error: "Unauthorized User",
      });
    }
    let user = await User.findOne({ _id: req.body.id });
    if (user) {
      if (req.body.password != req.body.confirmpassword) {
        return res.json(200, {
          message: "Password and confirm password don't match",
          error: "Password and confirm password don't match",
          success: false,
        });
      }
      user.password = req.body.password;
      user.name = req.body.name;
      user.save();
      return res.json(200, {
        message: "Succesfully updated Profile",
        data: {
          user: {
            name: user.name,
            _id: user._id,
            email: user.email,
            avatar: user.avatar,
          },
          token: jwt.sign(user.toJSON(), "secret", { expiresIn: "1000000" }),
        },
        success: true,
      });
    } else {
      return res.json(200, {
        message: "User Not found",
        success: false,
        error: "User Not Found",
      });
    }
  } catch (err) {
    return res.json(200, {
      message: "Error in updating profile",
      success: false,
      error: "Server Error",
    });
  }
};

module.exports.editPhoto = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");

  try {
    // console.log(req.body);
    // if (req.user.id != req.body.id) {
    //   return res.json(200, {
    //     message: "You are not authorized to change the profile photo",
    //     success: false,
    //     error: "Unauthorized User",
    //   });
    // }
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      await User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("Multer error", err);
          return;
        }
        // console.log(req.file);
        if (req.file) {
          if (user.avatar) {
            let fpath = path.join(__dirname, "..", user.avatar);
            fs.unlinkSync(fpath);
          }
          user.avatar = User.avatarPath + "\\" + req.file.filename;
          console.log("AVatar", user.avatar);
        }
        user.save();
      });
      setTimeout(() => {
        return res.json(200, {
          message: "Succesfully updated Profile photo",
          data: {
            user: {
              name: user.name,
              _id: user._id,
              email: user.email,
              avatar: user.avatar,
            },
            token: jwt.sign(user.toJSON(), "secret", { expiresIn: "1000000" }),
          },
          success: true,
        });
      }, 200);
    } else {
      return res.json(200, {
        message: "User Not found",
        success: false,
        error: "User Not Found",
      });
    }
  } catch (err) {
    return res.json(200, {
      message: "Error in updating profile",
      success: false,
      error: "Server Error",
    });
  }
};
