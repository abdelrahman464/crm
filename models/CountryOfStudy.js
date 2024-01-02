module.exports = (db, DataTypes) => {
  const CountryOfStudy = db.define("CountryOfStudy", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
   
  });

  return CountryOfStudy;
};
