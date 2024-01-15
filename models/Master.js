module.exports = (db, DataTypes) => {
  const Master = db.define("Master", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Passport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RequiredSpecialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PersonalPicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CountryOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Eligibility: {
      type: DataTypes.ENUM("eligible", "notEligible", "pending"),
      defaultValue: "pending",
      allowNull: false,
    },
    HighSchoolCertificate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CV: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BachelorsDegreeCertificateWithTranscript: {
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
    PersonalStatement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ResearchProposal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalService: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentStep: {
      type: DataTypes.ENUM(
        "sign_contract", //1-make fuction for user to upload his signed Contract  //2-make one for employee to check and move him
        "contract_fees", //3- with webhook  he automatically go to next step
        "sending_offerLetter", //4-make function for employee to update this status when offer letter comes
        "deliver_and_sign_offerLetter", //5-make fuction for user to upload his signed offerLetter  //6-make one for employee to check and move him
        "get_copy_of_mohere", //7-make fuction for user to upload his MOHERE    //8-make one for employee to check and move him
        "mohere_approval",
        "visa_fees", //9- with webhook  he automatically go to next step
        "getting_EMGS_approval", //10- make function for employee to update it to next step
        "EVAL",
        "registration_fees", //11- with webhook  he automatically go to next step
        "getting_final_acceptance_letter", // 12-make function for employee to update it to next step
        "recieving_ticket_copy", //13-make fuction for user to upload his ticket  //14-make one for employee to check and move him
        "applying_for_SEV", //14-make one for employee to check and move him and pickup airport ticket or something
        "arranging_airport_pickup",
        "Done" //thack you
      ),
      defaultValue: "sign_contract",
      allowNull: true,
    },
  });

  function setUrls(instance) {
    if (instance) {
      if (
        instance.Passport &&
        !instance.Passport.startsWith(process.env.BASE_URL)
      ) {
        instance.Passport = `${process.env.BASE_URL}/Master/Passport/${instance.Passport}`;
      }
      if (
        instance.PersonalPicture &&
        !instance.PersonalPicture.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalPicture = `${process.env.BASE_URL}/Master/PersonalPicture/${instance.PersonalPicture}`;
      }
      if (
        instance.HighSchoolCertificate &&
        !instance.HighSchoolCertificate.startsWith(process.env.BASE_URL)
      ) {
        instance.HighSchoolCertificate = `${process.env.BASE_URL}/Master/HighSchoolCertificate/${instance.HighSchoolCertificate}`;
      }
      if (
        instance.BachelorsDegreeCertificateWithTranscript &&
        !instance.BachelorsDegreeCertificateWithTranscript.startsWith(
          process.env.BASE_URL
        )
      ) {
        instance.BachelorsDegreeCertificateWithTranscript = `${process.env.BASE_URL}/Master/BachelorsDegreeCertificateWithTranscript/${instance.BachelorsDegreeCertificateWithTranscript}`;
      }
      if (
        instance.EnglishTestResults &&
        !instance.EnglishTestResults.startsWith(process.env.BASE_URL)
      ) {
        instance.EnglishTestResults = `${process.env.BASE_URL}/Master/EnglishTestResults/${instance.EnglishTestResults}`;
      }
      if (
        instance.TwoRecommendationLetters &&
        !instance.TwoRecommendationLetters.startsWith(process.env.BASE_URL)
      ) {
        instance.TwoRecommendationLetters = `${process.env.BASE_URL}/Master/TwoRecommendationLetters/${instance.TwoRecommendationLetters}`;
      }
      if (
        instance.ExperienceLetter &&
        !instance.ExperienceLetter.startsWith(process.env.BASE_URL)
      ) {
        instance.ExperienceLetter = `${process.env.BASE_URL}/Master/ExperienceLetter/${instance.ExperienceLetter}`;
      }
      if (instance.CV && !instance.CV.startsWith(process.env.BASE_URL)) {
        instance.CV = `${process.env.BASE_URL}/Master/cv/${instance.CV}`;
      }
      if (
        instance.PersonalStatement &&
        !instance.PersonalStatement.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalStatement = `${process.env.BASE_URL}/Master/PersonalStatement/${instance.PersonalStatement}`;
      }
      if (
        instance.ResearchProposal &&
        !instance.ResearchProposal.startsWith(process.env.BASE_URL)
      ) {
        instance.ResearchProposal = `${process.env.BASE_URL}/Master/ResearchProposal/${instance.ResearchProposal}`;
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
