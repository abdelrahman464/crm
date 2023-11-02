const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
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
    console.log(req.body);
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
    const searchQuery = req.query.keyword; // Assuming the search term is passed in the 'q' query parameter

    let filter = {};
    if (searchQuery) {
      if (modelName === "User") {
        filter = {
          [Op.or]: [{ username: { [Op.like]: `%${searchQuery}%` } }],
        };
      } else {
        filter = {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } }, // Case-insensitive partial match on the 'name' field
            // Add more fields here if you want to search on additional fields
          ],
        };
      }
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
    let obj = {};
    if (ModelName === "Bachelor") {
      obj = {
        PersonalPicture: req.body.PersonalPicture,
        HighSchoolCertificate: req.body.HighSchoolCertificate,
        CV: req.body.CV,
        PersonalStatement: req.body.PersonalStatement,
      };
    }
    if (ModelName === "Master") {
      obj = {
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
    const newRequest = await Model.create(obj);

    // Respond with a success message or the new request object
    return res
      .status(200)
      .json({ message: "Request sent successfully", request: newRequest });
  });

// update the request eligiblilty by admin
exports.updateRequest = (Model) =>
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
