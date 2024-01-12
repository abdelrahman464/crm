const asyncHandler = require("express-async-handler");
const { Comment, User } = require("../models");
const handlerFactory = require("./handlerFactory");

// Get One Comment
// exports.getCommentById = handlerFactory.getOne(Comment);

// update Comment
//exports.updateComment = handlerFactory.updateOne(Comment);

// Get All Comments
// exports.getAllComments = handlerFactory.getAll(Comment, "Comment");


// create  Comment
exports.sendLoggedEmployeeIdToParams = asyncHandler(async (req, res, next) => {
 
  req.body.creatorId = req.user.id;
  next();
});
exports.createtComment = handlerFactory.createOne(Comment);
// Delete One Comment
exports.deleteComment = handlerFactory.deleteOne(Comment);

exports.getUserComments = asyncHandler(async (req, res, next) => {
  const { UserId } = req.params;
  const include = [
    {
      model: User,
      as: "creator",
    },
    {
      model: User,
      as: "User",
    },
  ];

  const comments = await Comment.findAll({
    where: { UserId },
    include,
  });

  res.status(200).json({ data: comments });
});
