const bcrypt = require("bcryptjs");

module.exports = (db, DataTypes) => {
  const User = db.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerifyCode: {
      type: DataTypes.STRING,
    },
    emailVerifyExpires: {
      type: DataTypes.DATE,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "employee"),
      allowNull: false,
      defaultValue: "user",
    },
    type: {
      type: DataTypes.ENUM("Bachelor", "Master", "PHD", "null"),
      allowNull: false,
      defaultValue: "null",
    },
  });

  User.beforeSave(async (user) => {
    // If password field is not modified, move to the next hook/middleware
    if (!user.changed("password")) return;

    // Hashing user password
    user.password = await bcrypt.hash(user.password, 12);
  });

  return User;
};
