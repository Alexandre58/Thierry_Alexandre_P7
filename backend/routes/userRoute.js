const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

/*********************SIGN-UP AND LOGIN***************************************************** */
// localhost:4000/user/sign-up
router.post("/user/sign-up/", usersControllers.signup);
// localhost:4000/user/login
router.post("/user/login", usersControllers.login);
router.get("/user/deconnect", usersControllers.deconnect);

/**********************************************************************************GET USERS */
// localhost:4000/user/recup all users
router.get("/users/", auth, usersControllers.getAllUsers);
//recup user profil with his token valid
router.get("/users/profil/", auth, usersControllers.getUserProfil);
//recup user profil with id and his token valid
router.get("/:userId/profiluser/", auth, usersControllers.getUserProfileId);

//**************************************************************************PUT USERS PROFIF */
//4000:/users/profil/ can change bio and avatar with token user
router.put("/users/profil/", auth, multer, usersControllers.updateUserProfil);

//************************************************************************PUT PATH ONLY ADMIN*/
//4000/users/modifname/email/password/with id
router.put("/users/modifname/", auth, usersControllers.updateName);
router.put("/users/email/", auth, usersControllers.updateEmail);
router.put("/users/password/", auth, usersControllers.updatePassword);
router.put("/users/:id", auth, usersControllers.giveAdminOtherUser);

/*********************DELETE****************************************** */
// localhost:4000/user/recup users with his id
router.delete("/user/:id", auth, usersControllers.deleteUser);

module.exports = router;