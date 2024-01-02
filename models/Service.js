module.exports = (db, DataTypes) => {
  const Service = db.define("Service", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_ar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Service;
};
