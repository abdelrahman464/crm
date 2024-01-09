module.exports = (db, DataTypes) => {
  const RequestDocument = db.define("Request_Document", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedContract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contractFeesFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offerLetter: {
      //employee
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedOfferLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MOHERE: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MOHEREApproval: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    EVAL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visaFeesFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    EMGS: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    finalAcceptanceLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationFeesFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ticket: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applyingForSEV: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  function setUrls(instance) {
    if (instance) {
      // Check if the URL is already set before modifying it
      if (
        instance.contract &&
        !instance.contract.startsWith(process.env.BASE_URL)
      ) {
        instance.contract = `${process.env.BASE_URL}/RequestDocument/contract/${instance.contract}`;
      }
      if (
        instance.signedContract &&
        !instance.signedContract.startsWith(process.env.BASE_URL)
      ) {
        instance.signedContract = `${process.env.BASE_URL}/RequestDocument/signedContract/${instance.signedContract}`;
      }
      if (
        instance.contractFeesFile &&
        !instance.contractFeesFile.startsWith(process.env.BASE_URL)
      ) {
        instance.contractFeesFile = `${process.env.BASE_URL}/RequestDocument/contractFeesFile/${instance.contractFeesFile}`;
      }
      if (
        instance.offerLetter &&
        !instance.offerLetter.startsWith(process.env.BASE_URL)
      ) {
        instance.offerLetter = `${process.env.BASE_URL}/RequestDocument/offerLetter/${instance.offerLetter}`;
      }
      if (
        instance.signedOfferLetter &&
        !instance.signedOfferLetter.startsWith(process.env.BASE_URL)
      ) {
        instance.signedOfferLetter = `${process.env.BASE_URL}/RequestDocument/signedOfferLetter/${instance.signedOfferLetter}`;
      }
      if (
        instance.MOHERE &&
        !instance.MOHERE.startsWith(process.env.BASE_URL)
      ) {
        instance.MOHERE = `${process.env.BASE_URL}/RequestDocument/MOHERE/${instance.MOHERE}`;
      }
      if (
        instance.MOHEREApproval &&
        !instance.MOHEREApproval.startsWith(process.env.BASE_URL)
      ) {
        instance.MOHEREApproval = `${process.env.BASE_URL}/RequestDocument/MOHEREApproval/${instance.MOHEREApproval}`;
      }
      if (instance.EVAL && !instance.EVAL.startsWith(process.env.BASE_URL)) {
        instance.EVAL = `${process.env.BASE_URL}/RequestDocument/EVAL/${instance.EVAL}`;
      }
      if (
        instance.finalAcceptanceLetter &&
        !instance.finalAcceptanceLetter.startsWith(process.env.BASE_URL)
      ) {
        instance.finalAcceptanceLetter = `${process.env.BASE_URL}/RequestDocument/finalAcceptanceLetter/${instance.finalAcceptanceLetter}`;
      }
      if (
        instance.visaFeesFile &&
        !instance.visaFeesFile.startsWith(process.env.BASE_URL)
      ) {
        instance.visaFeesFile = `${process.env.BASE_URL}/RequestDocument/visaFeesFile/${instance.visaFeesFile}`;
      }
      if (instance.EMGS && !instance.EMGS.startsWith(process.env.BASE_URL)) {
        instance.EMGS = `${process.env.BASE_URL}/RequestDocument/EMGS/${instance.EMGS}`;
      }
      if (
        instance.registrationFeesFile &&
        !instance.registrationFeesFile.startsWith(process.env.BASE_URL)
      ) {
        instance.registrationFeesFile = `${process.env.BASE_URL}/RequestDocument/registrationFeesFile/${instance.registrationFeesFile}`;
      }
      if (
        instance.ticket &&
        !instance.ticket.startsWith(process.env.BASE_URL)
      ) {
        instance.ticket = `${process.env.BASE_URL}/RequestDocument/ticket/${instance.ticket}`;
      }
    }
  }

  // Hook to set the image and PDF URLs after finding a record
  RequestDocument.afterFind((instances) => {
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        setUrls(instance);
      });
    } else {
      setUrls(instances);
    }
  });

  // Hook to set the image and PDF URLs after creating a new record
  RequestDocument.afterCreate((instance) => {
    setUrls(instance);
  });

  // Hook to set the image and PDF URLs after updating a record
  RequestDocument.afterUpdate((instance) => {
    // Ensure URLs are not modified during update
    setUrls(instance);
  });

  return RequestDocument;
};
