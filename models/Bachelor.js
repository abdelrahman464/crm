

module.exports = (db, DataTypes) => {
  const Bachelor = db.define("Bachelor", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    Eligibility: {
      type: DataTypes.ENUM("eligible", "notEligible", "pending"),
      defaultValue: "pending",
      allowNull: false,
    },
    PersonalPicture:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    HighSchoolCertificate:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    CV:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    PersonalStatement:{
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  function setUrls(instance) {
    if (instance) {
      if (instance.HighSchoolCertificate && !instance.HighSchoolCertificate.startsWith(process.env.BASE_URL)) {
        instance.HighSchoolCertificate = `${process.env.BASE_URL}/Bachelor/HighSchoolCertificate/${instance.HighSchoolCertificate}`;
      }
      if (instance.CV && !instance.CV.startsWith(process.env.BASE_URL)) {
        instance.CV = `${process.env.BASE_URL}/Bachelor/cv/${instance.CV}`;
      }
      
    }
  }
  
  
  // Hook to set the image and PDF URLs after finding a record
  Bachelor.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    }
  });
  
  // Hook to set the image and PDF URLs after creating a new record
  Bachelor.afterCreate((instance) => {
    setUrls(instance);
  });
  
  // Hook to set the image and PDF URLs after updating a record
  Bachelor.afterUpdate((instance) => {
    setUrls(instance);
  });

  return Bachelor;
};

