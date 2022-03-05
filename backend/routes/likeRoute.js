const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const likesCtrl = require("../controllers/likesCtrl");

router.post("/messages/:messageId/vote/like", auth, likesCtrl.like);
router.post("/messages/:messageId/vote/dislike", auth, likesCtrl.dislike);
module.exports = router;