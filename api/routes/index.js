var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "API Test" });
});

module.exports = router;
