module.exports = (db, DataTypes) => {
  const Bachelor = db.define("Bachelor", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    PersonalStatement: {
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
        "visa_fees", //9- with webhook  he automatically go to next step
        "getting_EMGS_approval", //10- make function for employee to update it to next step
        "registration_fees", //11- with webhook  he automatically go to next step
        "getting_final_acceptance_letter", // 12-make function for employee to update it to next step
        "recieving_ticket        _copy", //13-make fuction for user to upload his ticket  //14-make one for employee to check and move him
        "applying_for_visa", //14-make one for employee to check and move him and pickup airport ticket or something
        "arranging_airport_pickup" //thack you
      ),
      defaultValue: "sign_contract",
      allowNull: true,
    },

  });

  function setUrls(instance) {
    if (instance) {
      // Check if the URL is already set before modifying it
      if (
        instance.PersonalPicture &&
        !instance.PersonalPicture.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalPicture = `${process.env.BASE_URL}/Bachelor/PersonalPicture/${instance.PersonalPicture}`;
      }
      if (
        instance.Passport &&
        !instance.Passport.startsWith(process.env.BASE_URL)
      ) {
        instance.Passport = `${process.env.BASE_URL}/Bachelor/Passport/${instance.Passport}`;
      }
      if (
        instance.HighSchoolCertificate &&
        !instance.HighSchoolCertificate.startsWith(process.env.BASE_URL)
      ) {
        instance.HighSchoolCertificate = `${process.env.BASE_URL}/Bachelor/HighSchoolCertificate/${instance.HighSchoolCertificate}`;
      }
      if (instance.CV && !instance.CV.startsWith(process.env.BASE_URL)) {
        instance.CV = `${process.env.BASE_URL}/Bachelor/cv/${instance.CV}`;
      }
      if (
        instance.PersonalStatement &&
        !instance.PersonalStatement.startsWith(process.env.BASE_URL)
      ) {
        instance.PersonalStatement = `${process.env.BASE_URL}/Bachelor/PersonalStatement/${instance.PersonalStatement}`;
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
    // Ensure URLs are not modified during update
    setUrls(instance);
  });
  

  return Bachelor;
};
