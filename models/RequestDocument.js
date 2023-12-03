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
    ticket: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applyingForVisa: {
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
