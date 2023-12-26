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
  const notificationId = req.params.id;
  const userId = req.user.id; // Assuming you can access the authenticated user's ID

  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  }

  // Check if the authenticated user is the owner of the notification
  if (notification.UserId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this notification",
    });
  }

  // Delete the notification if the user is authorized
  const deletedRows = await Notification.destroy({
    where: { id: notificationId },
  });

  if (deletedRows > 0) {
    return res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  }
  return res
    .status(404)
    .json({ success: false, message: "Notification not found" });
});

// Mark a notification as read
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  // Find the notification by its ID
  const notification = await Notification.findByPk(notificationId);

  // Check if the notification exists
  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  }

  // Check if the notification belongs to the authenticated user
  if (notification.UserId !== userId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to mark this notification as read",
    });
  }

  // Mark the notification as read
  notification.isRead = true;
  await notification.save();

  res
    .status(200)
    .json({ success: true, message: "Notification marked as read" });
});

// Function to get the number of unread notifications for a user
exports.getUnreadNotificationCount = asyncHandler(async (req, res, next) => {
  const UserId = req.user.id;

  // Find count of unread notifications for the user
  const unreadCount = await Notification.count({
    where: {
      UserId,
      isRead: false, // Filter for unread notifications
    },
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});

// Function to mark all notifications as read for a user
exports.markAllNotificationsAsRead = asyncHandler(async (req, res, next) => {
  const UserId = req.user.id;

  // Update all unread notifications for the user to mark them as read
  const updatedNotifications = await Notification.update(
    { isRead: true },
    {
      where: {
        UserId,
        isRead: false, // Filter for unread notifications
      },
    }
  );

  res.status(200).json({
    success: true,
    message: `${updatedNotifications[0]} notifications marked as read`,
  });
});

exports.createNotification = async (UserId, message, payload) => {
  const notification = await Notification.create({
    UserId,
    message,
    payload,
  });
  return notification;
};
