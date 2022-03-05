const jwt = require("jsonwebtoken");
const models = require("../models");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (token !== undefined && token !== null) {
    jwt.verify(token, process.env.TOKEN, async (err, decodedToken) => {
      if (err) {
        res.user = null;
        //res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        await models.User.findAll({
          where: { id: decodedToken.userId },
        })
          .then(user => {
            res.user = user[0].dataValues;
          })
          .catch(err => {
            res.user = null;
          });

        next();
      }
    });
  } else {
    res.user = null;
    next();
  }
};