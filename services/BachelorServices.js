const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Bachelor } = require("../models");
const ApiError = require("../utils/apiError");
const {
  sendRequest,
  updateRequestEligibility,
  getOne,
  getAll,
  deleteOne,
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
  if (req.files.Passport) {
    const pdfFile = req.files.Passport[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `Passport-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/Passport/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.Passport = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid Passport file format", 400)
      );
    }
  }
  next();
});

//-------------------------------------------------------------------------------------------------------------------
// send  Bachelor Request
exports.sendBachelorRequest = sendRequest(Bachelor, "Bachelor");

// Get One Bachelor
exports.getBachelorById = getOne(Bachelor);

// update request (eligible or not eligible)
exports.updateBachelorRequest = updateRequestEligibility(Bachelor);

// Get All Bachelors
exports.getAllBachelors = getAll(Bachelor, "Bachelor");

// Delete One Bachelor
exports.deleteBachelor = deleteOne(Bachelor);
