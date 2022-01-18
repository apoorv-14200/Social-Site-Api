const express = require("express");
const router = express.Router();
const ConvController = require("../../controllers/conversationcontroller");
const passport = require("passport");

router.get(
  "/:fid",
  passport.authenticate("jwt", { session: false }),
  ConvController.get_conversation
);

module.exports = router;
