const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { PhD } = require("../models");
const ApiError = require("../utils/apiError");
const { sendRequest,updateRequest, getOne, getAll, deleteOne } = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploads = uploadMixOfImages([
  {
    name: "PersonalPicture",
    maxCount: 1,
  },
  {
    name: "BachelorsDegreeCertificateWithTranscript",
    maxCount: 1,
  },
  {
    name: "MastersDegreeCertificateWithTranscript",
    maxCount: 1,
  },
  {
    name: "EnglishTestResults",
    maxCount: 1,
  },
  {
    name: "CV",
    maxCount: 1,
  },
  {
    name: "TwoRecommendationLetters",
    maxCount: 1,
  },
  {
    name: "ExperienceLetter",
    maxCount: 1,
  },
  {
    name: "PersonalStatement",
    maxCount: 1,
  },
  {
    name: "ResearchProposal",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.PersonalPicture) {
    const pdfFile = req.files.PersonalPicture[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `PersonalPicture-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/PersonalPicture/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.PersonalPicture = pdfFileName;
    } else {
      return next(new ApiError("Invalid Personal Picture file format", 400));
    }
  }
  if (req.files.MastersDegreeCertificateWithTranscript) {
    const pdfFile = req.files.MastersDegreeCertificateWithTranscript[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `MastersDegreeCertificateWithTranscript-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/MastersDegreeCertificateWithTranscript/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.MastersDegreeCertificateWithTranscript = pdfFileName;
    } else {
      return next(
        new ApiError(
          "Invalid Masters DegreeCertificate With Transcript file format",
          400
        )
      );
    }
  }
  if (req.files.EnglishTestResults) {
    const pdfFile = req.files.EnglishTestResults[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `EnglishTestResults-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/EnglishTestResults/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.EnglishTestResults = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid English Test Results file format", 400)
      );
    }
  }
  if (req.files.BachelorsDegreeCertificateWithTranscript) {
    const pdfFile = req.files.BachelorsDegreeCertificateWithTranscript[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `BachelorsDegreeCertificateWithTranscript-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/BachelorsDegreeCertificateWithTranscript/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.BachelorsDegreeCertificateWithTranscript = pdfFileName;
    } else {
      return next(
        new ApiError(
          "Invalid Bachelors Degree Certificate With Transcript file format",
          400
        )
      );
    }
  }
  if (req.files.TwoRecommendationLetters) {
    const pdfFile = req.files.TwoRecommendationLetters[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `TwoRecommendationLetters-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/TwoRecommendationLetters/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.TwoRecommendationLetters = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid Two Recommendation Letters file format", 400)
      );
    }
  }
  if (req.files.ExperienceLetter) {
    const pdfFile = req.files.ExperienceLetter[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `ExperienceLetter-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Ph_D/ExperienceLetter/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.ExperienceLetter = pdfFileName;
    } else {
      return next(new ApiError("Invalid Experience Letter file format", 400));
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
      const wordPath = `uploads/Ph_D/PersonalStatement/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.PersonalStatement = wordFileName;
    } else {
      return next(new ApiError("Invalid Personal Statement file format", 400));
    }
  }
  if (req.files.ResearchProposal) {
    const wordFile = req.files.ResearchProposal[0];
    if (
      wordFile.mimetype === "application/msword" ||
      wordFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const wordFileName = `ResearchProposal-docx-${uuidv4()}-${Date.now()}.docx`;
      const wordPath = `uploads/Ph_D/ResearchProposal/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.ResearchProposal = wordFileName;
    } else {
      return next(new ApiError("Invalid Research Proposal file format", 400));
    }
  }

  next();
});

// send PhD Request
exports.sendBachelorRequest = sendRequest(PhD,"PhD");
// Get One PhD
exports.getPhDById = getOne(PhD);

// update request (eligible or not eligible)
exports.updatePhDRequest = updateRequest(PhD);
// Get All PhD
exports.getAllPhDs = getAll(PhD, "PhD");

// Delete One PhD
exports.deletePhD = deleteOne(PhD);
