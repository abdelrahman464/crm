const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const fs = require("fs-extra");
const { CountryOfStudy } = require("../models");
const handlerFactory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");

exports.uploads = uploadMixOfImages([
  {
    name: "image",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.image && req.files.image.length) {
    const imageFile = req.files.image[0];
    if (imageFile.mimetype === "image/jpeg") {
      const imageFileName = `image-${uuidv4()}-${Date.now()}.jpeg`;
      const imagePath = `uploads/countries/${imageFileName}`;

      // Resize the image using Sharp or any other library
      const resizedImageBuffer = await sharp(imageFile.buffer).toBuffer();

      // Write the resized image to the file system
      await fs.writeFile(imagePath, resizedImageBuffer);
      req.body.image = imageFileName;
    } else {
      return next(new ApiError("Invalid image file format", 400));
    }
  } else {
    return next(new ApiError("No image file uploaded", 400));
  }
  next();
});
// create  Country
exports.createCountry = handlerFactory.createOne(CountryOfStudy);
// Get One Country
exports.getCountryById = handlerFactory.getOne(CountryOfStudy);

// update Country
exports.updateCountry = handlerFactory.updateOne(CountryOfStudy);

// Get All Country
exports.getAllCountries = handlerFactory.getAll(
  CountryOfStudy,
  "CountryOfStudy"
);

// Delete One Country
exports.deleteCountry = handlerFactory.deleteOne(CountryOfStudy);
