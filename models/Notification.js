module.exports = (db, DataTypes) => {
  const Notification = db.define("Notification", {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Notification;
};
