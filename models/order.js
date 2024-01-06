module.exports = (db, DataTypes) => {
  const Order = db.define("order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("contract_fees", "visa_fees", "registration_fees"),
      allowNull: false,
    },
    totalOrderPrice: {
      type: DataTypes.DECIMAL(10, 2), // 10 total digits, 2 digits after the decimal point
      allowNull: false,
    },
  });

  return Order;
};
