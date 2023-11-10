const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Master, Bachelor, PhD, RequestDocument } = require("../models");
const ApiError = require("../utils/apiError");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploads = uploadMixOfImages([
  {
    name: "signedConract",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.signedConract) {
    const pdfFile = req.files.signedConract[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `signedConract-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/signedConract/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.signedConract = pdfFileName;
    } else {
      return next(new ApiError("Invalid signed Conract file format", 400));
    }
  }

  next();
});

exports.nextStep = (requestName, stepName) =>
  asyncHandler(async (req, res, next) => {
    const requestId = req.params.id;

    // Find the request by ID in the database
    if (requestName === "Bachelor") {
      const [affectedRowCount] = await Bachelor.update(
        { currentStep: stepName },
        {
          where: { requestId },
        }
      );

      if (affectedRowCount === 0) {
        return next(new ApiError(`Document Not Found`, 404));
      }
    } else if (requestName === "Master") {
      const [affectedRowCount] = await Master.update(
        { currentStep: stepName },
        {
          where: { requestId },
        }
      );

      if (affectedRowCount === 0) {
        return next(new ApiError(`Document Not Found`, 404));
      }
    } else if (requestName === "PHD") {
      const [affectedRowCount] = await PhD.update(
        { currentStep: stepName },
        {
          where: { requestId },
        }
      );

      if (affectedRowCount === 0) {
        return next(new ApiError(`Document Not Found`, 404));
      }
    }

    res.status(200).json({ msg: "requst updated successfully" });
  });

//  upload signed Contract this if first step
exports.uploadSignedContract = () =>
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const request = req.user.type;

    if (request === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (request === "Master") {
      const RequestDoc = await RequestDocument.create({
        signedConract: req.body.signedConract,
      });

      const masterRequests = await Master.findOne({
        where: {
          UserId: userId,
        },
      });
      // Check if there requests in the Master table for this user
      if (masterRequests.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // realte the request with req_doc
      await Master.updateOne(
        { requestDocId: RequestDoc },
        {
          where: { id: masterRequests.id },
        }
      );
    }
    if (request === "Bachelor") {
      const RequestDoc = await RequestDocument.create({
        signedConract: req.body.signedConract,
      });

      const BachelorRequests = await Bachelor.findOne({
        where: {
          UserId: userId,
        },
      });
      // Check if there requests in the Master table for this user
      if (BachelorRequests.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // realte the request with req_doc
      await Bachelor.updateOne(
        { requestDocId: RequestDoc },
        {
          where: { id: BachelorRequests.id },
        }
      );
    }
    if (request === "PhD") {
      const RequestDoc = await RequestDocument.create({
        signedConract: req.body.signedConract,
      });

      const PhDRequests = await PhD.findOne({
        where: {
          UserId: userId,
        },
      });
      // Check if there requests in the Master table for this user
      if (PhDRequests.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // realte the request with req_doc
      await PhD.updateOne(
        { requestDocId: RequestDoc },
        {
          where: { id: PhDRequests.id },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "signed Contract uploaded successfuly" });
  });
