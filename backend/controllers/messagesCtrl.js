// Imports
"use strict";
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const moment = require("moment"); // format Date
const { strict } = require("assert");
moment.locale("fr");

// Constantes
const title_limit = 2;
const content_limit = 4;
const items_limit = 50;

module.exports = {
  /**********************************************************CREATE POST IMAGE */
  //4000:/posts/Images/new
  createPostWithImage: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;
    console.log(userId);
    // Paramètres

    const formMessage = req.body;

    const { title, content } = formMessage;
    if (!title) {
      return res.status(400).json({ error: "Please complete the following" });
    }

    if (title.length <= title_limit) {
      return res.status(400).json({ error: "post a longer message" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          }).then(function (userFound) {
            done(null, userFound);
          });
        },
        function (userFound, done) {
          if (userFound) {
            models.Message.create({
              title: title,
              content: content,
              likes: 0,
              dislikes: 0,
              UserId: userId,
              comments: 0,
              attachment: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Message.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["firstname", "lastname", "avatar"],
              },
            ],
          }).then(function (allMessageFound) {
            const allMessageFoundParsed = JSON.parse(
              JSON.stringify(allMessageFound)
            );

            if (allMessageFound) {
              const messagesFormated = allMessageFoundParsed.map(element => {
                const postedDate = moment(element.createdAt)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a");
                element.createdAt = postedDate;

                console.log(postedDate);

                const updatedDate = moment(element.updatedAt)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a");
                element.updatedAt = updatedDate;
                return element;
              });

              return res.status(201).json(messagesFormated);
            }
          });
        } else {
          return res.status(500).json({ error: "unable to post message" });
        }
      }
    );
  },
  /**********************************POST************************************************ */
  //news posts=4000/posts/new/ post users with their token
  createPosts: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    // Paramètres
    const title = req.body.title;
    const content = req.body.content;

    if (!title || !content) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    if (title.length <= title_limit || content.length <= content_limit) {
      return res.status(400).json({ error: "publication insuffisante" });
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
          if (userFound) {
            models.Message.create({
              title: title,
              content: content,
              likes: 0,
              dislikes: 0,
              UserId: userFound.id,
              comments: 0,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          var fields = req.query.fields;
          var limit = parseInt(req.query.limit);
          var offset = parseInt(req.query.offset);
          var order = req.query.order;
          models.Message.findAll({
            order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["firstname", "lastname", "avatar"],
              },
            ],
          }).then(function (allMessageFound) {
            const allMessageFoundParsed = JSON.parse(
              JSON.stringify(allMessageFound)
            );

            if (allMessageFound) {
              const messagesFormated = allMessageFoundParsed.map(element => {
                const postedDate = moment(element.createdAt)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a");
                element.createdAt = postedDate;

                const updatedDate = moment(element.updatedAt)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a");
                element.updatedAt = updatedDate;
                return element;
              });
              return res.status(201).json(messagesFormated);
            }
          });
        } else {
          return res
            .status(500)
            .json({ error: "impossible de poster le message" });
        }
      }
    );
  },
  /**********************************GET*********************************************** */
  //list posts = localhost:4000/user/posts + token
  listPosts: function (req, res) {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > items_limit) {
      limit = items_limit;
    }

    models.Message.findAll({
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null, // mettre une limite pour éviter de trop charger, new call après la limite fixer en number
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname", "avatar", "isAdmin"],
        },
        {
          model: models.Like,
        },
      ],
    })
      .then(function (messages) {
        const messagesParsed = JSON.parse(JSON.stringify(messages));

        if (messages) {
          const messagesFormated = messagesParsed.map(element => {
            const postedDate = moment(element.createdAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss a");
            element.createdAt = postedDate;

            const updatedDate = moment(element.updatedAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss a");
            element.updatedAt = updatedDate;
            return element;
          });
          res.status(200).json(messagesFormated);
        } else {
          res.status(404).json({ error: "message(s) introuvable(s)" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "colonne invalide" });
      });
  },
  listMessagesOtherUser: function (req, res) {
    const userId = req.params.userId;
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    const items_limit = 50;
    if (limit > items_limit) {
      limit = items_limit;
    }

    models.Message.findAll({
      where: { userId: userId },
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname", "avatar", "isAdmin"],
        },
      ],
    })
      .then(function (messages) {
        const messagesParsed = JSON.parse(JSON.stringify(messages));
        if (messages) {
          const messagesFormated = messagesParsed.map(element => {
            const postedDate = moment(element.createdAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss a");
            element.createdAt = postedDate;

            const updatedDate = moment(element.updatedAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss a");
            element.updatedAt = updatedDate;
            return element;
          });
          res.status(200).json(messagesFormated);
        } else {
          res.status(404).json({ error: "publication(s) introuvable(s)" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "colonne invalide" });
      });
  },
  listPostsUser: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > items_limit) {
      limit = items_limit;
    }

    models.Message.findAll({
      where: { userId },
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname", "avatar", "isAdmin"],
        },
      ],
    })
      .then(function (messages) {
        const messagesParsed = JSON.parse(JSON.stringify(messages));
        if (messages) {
          const messagesFormated = messagesParsed.map(element => {
            const postedDate = moment(element.createdAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss");
            element.createdAt = postedDate;

            const updatedDate = moment(element.updatedAt)
              .local()
              .format("MMMM Do YYYY, h:mm:ss a");
            element.updatedAt = updatedDate;
            return element;
          });
          res.status(200).json(messagesFormated);
        } else {
          res.status(404).json({ error: "publication(s) introuvable(s)" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "colonne invalide" });
      });
  },
  getOneMessage: function (req, res) {
    const messageId = parseInt(req.params.messageId);
    models.Message.findOne({
      attributes: ["createdAt", "title", "attachment", "content"],
      where: { id: messageId },
      include: [
        {
          model: models.User,
          attributes: ["firstname", "lastname"],
        },
      ],
    })
      .then(function (message) {
        if (message) {
          res.status(201).json(message);
        } else {
          res.status(404).json({ error: "publication introuvable" });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({ error: "impossible de récupérer la publication" });
      });
  },
  updatePosts: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    const messageId = parseInt(req.params.messageId);
    const formMessage = JSON.parse(req.body.message);
    const title = formMessage.title;
    const content = formMessage.content;

    asyncLib.waterfall(
      [
        function (done) {
          models.Message.findOne({
            where: { id: messageId },
          })
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "publication introuvable" });
            });
        },
        function (messageFound, done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (messageFound, userFound, done) {
          models.User.findOne({
            where: { isAdmin: true, id: userId },
          })
            .then(function (userFoundAdmin) {
              done(null, messageFound, userFound, userFoundAdmin);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (messageFound, userFound, userFoundAdmin, done) {
          if (messageFound) {
            if (
              messageFound.UserId === userFound.id ||
              (userFoundAdmin.isAdmin && userFoundAdmin.id === userId)
            ) {
              if (req.file) {
                messageFound
                  .update({
                    title: title ? title : messageFound.title,
                    content,
                    attachment: `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
                    }`,
                  })
                  .then(function (newMessageFound) {
                    done(newMessageFound);
                  });
              } else {
                messageFound
                  .update({
                    title: title ? title : messageFound.title,
                    content: content ? content : messageFound.content,
                  })
                  .then(function (newMessageFound) {
                    done(newMessageFound);
                  });
              }
            } else {
              res
                .status(404)
                .json({ error: "cette publication ne vous appartient guère" });
            }
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (messageFound) {
        if (messageFound) {
          return res.status(201).json(messageFound);
        } else {
          return res
            .status(500)
            .json({ error: "impossible de poster la modification" });
        }
      }
    );
  },
  deletePosts: function (req, res) {
    //Params
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const messageId = parseInt(req.params.messageId);
    console.log(messageId);
    models.Comment.destroy({
      where: { messageId: messageId },
    }).then(results => {
      models.Message.destroy({
        where: { id: messageId },
      })
        .then(function (destroyMessageFound) {
          return res.status(201).json(destroyMessageFound);
        })
        .catch(function (err) {
          res
            .status(500)
            .json({ error: "impossible de supprimer la publication" });
        });
    });
  },
};