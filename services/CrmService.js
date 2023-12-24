const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const { createNotification } = require("./notificationService");
const { User, Bachelor, Master, PHD, RequestDoc } = require("../models");
const handlerFactory = require("./handlerFactory");

//1- assign employee for each request
//@params     employeeId userId
exports.assignEmployeeForRequest = asyncHandler(async (req, res) => {
  const { employeeId, userId, requestId } = req.body;

  const currentEmployee = await User.findByPk(employeeId);
  if (!currentEmployee.role === "employee") {
    return res
      .status(400)
      .json({ error: "this is not employee to assign to request" });
  }

  // Check if userId and requestId are present
  if (!userId || !requestId) {
    return res.status(400).json({ error: "Invalid userId or requestId" });
  }

  try {
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
      const request = await modelToUpdate.findOne({
        where: { id: requestId, UserId: userId }, // Check if the request is related to the user
      });

      // Check if the request exists and is related to the user
      if (!request) {
        return res
          .status(404)
          .json({ error: "Request not found or not related to this user" });
      }

      const [updatedRowCount] = await modelToUpdate.update(
        { employeeId: employeeId },
        { where: { id: requestId } }
      );

      if (updatedRowCount === 0) {
        return res.status(404).json({ error: "Request not found" });
      }

      // Fetch the employee details
      const employee = await User.findByPk(employeeId);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Create notification for the employee
      const message = `You have been assigned to a new request (${user.type})`;
      await createNotification(employee.id, message);
    }

    return res.status(200).json({
      status: "success",
      msg: "Employee has been assigned successfully to this user",
    });
  } catch (error) {
    console.error("Error assigning employee to request:", error);
    return res
      .status(500)
      .json({ error: "Failed to assign employee to request" });
  }
});

exports.removeEmployeeFromRequest = asyncHandler(async (req, res) => {
  const { userId, requestId } = req.body;

  // Check if userId and requestId are present
  if (!userId || !requestId) {
    return res.status(400).json({ error: "Invalid userId or requestId" });
  }

  try {
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
      const request = await modelToUpdate.findOne({
        where: { id: requestId, UserId: userId }, // Check if the request is related to the user
      });

      // Check if the request exists and is related to the user
      if (!request) {
        return res
          .status(404)
          .json({ error: "Request not found or not related to this user" });
      }

      const [updatedRowCount] = await modelToUpdate.update(
        { employeeId: null },
        { where: { id: requestId } }
      );

      if (updatedRowCount === 0) {
        return res.status(404).json({ error: "Request not found" });
      }

      // Fetch the employee details
      const employee = await User.findByPk(user.employeeId);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Create notification for the employee
      const message = `Your assignment has been removed from a request (${user.type})`;
      await createNotification(employee.id, message);
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
  if (req.params.user) {
    req.params.id = req.user.id;
  }
  req.params.id = req.user.id;
  next();
});
exports.getEmployeeRequests = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let queryWhere = {};
  if (req.user.role === "user") {
    queryWhere = {
      where: { UserId: id },
    };
  } else if (req.user.role === "employee") {
    queryWhere = {
      where: { employeeId: id },
    };
  } else {
    queryWhere = {};
  }
  const bachelorRequests = await Bachelor.findAll(queryWhere);

  const masterRequests = await Master.findAll(queryWhere);

  const phdRequests = await PHD.findAll(queryWhere);

  const allRequests = [...bachelorRequests, ...masterRequests, ...phdRequests];

  res.status(200).json({ data: allRequests });
});
exports.getRequestDocById = handlerFactory.getOne(RequestDoc);
