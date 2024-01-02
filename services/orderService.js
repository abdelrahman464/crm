const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const { Order, Bachelor, Master, PHD } = require("../models"); // Assuming your Sequelize models are appropriately imported
const ApiError = require("../utils/apiError");

// Function to validate if a date is in correct format
function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date);
}

exports.getOrdersBetweenDates = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.body;

  // Default values if startDate and/or endDate are not provided
  const defaultStartDate = startDate ? new Date(startDate) : new Date(0);
  const defaultEndDate = endDate ? new Date(endDate) : new Date();

  // Validate that startDate and endDate are in correct format
  if (!isValidDate(defaultStartDate) || !isValidDate(defaultEndDate)) {
    return res.status(400).json({ success: false, error: 'Invalid date format provided' });
  }

  // Find all orders between the provided start and end dates
  const ordersBetweenDates = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [defaultStartDate, defaultEndDate],
      },
      isPaid: true,
    },
  });

  res.status(200).json({ success: true, orders: ordersBetweenDates });
});


exports.getAllRequestOrders = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params; // Assuming userId is passed as a parameter
  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType) {
    case "Bachelor":
      requestModel = Bachelor;
      break;
    case "Master":
      requestModel = Master;
      break;
    case "PhD":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // if role :user  => i want to check if the logged user who send the reqeust
  if (req.user.role === "user") {
    if (!request.UserId === req.user.id) {
      return next(new ApiError(`Request is not belongs to you`, 403));
    }
  }
  // if role :employee  => i want to check if the logged employee is assigned to request
  if (req.user.role === "employee") {
    if (!request.employeeId === req.user.id) {
      return next(new ApiError(`Request is not assigned to you`, 403));
    }
  }

  const requestOrders = await Order.findAll({
    where: { requestId }, // Filter orders by userId
  });

  if (!requestOrders || requestOrders.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "request has no orders" });
  }

  res.status(200).json({ success: true, requestOrders });
});
