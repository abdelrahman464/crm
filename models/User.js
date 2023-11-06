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
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
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
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    type: {
      type: DataTypes.ENUM("Bachelor","Master", "Ph_D"),
      allowNull: false,
      defaultValue: "Bachelor",
    },
   
  });

  User.beforeSave(async (user) => {
    // If password field is not modified, move to the next hook/middleware
    if (!user.changed("password")) return;

    // Hashing user password
    user.password = await bcrypt.hash(user.password, 12);
  });

  function setUrls(instance) {
    if (instance.Passport) {
      instance.Passport = `${process.env.BASE_URL}/passport/${instance.Passport}`;
    }
  }
  
  
  
  // Hook to set the image and PDF URLs after finding a record
  User.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    } 
  });
  
  // Hook to set the image and PDF URLs after creating a new record
  User.afterCreate((instance) => {
    setUrls(instance);
  });
  
  // Hook to set the image and PDF URLs after updating a record
  User.afterUpdate((instance) => {
    setUrls(instance);
  });
  
  return User;
};
