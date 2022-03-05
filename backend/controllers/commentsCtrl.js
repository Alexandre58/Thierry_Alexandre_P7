
// Imports
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");
const moment = require("moment"); // pour formater les dates et heures
moment.locale("fr");

module.exports = {
  createComment: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    // Param
    const content = req.body.content;
    const messageId = parseInt(req.params.messageId);

    if (!content) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
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
            .catch(function (_err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Message.findOne({
              where: { id: messageId },
            })
              .then(function (messageFound) {
                done(null, messageFound, userFound);
              })
              .catch(function (_err) {
                return res
                  .status(500)
                  .json({ error: "publication introuvable" });
              });
          } else {
            return res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
        function (messageFound, userFound, done) {
          if (messageFound) {
            models.Comment.create({
              content: content,
              commentLikes: 0,
              commentDislikes: 0,
              UserId: userFound.id,
              MessageId: messageFound.id,
            }),
              messageFound
                .update({
                  comments: messageFound.comments + 1,
                })
                .then(function (newComment) {
                  done(newComment);
                });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newComment) {
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res
            .status(500)
            .json({ error: "publication commentaire impossible" });
        }
      }
    );
  },
  listComments: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const messageId = parseInt(req.params.messageId);

    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const ITEMS_LIMIT = 50;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }
    models.Comment.findAll({
      where: { messageId },
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
        },
      ],
    })
      .then(messages => {
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
          res.status(404).json({ error: "publications introuvable" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "publications introuvable" });
      });
  },
  updateComment: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres

    const content = req.body.content;
    const commentId = parseInt(req.params.commentId);

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (_err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Comment.findOne({
              where: { id: commentId, userId },
            })
              .then(function (commentFound) {
                done(null, commentFound);
              })
              .catch(function (_err) {
                return res
                  .status(500)
                  .json({ error: "commentaire introuvable" });
              });
          } else {
            return res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
        function (commentFound, done) {
          if (commentFound) {
            commentFound
              .update({
                content: content ? content : commentId.content,
              })
              .then(function (newCommentFound) {
                done(newCommentFound);
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (commentFound) {
        if (commentFound) {
          return res.status(201).json(commentFound);
        } else {
          return res
            .status(500)
            .json({ error: "publication commentaire impossible" });
        }
      }
    );
  },
  deleteComment: function (req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Params

    let messageId = parseInt(req.params.messageId);
    let commentId = parseInt(req.params.commentId);
    console.log(messageId, commentId);
    if (messageId <= 0) {
      return res.status(400).json({ error: "paramètres invalide" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (_err) {
            return res
              .status(500)
              .json({ error: "impossible de vérifier la publication" });
          });
      },
      function (messageFound, done) {
        models.Comment.findOne({
          where: { id: commentId },
        })
          .then(function (commentFound) {
            done(null, messageFound, commentFound);
          })
          .catch(function (_err) {
            return res
              .status(500)
              .json({ error: "impossible de vérifier le commentaire" });
          });
      },

      function (messageFound, commentFound, done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFoundAdmin) {
            done(null, messageFound, commentFound, userFoundAdmin);
          })
          .catch(function (_err) {
            return res
              .status(500)
              .json({ error: "impossible de vérifier l'utilisateur" });
          });
      },
      /*function (messageFound, commentFound, userFoundAdmin, done) {
        if (commentFound) {
          console.log(commentFound);
          models.Comment.findOne({
            where: {
              messageId: messageId,
            },
          })
            .then(function (commentFound) {
              done(null, messageFound, commentFound, userFoundAdmin);
            })
            .catch(function (err) {
              return res.status(500).json({
                error: "impossible de vérifier le commentaire et l'utilisateur",
              });
            });
        } else {
          return res.status(500).json({ error: "ce commentaire n'existe pas" });
        }
      },*/
      /*function (messageFound, commentFound, userFoundAdmin, done) {
        models.CommentsLike.findAll({
          where: { commentId },
          attributes: ["id"],
        })
          .then(function (commentlikefound) {
            let commentLikeIds = [];

            commentlikefound.map(({ id }) => {
              commentLikeIds.push(id);
            });

            done(
              null,
              messageFound,
              commentFound,
              userFoundAdmin,
              commentLikeIds
            );
          })
          .catch(function (_err) {
            res.status(500).json({
              error: "impossible de trouver les likes du commentaire",
            });
          });
      },
      function (
        messageFound,
        commentFound,
        userFoundAdmin,
        commentLikeIds,
        done
      ) {
        models.CommentsLike.destroy({
          where: { id: commentLikeIds },
        })
          .then(function () {
            done(null, messageFound, commentFound, userFoundAdmin);
          })
          .catch(function (_err) {
            res.status(500).json({
              error: "impossible de supprimer les likes du commentaire",
            });
          });
      },*/

      function (messageFound, commentFound, userFoundAdmin, _done) {
        if (commentFound) {
          models.Comment.destroy({
            where: { id: commentId },
          })
            .then(commentFound => {
              messageFound.update({
                comments: messageFound.comments - 1,
              });
              return res.status(201).json(commentFound);
            })
            .catch(_err => {
              return res
                .status(500)
                .json({ error: "impossible de supprimer ce commentaire" });
            });
        } else {
          return res.status(500).json({ error: "commentaire introuvable" });
        }
      },
    ]);
  },
};