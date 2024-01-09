const express = require("express");

const { protect } = require("../services/authServices");

const {
  getLoggedUserNotifications,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  getRequestNotification,
} = require("../services/notificationService");

const router = express.Router();

router.route("/myNotification").get(protect, getLoggedUserNotifications);
router.route("/:id").delete(protect, deleteNotification);
router.route("/:notificationId/read").put(protect, markNotificationAsRead);
router.route("/markAllsAsRead").put(protect, markAllNotificationsAsRead);
router.route("/countUnread").get(protect, getUnreadNotificationCount);
router.route("/requestNoti/:requestId").get(protect, getRequestNotification);

module.exports = router;
