const bcrypt = require("bcryptjs");

module.exports = (db, DataTypes) => {
  const Employee = db.define("employees", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
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
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "employee",
    },

   
  });

  Employee.beforeSave(async (employee) => {
    // If password field is not modified, move to the next hook/middleware
    if (!employee.changed("password")) return;

    // Hashing user password
    employee.password = await bcrypt.hash(employee.password, 12);
  });



  return Employee;
}