const express =
  require("express");

const {
  getAverageWeightGraph,
} =
  require("./averageWeightController");


const router =
  express.Router();


/*
============================================================
AVERAGE WEIGHT GRAPH
============================================================

GET

/api/average-weight?date=2026-08-23

Required:
    date

Example:

/api/average-weight?date=2026-08-23

============================================================
*/

router.get(
  "/",
  getAverageWeightGraph
);


module.exports = router;