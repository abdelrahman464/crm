const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const { User, Bachelor, Master, PHD } = require("../models");

//1- assign employee for each request
//@params     employeeId userId
exports.assignEmployeeForRequest = asyncHandler(async (req, res) => {
  const { employeeId, userId, requestId } = req.body;
  const user = await User.findByPk(userId);

  let modelToUpdate;
  if (user.type.toLowerCase() === "bachelor") {
    modelToUpdate = Bachelor;
  } else if (user.type.toLowerCase() === "master") {
    modelToUpdate = Master;
  } else if (user.type.toLowerCase() === "phd") {
    modelToUpdate = PHD;
  } else {
    return res.status(400).json({ error: "Invalid user type" });
  }

  if (modelToUpdate) {
    await modelToUpdate.update(
      { employeeId: employeeId },
      { where: { id: requestId } }
    );
    // TODO: Save these assignments to the employee to view in their dashboard
  }

  return res.status(200).json({
    status: "success",
    msg: "Employee has been assigned successfully to this user",
  });
});

exports.removeEmployeeFromRequest = asyncHandler(async (req, res) => {
  const { userId, requestId } = req.body;

  try {
    const user = await User.findByPk(userId);

    let modelToUpdate;
    if (user.type.toLowerCase() === "bachelor") {
      modelToUpdate = Bachelor;
    } else if (user.type.toLowerCase() === "master") {
      modelToUpdate = Master;
    } else if (user.type.toLowerCase() === "phd") {
      modelToUpdate = PHD;
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }

    if (modelToUpdate) {
      await modelToUpdate.update(
        { employeeId: null },
        { where: { id: requestId } }
      );
      // TODO: Save these assignments to the employee to view in their dashboard
    }

    return res.status(200).json({
      status: "success",
      msg: "Employee assignment has been removed successfully from this user",
    });
  } catch (error) {
    console.error("Error removing employee assignment:", error);
    return res
      .status(500)
      .json({ error: "Failed to remove employee assignment" });
  }
});

// get request that employee part in
exports.sendLoggedUserIdToParams = asyncHandler(async (req, res, next) => {
  req.params.employeeId = req.user.id;
  next();
});
exports.getEmployeeRequests = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.params; // Assuming you're passing employeeId in the route params

  const bachelorRequests = await Bachelor.findAll({
    where: { employeeId },
  });

  const masterRequests = await Master.findAll({
    where: { employeeId },
  });
  console.log("masterRequests", masterRequests);
  const phdRequests = await PHD.findAll({
    where: { employeeId },
  });

  const allRequests = [...bachelorRequests, ...masterRequests, ...phdRequests];

  res.status(200).json({ data: allRequests });
});
