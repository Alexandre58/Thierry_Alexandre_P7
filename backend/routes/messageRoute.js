const express = require("express");
const postsController = require("../controllers/messagesCtrl");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

/**********************************GET*********************************************** */
//list posts = localhost:4000/api/posts
router.get("/posts/", /*auth, */ postsController.listPosts);
//list posts user +  with her token
router.get("/user/posts", auth, postsController.listPostsUser);
//**************************get one message +token admin
router.get("/:messageId", auth, postsController.getOneMessage);
//4000/view/35/posts + token
router.get("/view/:userId/posts", auth, postsController.listMessagesOtherUser);

/**********************************POST************************************************ */
//news posts=4000/posts/new/ post users with their token
router.post("/posts/new/", auth, postsController.createPosts);

//4000:/posts/Images/new
router.post(
  "/posts/images/new",
  auth,
  multer,
  postsController.createPostWithImage
);

/**********************************PUT************************************************** */
router.put("/posts/:messageId", auth, multer, postsController.updatePosts);

/**********************************DELETE************************************************ */

router.delete("/posts/:messageId", auth, postsController.deletePosts);
module.exports = router;