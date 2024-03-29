const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const { Master, Bachelor, PhD, User } = require("../models");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

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

exports.getOne = (Model, include) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = { where: { id }, include };

    const document = await Model.findOne(query);

    if (!document) {
      return next(new ApiError(`Document Not Found`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName, include) =>
  asyncHandler(async (req, res) => {
    const searchQuery = req.query.keyword; // Assuming the search term is passed in the 'keyword' query parameter

    let filter = { ...req.filterObj };

    if (searchQuery) {
      let searchFilter;
      if (modelName === "User") {
        searchFilter = {
          [Op.or]: [{ username: { [Op.like]: `%${searchQuery}%` } }],
        };
      } else if (
        modelName === "Master" ||
        modelName === "Bachelor" ||
        modelName === "PHD"
      ) {
        searchFilter = {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } }, // Case-insensitive partial match on the 'title' field
            { CountryOfStudy: { [Op.like]: `%${searchQuery}%` } },
            { additionalService: { [Op.like]: `%${searchQuery}%` } },
          ],
        };
      } else {
        searchFilter = {
          [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
        };
      }
      filter = { ...filter, ...searchFilter }; // Merge the existing filter with the search filter
    }

    const documents = await Model.findAll({ where: filter, include });
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
exports.sendRequest = (Model, ModelName) =>
  asyncHandler(async (req, res) => {
    let obj;
    if (ModelName === "Bachelor") {
      obj = {
        UserId: req.user.id,
        title: "Bachelor",
        Passport: req.body.Passport,
        PersonalPicture: req.body.PersonalPicture,
        HighSchoolCertificate: req.body.HighSchoolCertificate,
        CV: req.body.CV,
        PersonalStatement: req.body.PersonalStatement,
        CountryOfStudy: req.body.CountryOfStudy,
        RequiredSpecialization: req.body.RequiredSpecialization,
        additionalService: req.body.additionalService,
      };
    }
    if (ModelName === "Master") {
      obj = {
        UserId: req.user.id,
        title: "Master",
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
        CountryOfStudy: req.body.CountryOfStudy,
        RequiredSpecialization: req.body.RequiredSpecialization,
        additionalService: req.body.additionalService,
      };
    }
    if (ModelName === "PHD") {
      obj = {
        UserId: req.user.id,
        title: "PHD",
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
        CountryOfStudy: req.body.CountryOfStudy,
        RequiredSpecialization: req.body.RequiredSpecialization,
        additionalService: req.body.additionalService,
      };
    }

    const newRequest = await Model.create(obj);

    if (!newRequest) {
      return new ApiError(`Request not sent`, 404);
    }
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
    // Check if the associated user exists
    const requestUser = await User.findByPk(request.UserId);
    if (!requestUser) {
      return next(new ApiError(`User is not Avaliable any more`, 401));
    }
    // Update the Eligibility of the request
    request.Eligibility = Eligibility;
    await request.save();
    // Respond with a success message or the updated request
    const message = `congratulations Your ${request.title} Request Is Eligible `;
    await sendEmail({
      to: requestUser.email,
      subject: " Hamad-Education Notification",
      text: message,
    });
    res
      .status(200)
      .json({ message: "Request status updated successfully", request });
  });

exports.canSendRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assuming userId is part of the request body
  const request = req.user.type;

  if (request === null) {
    return next();
  }

  const checkRequests = async (Model) => {
    const requests = await Model.findAll({
      where: {
        UserId: userId,
      },
    });

    const hasPendingRequests = requests.some(
      (r) => r.Eligibility === "pending"
    );

    const inProgressRequests = requests.some((r) => r.currentStep !== "Done");

    return { hasPendingRequests, inProgressRequests };
  };

  let errorMessage = "";

  switch (request) {
    case "Master": {
      const { hasPendingRequests, inProgressRequests } = await checkRequests(
        Master
      );
      if (hasPendingRequests || inProgressRequests) {
        errorMessage = `You can only send a new request after the previous request is processed`;
      }
      break;
    }
    case "Bachelor": {
      const { hasPendingRequests, inProgressRequests } = await checkRequests(
        Bachelor
      );
      if (hasPendingRequests || inProgressRequests) {
        errorMessage = `You can only send a new request after the previous request is processed`;
      }
      break;
    }
    case "PhD": {
      const { hasPendingRequests, inProgressRequests } = await checkRequests(
        PhD
      );
      if (hasPendingRequests || inProgressRequests) {
        errorMessage = `You can only send a new request after the previous request is processed`;
      }
      break;
    }
    default:
      break;
  }

  if (errorMessage) {
    return next(new ApiError(errorMessage, 400));
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
  next();
});
//check If The User Or Employ That Can get
exports.checkAuthorityRequest = (Model) =>
  asyncHandler(async (req, res, next) => {
    //if admin skip to next middlware
    if (req.user.role === "admin") {
      next();
    }
    //get model by id
    const { id } = req.params;
    const query = { where: { id } };

    const document = await Model.findOne(query);

    //if employee check if the employee is the one that has been assigned to the request
    if (req.user.role === "employee") {
      if (document.employeeId.toString() !== req.user.id.toString()) {
        return next(
          new ApiError(`You are not allowed to get this document`, 403)
        );
      }
    }
    //if user check if the user is the one that has been created the request
    else if (req.user.role === "user") {
      if (document.UserId !== req.user.id) {
        return next(
          new ApiError(`You are not allowed to get this document`, 403)
        );
      }
    }
    next();
  });

// exports.updateRequstPrice = (Model) =>
// asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const [affectedRowCount] = await Model.update({}, {
//     where: { id },
//   });

//   if (affectedRowCount === 0) {
//     return next(new ApiError(`Document Not Found`, 404));
//   }

//   // Fetch the updated document after the update
//   const updatedDocument = await Model.findByPk(id);

//   if (!updatedDocument) {
//     return next(new ApiError(`Document Not Found`, 404));
//   }

//   const updatedData = updatedDocument.get();
//   res.status(200).json({ data: updatedData });
// });
