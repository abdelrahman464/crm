const { CountryOfStudy } = require("../models");
const handlerFactory = require("./handlerFactory");

// create  Country
exports.createCountry = handlerFactory.createOne(CountryOfStudy);
// Get One Country
exports.getCountryById = handlerFactory.getOne(CountryOfStudy);

// update Country
exports.updateCountry = handlerFactory.updateOne(CountryOfStudy);

// Get All Country
exports.getAllCountries = handlerFactory.getAll(CountryOfStudy, "CountryOfStudy");

// Delete One Country
exports.deleteCountry = handlerFactory.deleteOne(CountryOfStudy);
