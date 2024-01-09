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
exports.createtComment = handlerFactory.createOne(Comment);
// Delete One Comment
exports.deleteComment = handlerFactory.deleteOne(Comment);

exports.getUserComments = asyncHandler(async (req, res, next) => {
  const { UserId } = req.params;
  const include = [
    {
      model: User,
      as: "EmployeeComments",
    },
    {
      model: User,
      as: "UserComments",
    },
  ];

  const comments = await Comment.findAll({
    where: { UserId },
    include,
  });

  res.status(200).json({ data: comments });
});