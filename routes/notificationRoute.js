const express = require("express");

const { protect } = require("../services/authServices");

const {
  getLoggedUserNotifications,
  deleteNotification,
  markNotificationAsRead,
} = require("../services/notificationService");

const router = express.Router();

router.route("/myNotification").get(protect, getLoggedUserNotifications);
router.route("/:id").delete(protect, deleteNotification);
router.route("/:notificationId/read").put(protect, markNotificationAsRead);

module.exports = router;
