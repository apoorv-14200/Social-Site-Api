const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.showposts = async function (req, res) {
  console.log(req.user);
  res.header("Access-Control-Allow-Origin", "*");
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let startindx = (page - 1) * limit;
    let posts = await Post.find({})
      .sort([["createdAt", -1]])
      .limit(limit)
      .skip(startindx)
      .populate("user", "name email _id")
      .populate("likes", "user")
      .populate({
        path: "comment",
        populate: [
          {
            path: "user",
            select: "name email _id",
          },
          {
            path: "likes",
            select: "user",
          },
        ],
      });
    let next;
    let len = await Post.count();
    if (startindx + limit < len) {
      next = {
        page: page + 1,
        limit: limit,
      };
    }
    let prev;
    if (startindx > 0) {
      prev = {
        page: page - 1,
        limit: limit,
      };
    }
    return res.json(200, {
      message: "Posts are accessed successfully",
      next: next,
      prev: prev,
      data: {
        posts: posts,
      },
    });
  } catch (err) {
    res.json(401, {
      message: "Error in showing posts",
    });
  }
};

module.exports.createpost = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);

  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
      comment: [],
    });
    let id = post._id;
    post = await Post.findOne({ _id: id })
      .populate("user", "name email _id")
      .populate({
        path: "comment",
        populate: {
          path: "user",
          select: "name email _id",
        },
      });
    return res.json(200, {
      message: "Post created successfully",
      success: true,
      data: {
        post: post,
      },
    });
  } catch (err) {
    res.json(401, {
      success: false,
      error: `Server Error ${err}`,
      message: "Error in deleting post",
    });
  }
};
