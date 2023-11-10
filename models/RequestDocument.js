module.exports = (db, DataTypes) => {
  const RequestDocument = db.define("Request_Document", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedConract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offerLetter: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    signedOfferLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MOHEREApproval: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  function setUrls(instance) {
    if (instance) {
      // Check if the URL is already set before modifying it
      if (
        instance.signedConract &&
        !instance.signedConract.startsWith(process.env.BASE_URL)
      ) {
        instance.signedConract = `${process.env.BASE_URL}/RequestDocument/signedConract/${instance.signedConract}`;
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
