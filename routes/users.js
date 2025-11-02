var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.post("/signup", async (req, res) => {
  if (!checkBody(req.body, ["email", "password", "name"])) {
    return res.json({ result: false, error: "Missing or empty fields'" });
  }
  if (await User.findOne({ email: req.body.email })) {
    return res.json({ result: false, error: "User already exists" });
  } else {
    await User.create(req.body);
    return res.json({ result: true });
  }
});

router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields'" });
  }
  if (await User.findOne({ email: req.body.email })) {
    return res.json({ result: true });
  } else {
    return res.json({ result: false, error: "User not found" });
  }
});

module.exports = router;
