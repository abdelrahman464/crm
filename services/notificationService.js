const asyncHandler = require("express-async-handler");
const { Notification } = require("../models");

exports.getLoggedUserNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;
  const notifications = await Notification.findAndCountAll({
    where: { userId },
    offset,
    limit,
    order: [["createdAt", "DESC"]], // Sort notifications by createdAt in descending order
  });

  const totalPages = Math.ceil(notifications.count / limit);

  res.status(200).json({
    success: true,
    notifications: notifications.rows,
    totalPages,
    currentPage: page,
  });
});

// exports.getNotificationsByUserId = asyncHandler(async (req, res, next) => {
//   const UserId = req.user.id;
//   const notifications = await Notification.findAll({
//     where: { UserId },
//   });
//   res.status(200).json({ success: true, notifications });
// });

exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const  notificationId  = req.params.id;
  const deletedRows = await Notification.destroy({
    where: { id: notificationId },
  });
  if (deletedRows > 0) {
    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } else {
    res.status(404).json({ success: false, message: "Notification not found" });
  }
});
// Mark a notification as read
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const { notificationId } = req.params;
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  }

  notification.read = true;
  await notification.save();

  res
    .status(200)
    .json({ success: true, message: "Notification marked as read" });
});



exports.createNotification = async (req, res, next) => {
  const { UserId, message } = req.params;

  const notification = await Notification.create({
    UserId,
    message,
  });
  res.status(200).json({ success: true, data: notification });
};
