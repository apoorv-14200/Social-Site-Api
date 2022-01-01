const express = require("express");
const router = express.Router();
const LikesController = require("../../controllers/likescontroller");
const passport = require("passport");

router.post(
  "/toggle",
  passport.authenticate("jwt", { session: false }),
  LikesController.toggleLike
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  LikesController.getlikes
);

module.exports = router;
