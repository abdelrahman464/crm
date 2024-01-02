const { Service } = require("../models");
const handlerFactory = require("./handlerFactory");

// create  Service
exports.createtService = handlerFactory.createOne(Service);
// Get One Service
exports.getServiceById = handlerFactory.getOne(Service);

// update Service
exports.updateService = handlerFactory.updateOne(Service);

// Get All Services
exports.getAllServices = handlerFactory.getAll(Service, "Service");

// Delete One Service
exports.deleteService = handlerFactory.deleteOne(Service);
