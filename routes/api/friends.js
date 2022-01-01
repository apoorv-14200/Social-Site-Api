const express = require("express");
const router = express.Router();
const FriendController = require("../../controllers/friendsController");
const passport = require("passport");

router.post(
  "/create_friendship",
  passport.authenticate("jwt", { session: false }),
  FriendController.createfriendship
);

router.get(
  "/fetch_user_friends",
  passport.authenticate("jwt", { session: false }),
  FriendController.fetch_friends
);

router.post(
  "/remove_friendship",
  passport.authenticate("jwt", { session: false }),
  FriendController.remove_friend
);
module.exports = router;
