module.exports = (db, DataTypes) => {
  const PhD = db.define("PhD", {
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
    PersonalPicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CV: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PersonalStatement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BachelorsDegreeCertificateWithTranscript: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MastersDegreeCertificateWithTranscript: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TwoRecommendationLetters: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    EnglishTestResults: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ExperienceLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ResearchProposal: {
      // this i want it as word file
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentStep:{
      type: DataTypes.ENUM("step_0", "step_1", "step_2", "step_3", "step_4", "step_5"),
      defaultValue: "step_0",
      allowNull: false,
    },
  });

  function setUrls(instance) {
    if (instance) {
      if (instance.CV && !instance.CV.startsWith(process.env.BASE_URL)) {
        instance.CV = `${process.env.BASE_URL}/PH_D/cv/${instance.CV}`;
      }
      if (
        instance.EnglishTestResults &&
        !instance.EnglishTestResults.startsWith(process.env.BASE_URL)
      ) {
        instance.EnglishTestResults = `${process.env.BASE_URL}/PH_D/EnglishTestResults/${instance.EnglishTestResults}`;
      }
      if (
        instance.BachelorsDegreeCertificateWithTranscript &&
        !instance.BachelorsDegreeCertificateWithTranscript.startsWith(
          process.env.BASE_URL
        )
      ) {
        instance.BachelorsDegreeCertificateWithTranscript = `${process.env.BASE_URL}/PH_D/BachelorsDegreeCertificateWithTranscript/${instance.BachelorsDegreeCertificateWithTranscript}`;
      }
      if (
        instance.MastersDegreeCertificateWithTranscript &&
        !instance.MastersDegreeCertificateWithTranscript.startsWith(
          process.env.BASE_URL
        )
      ) {
        instance.MastersDegreeCertificateWithTranscript = `${process.env.BASE_URL}/PH_D/MastersDegreeCertificateWithTranscript/${instance.MastersDegreeCertificateWithTranscript}`;
      }
      if (
        instance.PersonalPicture &&
        !instance.PersonalPicture.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalPicture = `${process.env.BASE_URL}/PH_D/PersonalPicture/${instance.PersonalPicture}`;
      }
      if (
        instance.TwoRecommendationLetters &&
        !instance.TwoRecommendationLetters.startsWith(process.env.BASE_URL)
      ) {
        instance.TwoRecommendationLetters = `${process.env.BASE_URL}/PH_D/TwoRecommendationLetters/${instance.TwoRecommendationLetters}`;
      }
      if (
        instance.ExperienceLetter &&
        !instance.ExperienceLetter.startsWith(process.env.BASE_URL)
      ) {
        instance.ExperienceLetter = `${process.env.BASE_URL}/PH_D/ExperienceLetter/${instance.ExperienceLetter}`;
      }
      if (
        instance.PersonalStatement &&
        !instance.PersonalStatement.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalStatement = `${process.env.BASE_URL}/PH_D/PersonalStatement/${instance.PersonalStatement}`;
      }
      if (
        instance.ResearchProposal &&
        !instance.ResearchProposal.startsWith(process.env.BASE_URL)
      ) {
        instance.ResearchProposal = `${process.env.BASE_URL}/PH_D/ResearchProposal/${instance.ResearchProposal}`;
      }
    }
  }

  // Hook to set the image and PDF URLs after finding a record
  PhD.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    }
  });

  // Hook to set the image and PDF URLs after creating a new record
  PhD.afterCreate((instance) => {
    setUrls(instance);
  });

  // Hook to set the image and PDF URLs after updating a record
  PhD.afterUpdate((instance) => {
    setUrls(instance);
  });

  return PhD;
};
