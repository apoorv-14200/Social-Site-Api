const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.createcomment = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let comment = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post_id,
    });
    let post = await Post.findOne({ _id: req.body.post_id });
    post.comment.push(comment);
    post.save();
    let id = comment._id;
    comment = await Comment.findOne({ _id: id }).populate(
      "user",
      "name email _id"
    );
    return res.json(200, {
      message: "Successfully posted comment",
      comment: comment,
      success: true,
    });
  } catch (err) {
    res.json(401, {
      message: "Unsuccessful in creating a comment",
      success: false,
      error: `Server Error :${err}`,
    });
  }
};

module.exports.getcomments = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let comments = await Comment.find({ post: req.query.post_id }).populate({
      path: "user",
    });
    return res.json(200, {
      message: "Successfully retrieved comments",
      comments: comments,
      success: "true",
    });
  } catch (err) {
    res.json(401, {
      message: "Unsuccessful in fetching comments for particular id",
      success: "true",
    });
  }
};

module.exports.deletecomment = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let comment = await Comment.findById(req.query.comment_id);
    if (comment.user != req.user.id) {
      return res.json(200, {
        message: "Comment is not posted by you",
        success: "true",
      });
    }
    await comment.remove();
    return res.json(200, {
      message: "Successfully deleted comment",
      success: "true",
    });
  } catch (err) {
    return res.json(401, {
      message: "Error in deleting comment",
      success: "false",
    });
  }
};
