
// Imports
const bcrypt = require("bcryptjs");
const models = require("../models");
const jwt = require("jsonwebtoken");
const asyncLib = require("async");
const fs = require("fs");

//********************  REGEX EMAIL
const email_regex =
/^(?!\s*$).+/;
//*******************  REGEX PASSWORD
const password_regex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,}$/;

//******************** REGEX FIRSTNAME AND LASTNAME
const name_regex =
  /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ-]* ?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;

//*******************************************SIGUP **********************************
module.exports = {
  deconnect: function (req, res) {
    res.clearCookie("token");
    /*req.session.destroy();*/
    //res.redirect("/");
    return res.status(200).json("utilisateur déconnecté");
  },

  signup: function (req, res) {
    // Paramètres
    let { email, firstname, lastname, password,/* confirmPassword,*/ bio } =
      req.body;
    const avatar = "/static/media/fkctWwWEdRrlktfd9elt5.jpg"; // IMAGE DEFAULT

    if (!email || !firstname || !lastname || !password) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }
    // .trim supprime les espaces
    email = email.trim();
    firstname = firstname.trim();
    lastname = lastname.trim();
    bio = bio.trim();
    // verifier la longueur pseudo, mail regex, password etc
    if (firstname.length >= 25 || firstname === 1) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }
    if (lastname.length >= 25 || lastname === 1) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }
    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "e-mail non valide" });
    }
    if (!name_regex.test(firstname)) {
      return res.status(400).json({ error: "Prénom non valide" });
    }

    if (!name_regex.test(lastname)) {
      return res.status(400).json({ error: "NOM non valide" });
    }
    /*
    if (!password_regex.test(password)) {
      return res.status(400).json({
        error:
          "Le premier caractère du mot de passe doit être une lettre, il doit contenir au moins 4 caractères et pas plus de 15 caractères et aucun caractère autre que des lettres, des chiffres et le trait de soulignement ne peut être utilis",
      });
    }*/

 /*   if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "vous n'avez pas saisie le même mot de passe" });
    }*/

    const groupomaniaEmail = email.split("@");

    if (groupomaniaEmail[1] !== "groupomania.com") {
      return res.status(400).json({
        error: "Votre e-mail doit se terminer par @groupomania.com",
      });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            // passe dans le then avec done qui sert de callback, le paramètre null signifie qu'on souhaite passer à la suite
            // on applique le paramètre userFound car on en a besoin dans la fonction suivante
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        // si utilisateur n'est pas existant, on utilise bcrypt pour hasher le password
        // dans le cas contraire on renvoit une erreur
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: "e-mail déjà existant" });
          }
        },
        function (userFound, bcryptedPassword, done) {
          models.User.findOne({
            attributes: ["firstname"],
            where: { firstname },
          })
            .then(function (firstnameFound) {
              done(null, userFound, bcryptedPassword, firstnameFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, bcryptedPassword, firstnameFound, done) {
          models.User.findOne({
            attributes: ["lastname"],
            where: { lastname },
          })
            .then(function (lastnameFound) {
              done(
                null,
                userFound,
                bcryptedPassword,
                firstnameFound,
                lastnameFound
              );
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "2 vérification utilisateur impossible" });
            });
        },
        function (
          userFound,
          bcryptedPassword,
          firstnameFound,
          lastnameFound,
          done
        ) {
          if (!firstnameFound) {
            done(
              null,
              userFound,
              bcryptedPassword,
              firstnameFound,
              lastnameFound
            );
          } else {
            return res.status(409).json({ error: "Pseudonyme déjà existant" });
          }
        },
        // si mot de passe hasher, on crée un nouvel utilisateur
        function (
          userFound,
          bcryptedPassword,
          firstnameFound,
          lastnameFound,
          done
        ) {
          const newUser = models.User.create({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: bcryptedPassword,
            bio: bio,
            avatar: avatar,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "ajout utilisateur impossible" });
            });
        },
      ],
      // on vérifie si l'argument newUser existe, si c'est le cas on renvoie comme quoi il a été créé
      function (newUser) {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
            token: jwt.sign(
              { userId: newUser.id, isAdmin: newUser.isAdmin },
              process.env.TOKEN,
              { expiresIn: "48h" }
            ),
          });
        } else {
          return res
            .status(500)
            .json({ error: "ajout utilisateur impossible" });
        }
      }
    );
  },
  //*********************************************************** LOGIN *****************
  login: function (req, res) {
    // Paramètres
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    console.log(password);
    if (email == null || password == null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    models.User.findAll({
      where: { email: email },
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(password, user[0].password)
          .then(pass => {
            if (pass === false) {
              return res.status(401).json({
                message: "Wrong password !",
              });
            }
            const token = jwt.sign(
              {
                userId: user[0].dataValues.id,
                isAdmin: user[0].dataValues.isAdmin,
              },
              process.env.TOKEN,
              { expiresIn: "48h" }
            );
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
              userId: user[0].dataValues.id,
              firstname: user[0].dataValues.firstname,
              lastname: user[0].dataValues.lastname,
              email: user[0].dataValues.email,
              bio: user[0].dataValues.bio,
              token: token,
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  },
  //*********************************************************recup user profil with his token valid
  getUserProfil: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    models.User.findAll({
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user[0]);
        } else {
          res.status(404).json({ error: "utilisateur introuvable" });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  //************************************************************recup user profil with id and his token valid
  getUserProfileId: function (req, res) {
    models.User.findByPk(req.params.userId, {
      attributes: ["firstname", "lastname", "bio", "avatar", "isAdmin"],
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "utilisateur introuvable" });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  /**********************************************************************************GET USERS */
  // localhost:4000/user/recup all users
  getAllUsers: function (req, res) {
    const order = req.query.order;
    if (res.user !== null) {
      models.User.findAll({
        order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
        attributes: ["id", "firstname", "lastname", "avatar", "isAdmin", "bio"],
      })
        .then(function (user) {
          if (user) {
            res.status(201).json(user);
          } else {
            res.status(404).json({ error: "utilisateurs introuvable" });
          }
        })
        .catch(function (err) {
          res
            .status(500)
            .json({ error: "impossible de récupérer les utilisateurs" });
        });
    } else {
      res.status(500).json({ error: "Utilisateur non autorisé" });
    }
  },
  //**************************************************************************PUT USERS PROFIF */

  //4000:/users/profil/ can change bio and avatar with token user
  updateUserProfil: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;
    // Paramètres
    const bio = req.body.bio;
    var avatar = req.body.avatar
    if(req.file) avatar = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    asyncLib.waterfall(
      [
        // récupère l'utilisateur dans la DBase
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                bio: bio ? bio : userFound.bio,
                avatar: avatar ? avatar : userFound.avatar,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                console.log(err);
                res.status(500).json({ error: err });
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "mise à jour du profil utilisateur impossible" });
        }
      }
    );
  },

  //************************************************************************PUT PATH ONLY ADMIN*/
  //4000/users/modifname/
  updateName: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // path .env
    const userId = decodedToken.userId;
    ///////
    //////
    // Paramètres
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if (!name_regex.test(firstname, lastname)) {
      return res.status(400).json({ error: "Prénom ou nom valide" });
    }
    asyncLib.waterfall(
      [
        // récupère l'utilisateur dans la DBase
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                firstname: firstname ? firstname : userFound.firstname,
                lastname: lastname ? lastname : userFound.lastname,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "mise à jour utilisateur impossible" });
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({
            error: "mise à jour du pseudonyme utilisateur impossible",
          });
        }
      }
    );
  },
  /*********************************************************************************************************************** */

  /********************************************************************************************************************* */
  updateEmail: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    // Paramètres
    const email = req.body.email;
    const groupomaniaEmail = email.split("@");

    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "e-mail non valide" });
    }

    if (groupomaniaEmail[1] !== "groupomania.com") {
      return res.status(400).json({
        error: "Votre e-mail doit se terminer par @groupomania.com",
      });
    }
    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },

        function (userFound, done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            .then(function (mailFound) {
              done(null, userFound, mailFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, mailFound, done) {
          if (!mailFound) {
            done(null, userFound, mailFound);
          } else {
            return res.status(409).json({ error: "e-mail déjà existant" });
          }
        },
        function (userFound, mailFound, done) {
          if (userFound) {
            userFound
              .update({
                email: email ? email : userFound.email,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "mise à jour impossible" });
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "mise à jour de l'e-mail impossible" });
        }
      }
    );
  },
  /**************************************************************************************************************************** */
  updatePassword: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if (!password_regex.test(newPassword)) {
      return res.status(400).json({
        error:
          "mot de passe non valide, 8 caractères minimum, contenant au moins une lettre minuscule, une lettre majuscule, un chiffre numérique et un caractère spécial",
      });
    }
    asyncLib.waterfall([
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "vérification utilisateur impossible" });
          });
      },
      function (userFound, done) {
        if (userFound) {
          bcrypt.compare(
            oldPassword,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            }
          );
        } else {
          return res
            .status(404)
            .json({ error: "utilisateur absent de la base de donnée" });
        }
      },
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          bcrypt.hash(newPassword, 5, function (err, bcryptedPassword) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ error: "une erreur est survenue" });
        }
      },
      function (userFound, bcryptedPassword, done) {
        if (userFound) {
          userFound
            .update({
              password: bcryptedPassword,
            })
            .then(function (updatedUser) {
              return res.status(201).json(updatedUser);
            });
        } else {
          return res
            .status(500)
            .json({ error: "mise à jour du mot de passe impossible" });
        }
      },
    ]);
  },
  /***************************************************************************ONLY ADMIN */
  /*********************DELETE****************************************** */
  deleteUser: function (req, res) {
    // Getting auth header

    const userId = parseInt(req.params.id);
    // Params
    if (res.user) {
      models.User.destroy({
        where: { id: userId },
      }).then(() => {
        res.status(200).json("user deleted");
      });
    } else {
      res.status(500).json("not allowed");
    }
  },
  giveAdminOtherUser: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findByPk(req.params.id)
            .then(function (userfound) {
              done(null, userfound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userfound, done) {
          models.User.findOne({
            where: { isAdmin: true, id: userId },
          })
            .then(function (userAdminFound) {
              done(null, userfound, userAdminFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify admin" });
            });
        },

        function (userfound, userAdminFound, done) {
          if (userAdminFound.isAdmin === true && userAdminFound.id === userId) {
            if (userfound.isAdmin === false) {
              userfound
                .update({
                  isAdmin: true,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin.isAdmin);
                });
            } else if (userfound.isAdmin === true) {
              userfound
                .update({
                  isAdmin: false,
                })
                .then(function (newUserAdmin) {
                  return res.status(201).json(newUserAdmin.isAdmin);
                });
            }
          } else {
            return res.status(500).json({ error: "you don't have the rights" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "unable to give permissions to user" });
        }
      }
    );
  },
};