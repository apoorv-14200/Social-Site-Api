const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Friendship = require("../models/friendship");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

module.exports.get_conversation = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.params.fid);
  try {
    let conversation = await Conversation.findOne({
      friendship: req.params.fid,
    }).populate({
      path: "messages",
      populate: [
        {
          path: "user",
          select: "name email _id",
        },
      ],
    });
    if (!conversation) {
      conversation = await Conversation.create({
        friendship: req.params.fid,
        messages: [],
      });
    }
    conversation = await Conversation.findOne({
      friendship: req.params.fid,
    }).populate({
      path: "messages",
      populate: [
        {
          path: "user",
          select: "name email _id",
        },
      ],
    });
    return res.json(200, {
      message: `Successfully fetched conversation`,
      success: true,
      data: {
        conversation: conversation,
      },
    });
  } catch (err) {
    return res.json(401, {
      success: false,
      message: "Error in getting conversation",
      error: `Server Error : ${err}`,
    });
  }
};

// module.exports.send_msg = async function (req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   try {
//     let friendships = await Friendship.find({
//       $or: [{ from_user: req.user._id }, { to_user: req.user._id }],
//     })
//       .populate("from_user", "name email _id avatar")
//       .populate("to_user", "name email _id avatar");
//     return res.json(200, {
//       success: true,
//       message: "Successfully fetched friends",
//       error: "",
//       data: {
//         friendships: friendships,
//       },
//     });
//   } catch (err) {
//     res.json(401, {
//       success: false,
//       message: "Error in fetching friends",
//       error: `Server Error: ${err}`,
//     });
//   }
// };
