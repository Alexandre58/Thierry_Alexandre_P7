// Imports
const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const likeRoute = require("./routes/likeRoute");
const commentRoute = require("./routes/commentRoute");
require("dotenv").config();
const morgan = require("morgan");
const auth = require("./middlewares/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

/*management of the POST request coming from the front-end application, extraction of the JSON body*/
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("*", auth);

app.get("/tokenRecup", auth, (req, res) => {
  if (res.user) delete res.user.password;
  res.status(200).json(res.user);
});

//***************************************************USER
app.use("/api", userRoute);
//**************************************************POSTS
app.use("/api", messageRoute);
//**************************************************LIKES
app.use("/api", likeRoute);
//**************************************************COMMENTS
app.use("/api", commentRoute);

//images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;