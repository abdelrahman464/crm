const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {Request}=require('../../models')



exports.updateRequestValidator = [
  check("id")
    .isUUID()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
       Request.findById(val).then((request) => {
        //check if comment exists
        if (!request) {
          return Promise.reject(new Error('request not found'));
        }
        if (request.UserId.toString() !== req.user.id.toString()) {
          return Promise.reject(
            new Error('Your are not allowed to perform this action')
          );
        }
      }
      
      
      )
    ),

  validatorMiddleware,
];
exports.getRequestValidator = [
  check("id").isUUID().withMessage("Invalid Requst id format"),
  validatorMiddleware,
];
