const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const { Master, Bachelor, PhD, User } = require("../models");
const ApiError = require("../utils/apiError");

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const [affectedRowCount] = await Model.update(req.body, {
      where: { id },
    });

    if (affectedRowCount === 0) {
      return next(new ApiError(`Document Not Found`, 404));
    }

    // Fetch the updated document after the update
    const updatedDocument = await Model.findByPk(id);

    if (!updatedDocument) {
      return next(new ApiError(`Document Not Found`, 404));
    }

    const updatedData = updatedDocument.get();
    res.status(200).json({ data: updatedData });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = { where: { id } };

    const document = await Model.findOne(query);

    if (!document) {
      return next(new ApiError(`Document Not Found`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    const searchQuery = req.query.keyword; // Assuming the search term is passed in the 'keyword' query parameter

    let filter = { ...req.filterObj };
    console.log("Filter:", filter);

    if (searchQuery) {
      let searchFilter;
      if (modelName === "User") {
        searchFilter = {
          [Op.or]: [{ username: { [Op.like]: `%${searchQuery}%` } }],
        };
      } else {
        searchFilter = {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } }, // Case-insensitive partial match on the 'title' field
            // Add more fields here if you want to search on additional fields
          ],
        };
      }
      filter = { ...filter, ...searchFilter }; // Merge the existing filter with the search filter
    }

    const documents = await Model.findAll({ where: filter });
    res.status(200).json({ data: documents });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedRows = await Model.destroy({ where: { id } });

    if (deletedRows === 0) {
      return next(new ApiError(`Document Not Dound`, 404));
    }

    res.status(204).send();
  });
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
exports.sendRequest = (Model, ModelName) =>
  asyncHandler(async (req, res) => {
    let obj;
    if (ModelName === "Bachelor") {
      obj = {
        UserId: req.user.id,
        Passport: req.body.Passport,
        PersonalPicture: req.body.PersonalPicture,
        HighSchoolCertificate: req.body.HighSchoolCertificate,
        CV: req.body.CV,
        PersonalStatement: req.body.PersonalStatement,
      };
    }
    if (ModelName === "Master") {
      obj = {
        UserId: req.user.id,
        Passport: req.body.Passport,
        PersonalPicture: req.body.PersonalPicture,
        CV: req.body.CV,
        HighSchoolCertificate: req.body.HighSchoolCertificate,
        BachelorsDegreeCertificateWithTranscript:
          req.body.BachelorsDegreeCertificateWithTranscript,
        EnglishTestResults: req.body.EnglishTestResults,
        TwoRecommendationLetters: req.body.TwoRecommendationLetters,
        ExperienceLetter: req.body.ExperienceLetter,
        PersonalStatement: req.body.PersonalStatement,
        ResearchProposal: req.body.ResearchProposal,
      };
    }
    if (ModelName === "PHD") {
      obj = {
        UserId: req.user.id,
        Passport: req.body.Passport,
        PersonalPicture: req.body.PersonalPicture,
        CV: req.body.CV,
        BachelorsDegreeCertificateWithTranscript:
          req.body.BachelorsDegreeCertificateWithTranscript,
        MastersDegreeCertificateWithTranscript:
          req.body.MastersDegreeCertificateWithTranscript,
        EnglishTestResults: req.body.EnglishTestResults,
        TwoRecommendationLetters: req.body.TwoRecommendationLetters,
        ExperienceLetter: req.body.ExperienceLetter,
        PersonalStatement: req.body.PersonalStatement,
        ResearchProposal: req.body.ResearchProposal,
      };
    }

    try {
      console.log(`this is ${obj}`);
      const newRequest = await Model.create(obj);
      console.log(`after this is ${obj}`);

      // Update User type
      await User.update(
        { type: ModelName },
        {
          where: { id: req.user.id },
        }
      );

      return res
        .status(200)
        .json({ message: "Request sent successfully", request: newRequest });
    } catch (error) {
      console.error("Error sending request:", error);
      return res.status(500).json({ error: "Failed to send request" });
    }
  });

// update the request eligiblilty by admin
exports.updateRequestEligibility = (Model) =>
  asyncHandler(async (req, res, next) => {
    const requestId = req.params.id;
    const { Eligibility } = req.body;
    // Find the request by ID in the database
    const request = await Model.findByPk(requestId);

    // Check if the request exists
    if (!request) {
      return next(new ApiError(`Request not found`, 404));
    }
    // Update the Eligibility of the request
    request.Eligibility = Eligibility;
    await request.save();
    // Respond with a success message or the updated request
    res
      .status(200)
      .json({ message: "Request status updated successfully", request });
  });

exports.canSendRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assuming userId is part of the request body
  const request = req.user.type;
  if (request === null) {
    next();
  }

  if (request === "Master") {
    const masterRequests = await Master.findAll({
      where: {
        UserId: userId,
        Eligibility: "pending",
      },
    });
    // Check if there are pending requests in the Master table
    if (masterRequests.length > 0) {
      return next(
        new ApiError(
          `You can only send a new request after the previous request is proccessed`,
          400
        )
      );
    }
  }
  if (request === "Bachelor") {
    const bachelorRequests = await Bachelor.findAll({
      where: {
        UserId: userId,
        Eligibility: "pending",
      },
    });

    // Check if there are pending requests in the Bachelor table
    if (bachelorRequests.length > 0) {
      return next(
        new ApiError(
          `You can only send a new request after the previous request is proccessed`,
          400
        )
      );
    }
  }
  if (request === "PhD") {
    const phdRequests = await PhD.findAll({
      where: {
        UserId: userId,
        Eligibility: "pending",
      },
    });
    // Check if there are pending requests in the PhD table
    if (phdRequests.length > 0) {
      return next(
        new ApiError(
          `You can only send a new request after the previous request is proccessed`,
          400
        )
      );
    }
  }
  next();
});

exports.filterRequests = asyncHandler(async (req, res, next) => {
  let filterObject = {};

  if (req.user.role === "admin") {
    filterObject = {};
  }

  if (req.user.role === "employee") {
    filterObject = {
      employeeId: req.user.id,
    };
  } else if (req.user.role === "user") {
    filterObject = {
      UserId: req.user.id,
    };
  }
  req.filterObj = filterObject;
  console.log("filterObject:", filterObject); // Add this log statement
  next();
});
