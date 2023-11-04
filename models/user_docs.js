const bcrypt = require("bcryptjs");

module.exports = (db, DataTypes) => {
  const Employee = db.define("employees", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conract: {
      type: DataTypes.STRING,
      allowNull: true,
     
    },
    signedConract: {
      type: DataTypes.STRING,
      allowNull: true,
     
    },
    offerLetter: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    signedOfferLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    
    },
    MOHEREApproval: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
   
  });

  //add middlewares here 


  return Employee;
}