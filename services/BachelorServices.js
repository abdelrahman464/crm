const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Bachelor, User ,RequestDoc} = require("../models");
const ApiError = require("../utils/apiError");
const {
  sendRequest,
  updateRequestEligibility,
  getOne,
  getAll,
  deleteOne,
  checkAuthorityRequest,
} = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploads = uploadMixOfImages([
  {
    name: "CV",
    maxCount: 1,
  },
  {
    name: "HighSchoolCertificate",
    maxCount: 1,
  },
  {
    name: "Passport",
    maxCount: 1,
  },
  {
    name: "PersonalPicture",
    maxCount: 1,
  },
  {
    name: "PersonalStatement",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.CV) {
    const pdfFile = req.files.CV[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `CV-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/cv/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.CV = pdfFileName;
    } else {
      return next(new ApiError("Invalid CV file format", 400));
    }
  }
  if (req.files.HighSchoolCertificate) {
    const pdfFile = req.files.HighSchoolCertificate[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `HighSchoolCertificate-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/HighSchoolCertificate/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.HighSchoolCertificate = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid HighSchoolCertificate file format", 400)
      );
    }
  }
  if (req.files.PersonalPicture) {
    const pdfFile = req.files.PersonalPicture[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `PersonalPicture-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/PersonalPicture/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.PersonalPicture = pdfFileName;
    } else {
      return next(new ApiError("Invalid PersonalPicture file format", 400));
    }
  }
  if (req.files.Passport) {
    const pdfFile = req.files.Passport[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `Passport-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/Passport/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.Passport = pdfFileName;
    } else {
      return next(new ApiError("Invalid Passport file format", 400));
    }
  }
  if (req.files.PersonalStatement) {
    const wordFile = req.files.PersonalStatement[0];
    if (
      wordFile.mimetype === "application/msword" ||
      wordFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const wordFileName = `PersonalStatement-docx-${uuidv4()}-${Date.now()}.docx`;
      const wordPath = `uploads/Bachelor/PersonalStatement/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.PersonalStatement = wordFileName;
    } else {
      return next(new ApiError("Invalid Personal Statement file format", 400));
    }
  }
  next();
});

//-------------------------------------------------------------------------------------------------------------------
// send  Bachelor Request
exports.sendBachelorRequest = sendRequest(Bachelor, "Bachelor");

//check If The User Or Employ That Can get
exports.checkAuthorityRequestBachelor = checkAuthorityRequest(Bachelor);
// Get One Bachelor
exports.getBachelorById = getOne(Bachelor, [
  {
    model: User,
    as: "UserDetails",
  },
  {
    model: User,
    as: "Employee",
  },
  {
    model: RequestDoc,
    as: "RequestDocumentDetails",
  },
]);

// update request (eligible or not eligible)
exports.updateBachelorRequestEligibility = updateRequestEligibility(Bachelor);

//update Bachelor by user that have made the request
exports.updateBachelorByUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const loggedInUserId = req.user.id; // Get the ID of the logged-in user

  // Find the request by ID and include the associated user
  const request = await Bachelor.findByPk(id);

  if (!request) {
    return next(new ApiError(`Request Not Found`, 404));
  }

  // Check if the logged-in user ID matches the UserID associated with the request
  if (request.UserId !== loggedInUserId) {
    return next(
      new ApiError(
        `Unauthorized. User does not have permission to update this request.`,
        403
      )
    );
  }

  const [affectedRowCount] = await Bachelor.update(
    {
      Passport: req.body.Passport,
      PersonalPicture: req.body.PersonalPicture,
      HighSchoolCertificate: req.body.HighSchoolCertificate,
      CV: req.body.CV,
      PersonalStatement: req.body.PersonalStatement,
      CountryOfStudy: req.body.CountryOfStudy,
      RequiredSpecialization: req.body.RequiredSpecialization,
      additionalService: req.body.additionalService,
    },
    {
      where: { id },
    }
  );

  if (affectedRowCount === 0) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  // Fetch the updated document after the update
  const updatedDocument = await Bachelor.findByPk(id);

  if (!updatedDocument) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  const updatedData = updatedDocument.get();
  res.status(200).json({ data: updatedData });
});
// Get All Bachelors
exports.getAllBachelors = getAll(Bachelor, "Bachelor", [
  {
    model: User,
    as: "UserDetails",
  },
  {
    model: User,
    as: "Employee",
  },
  {
    model: RequestDoc,
    as: "RequestDocumentDetails",
  },
]);

// Delete One Bachelor
exports.deleteBachelor = deleteOne(Bachelor);

