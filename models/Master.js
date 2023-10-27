

module.exports = (db, DataTypes) => {
  const Master = db.define("Master", {
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
    BachelorsDegreeCertificateWithTranscript:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    TwoRecommendationLetters:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    EnglishTestResults:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    ExperienceLetter:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    ResearchProposal:{ // this i want it as word file 
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  function setUrls(instance) {
    if (instance) {
      if (instance.BachelorsDegreeCertificateWithTranscript && !instance.BachelorsDegreeCertificateWithTranscript.startsWith(process.env.BASE_URL)) {
        instance.BachelorsDegreeCertificateWithTranscript = `${process.env.BASE_URL}/Master/BachelorsDegreeCertificateWithTranscript/${instance.BachelorsDegreeCertificateWithTranscript}`;
      }
      if (instance.CV && !instance.CV.startsWith(process.env.BASE_URL)) {
        instance.CV = `${process.env.BASE_URL}/Master/cv/${instance.CV}`;
      }
      if (instance.EnglishTestResults && !instance.EnglishTestResults.startsWith(process.env.BASE_URL)) {
        instance.EnglishTestResults = `${process.env.BASE_URL}/Master/EnglishTestResults/${instance.EnglishTestResults}`;
      }
    }
  }
  
  
  
  // Hook to set the image and PDF URLs after finding a record
  Master.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    }
  });
  
  // Hook to set the image and PDF URLs after creating a new record
  Master.afterCreate((instance) => {
    setUrls(instance);
  });
  
  // Hook to set the image and PDF URLs after updating a record
  Master.afterUpdate((instance) => {
    setUrls(instance);
  });

  return Master;
};
