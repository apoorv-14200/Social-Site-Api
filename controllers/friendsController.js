const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Friendship = require("../models/friendship");
const User = require("../models/user");

module.exports.createfriendship = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let user = await User.findById(req.query.user_id);
    if (req.user.id == req.query.user_id || !user) {
      return res.json(200, {
        message: "Invalid frienship",
        success: false,
      });
    }
    let friendship = await Friendship.findOne({
      $or: [
        { from_user: req.user._id, to_user: req.query.user_id },
        { to_user: req.user._id, from_user: req.query.user_id },
      ],
    })
      .populate("from_user", "name email _id avatar")
      .populate("to_user", "name email _id avatar");
    if (friendship) {
      return res.json(200, {
        message: `Already a friend with ${user.name}`,
        success: false,
        error: `Already a friend with ${user.name}`,
        data: {
          friendship: friendship,
        },
      });
    } else {
      friendship = await Friendship.create({
        from_user: req.user._id,
        to_user: req.query.user_id,
      });
      user.friends.push(friendship._id);
      user.save();
      let me = await User.findById(req.user._id);
      me.friends.push(friendship._id);
      me.save();
      friendship = await Friendship.findOne({
        $or: [
          { from_user: req.user._id, to_user: req.query.user_id },
          { to_user: req.user._id, from_user: req.query.user_id },
        ],
      })
        .populate("from_user", "name email _id avatar")
        .populate("to_user", "name email _id avatar");
      return res.json(200, {
        message: `Now you are friend with ${user.name}`,
        success: true,
        data: {
          friendship: friendship,
        },
      });
    }
  } catch (err) {
    return res.json(401, {
      success: false,
      message: "Error in making friend",
      error: `Server Error : ${err}`,
    });
  }
};

module.exports.fetch_friends = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let friendships = await Friendship.find({
      $or: [{ from_user: req.user._id }, { to_user: req.user._id }],
    })
      .populate("from_user", "name email _id avatar")
      .populate("to_user", "name email _id avatar");
    return res.json(200, {
      success: true,
      message: "Successfully fetched friends",
      error: "",
      data: {
        friendships: friendships,
      },
    });
  } catch (err) {
    res.json(401, {
      success: false,
      message: "Error in fetching friends",
      error: `Server Error: ${err}`,
    });
  }
};

module.exports.remove_friend = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let friendship = await Friendship.findOne({
      $or: [
        { from_user: req.user._id, to_user: req.query.user_id },
        { to_user: req.user._id, from_user: req.query.user_id },
      ],
    });
    console.log("removefriend");
    console.log(friendship);
    if (!friendship) {
      return res.json(200, {
        success: false,
        message: "Not friends Already",
        error: "You are not friends already",
      });
    }
    let user = await User.findById(req.query.user_id);
    let me = await User.findById(req.user._id);
    user.friends.pull(friendship._id);
    me.friends.pull(friendship._id);
    user.save();
    me.save();
    let removed_id = friendship._id;
    friendship.remove();
    return res.json(200, {
      success: true,
      message: `successfully removed friendship with ${user.name}`,
      removed_id: removed_id,
    });
  } catch (err) {
    res.json(401, {
      success: false,
      message: "Error in Removing Friend",
      error: `Server Error: ${err}`,
    });
  }
};
