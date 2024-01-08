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
  const { role, comment } = req.body;

  const [updatedRows] = await User.update(
    {
      role: role,
      comment: comment,
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
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "employee") {
    filterObject = { role: (req.params.role = "user") };
  } else if (req.params.role) filterObject = { role: req.params.role };
  req.filterObj = filterObject;
  next();
};
exports.getAllUsers = getAll(User);

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
  const { username, email, phone } = req.body;

  const [updatedRows] = await User.update(
    {
      username: username,
      email: email,
      phone: phone,
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
//@desc get all employees
//@route PUT /api/v1/user/employees
//@access private/protect admin
// exports.getAllEmployee = asyncHandler(async (req, res) => {
//   const documents = await User.findAll({ where: { role: "employee" } });
//   res.status(200).json({ success: true, data: documents });
// });
