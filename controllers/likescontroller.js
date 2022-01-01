const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.query);
  try {
    // likes/toggle/?id=abcdef&type=Post
    let likeable;
    let deleted = false;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    // check if a like already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });
    let liketosent = existingLike;
    // if a like already exists then delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();
      deleted = true;
    } else {
      // else make a new like

      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.push(newLike._id);
      likeable.save();
      liketosent = newLike;
    }
    return res.json(200, {
      message: "Request successful!",
      success: true,
      data: {
        deleted: deleted,
        liketosent: liketosent,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
      success: false,
      error: `Server Error:${err}`,
    });
  }
};

module.exports.getlikes = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let likes;
    likes = await Like.find({
      likeable: req.query.id,
      onModel: req.query.type,
    });
    res.json(200, {
      message: "List of Likes",
      data: {
        likes: likes,
      },
    });
  } catch (err) {
    res.json(401, {
      message: "Error occurred in fetching likes",
    });
  }
};

//localhost:4000/api/likes?id=61554977696d57fd4871b716&type=Post
