const multer = require("multer");

const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //memory stroge engine
  const multerStorage = multer.memoryStorage();

  const multterFilter = function (req, file, cb) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",  // Add this for Word files
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Add this for Word files
    ];
   

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images, PDFs, and Word documents are allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multterFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields)