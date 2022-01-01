const express = require("express");
const router = express.Router();
const CommentsController = require("../../controllers/commentscontroller");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  CommentsController.createcomment
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  CommentsController.getcomments
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  CommentsController.deletecomment
);

module.exports = router;
