const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const commentsCtrl = require("../controllers/commentsCtrl");

//CRUD COMMENTS
//create comment 4000/id
router.post("/comment/new/:messageId", auth, commentsCtrl.createComment);
//get 4000/comments/id
router.get("/comments/:messageId", auth, commentsCtrl.listComments);
//update 4000/update/id
router.put("/update/:commentId", auth, commentsCtrl.updateComment);
//delete/user/id/id
router.delete("/user/:messageId/:commentId", auth, commentsCtrl.deleteComment);

module.exports = router;