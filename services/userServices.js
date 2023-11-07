const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const generateToken = require("../utils/generateToken");
const { User } = require("../models");
const { createOne, getOne, getAll, deleteOne } = require("./handlerFactory");

//@desc update specific user
//@route PUT /api/v1/user/:id
//@access private

//needs to be updated
exports.updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  const [updatedRows] = await User.update(
    {
      username: username,
      email: email,
      role: role,
    },
    {
      where: { id: userId },
    }
  );

  if (updatedRows === 0) {
    return next(new ApiError("User Not Found", 404));
  }

  // Fetch the updated user after the update
  const updatedUser = await User.findOne({
    where: { id: userId },
  });

  res.status(200).json({ data: updatedUser });
});

// Create One User
exports.createUser = createOne(User);
// Get One User
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  // i will set the req,pararms.id because i will go to the next middleware =>>> (getUser)
  req.params.id = req.user.id;
  next();
});
exports.getUserById = getOne(User);

// Get All Users
exports.getAllUsers = getAll(User, "User");

// Delete One User
exports.deleteUser = deleteOne(User);
//@desc update logged user password
//@route PUT /api/v1/user/changeMyPassword
//@access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const newPassword = await bcrypt.hash(req.body.password, 12);

  const [affectedRowCount] = await User.update(
    {
      password: newPassword,
      passwordChangedAt: new Date(),
    },
    {
      where: { id: req.user.id },
    }
  );

  if (affectedRowCount === 0) {
    return next(new ApiError(`User Not Found`, 404));
  }
  //genrate token
  const token = generateToken(req.user.id);

  res.status(200).json({ token });
});
//@desc update logged user data without updating password or role
//@route PUT /api/v1/user/changeMyData
//@access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  const [updatedRows] = await User.update(
    {
      username: username,
      email: email,
    },
    {
      where: { id: req.user.id },
    }
  );

  if (updatedRows === 0) {
    return next(new ApiError("User Not Found", 404));
  }

  // Fetch the updated user after the update
  const updatedUser = await User.findOne({
    where: { id: req.user.id },
  });

  res.status(200).json({ data: updatedUser });
});
