module.exports = (db, DataTypes) => {
  const Order = db.define("order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isPaied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("contract_fees", "visa_fees","registration_fees"),
      defaultValue: "unnknown",
      allowNull: false,
    },
    totalOrderPrice: {
      type: DataTypes.Number,
      allowNull: false,
    },
  });

  return Order;
};