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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Order;
};
