const express = require("express");
const router = express.Router();
const PostController = require("../../controllers/postContoller");
const passport = require("passport");

router.get("/", PostController.showposts);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  PostController.createpost
);
module.exports = router;
