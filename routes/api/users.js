const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const passport = require("passport");

router.post("/login", userController.createSession); //No auth

router.post("/signup", userController.signup); //No auth

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  userController.search
); //Autherization

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.profile
); //Autherization

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  userController.edit
);

router.post(
  "/editPhoto",
  passport.authenticate("jwt", { session: false }),
  userController.editPhoto
);

module.exports = router;
