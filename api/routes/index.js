const express = require("express");
const router = express.Router();
const processScreenshots = require("../utils/process-screenshots.js");

const LANES = ["LANE_LEFT", "LANE_CENTER", "LANE_RIGHT"];

router.post("/lanes", async (req, res) => {
  const [laneLeft, laneCenter, laneRight] = await Promise.all(
    LANES.map((lane) => {
      if (req.body.screenshots[lane]) {
        return processScreenshots(req.body.screenshots[lane]);
      }
      return [];
    })
  ).then((lanes) =>
    lanes.map((lane) =>
      lane
        .map(({ data }) => data.lines)
        .reduce((acc, val) => acc.concat(val), [])
    )
  );

  return res.json({
    LANE_LEFT: laneLeft,
    LANE_CENTER: laneCenter,
    LANE_RIGHT: laneRight,
  });
});

module.exports = router;
