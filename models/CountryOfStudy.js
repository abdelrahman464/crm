module.exports = (db, DataTypes) => {
  const CountryOfStudy = db.define("CountryOfStudy", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_ar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  function setUrls(instance) {
    if (instance) {
      // Check if the URL is already set before modifying it
      if (
        instance.image &&
        !instance.image.startsWith(process.env.BASE_URL)
      ) {
        instance.image = `${process.env.BASE_URL}/countries/${instance.image}`;
      }
    }
  }

  // Hook to set the image and PDF URLs after finding a record
  CountryOfStudy.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    }
  });

  // Hook to set the image and PDF URLs after creating a new record
  CountryOfStudy.afterCreate((instance) => {
    setUrls(instance);
  });

  // Hook to set the image and PDF URLs after updating a record
  CountryOfStudy.afterUpdate((instance) => {
    // Ensure URLs are not modified during update
    setUrls(instance);
  });

  return CountryOfStudy;
};
