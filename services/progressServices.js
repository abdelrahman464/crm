const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Master, Bachelor, PHD, User, Order, RequestDoc } = require("../models");
const ApiError = require("../utils/apiError");
const { createNotification } = require("./notificationService");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const sendEmail = require("../utils/sendEmail");

exports.uploads = uploadMixOfImages([
  {
    name: "contract",
    maxCount: 1,
  },
  {
    name: "signedContract",
    maxCount: 1,
  },
  {
    name: "contractFeesFile",
    maxCount: 1,
  },
  {
    name: "offerLetter",
    maxCount: 1,
  },
  {
    name: "signedOfferLetter",
    maxCount: 1,
  },
  {
    name: "MOHERE",
    maxCount: 1,
  },
  {
    name: "MOHEREApproval",
    maxCount: 1,
  },
  {
    name: "EVAL",
    maxCount: 1,
  },
  {
    name: "visaFeesFile",
    maxCount: 1,
  },
  {
    name: "EMGS",
    maxCount: 1,
  },
  {
    name: "finalAcceptanceLetter",
    maxCount: 1,
  },
  {
    name: "registrationFeesFile",
    maxCount: 1,
  },
  {
    name: "applyingForVisa",
    maxCount: 1,
  },
  {
    name: "ticket",
    maxCount: 1,
  },
]);
// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.contract) {
    const pdfFile = req.files.contract[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `contract-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/contract/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.contract = pdfFileName;
    } else {
      return next(new ApiError("Invalid Contract file format", 400));
    }
  }
  if (req.files.signedContract) {
    const pdfFile = req.files.signedContract[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `signedContract-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/signedContract/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.signedContract = pdfFileName;
    } else {
      return next(new ApiError("Invalid signedContract file format", 400));
    }
  }
  if (req.files.contractFeesFile) {
    const pdfFile = req.files.contractFeesFile[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `contractFeesFile-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/contractFeesFile/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.contractFeesFile = pdfFileName;
    } else {
      return next(new ApiError("Invalid contract Fees File file format", 400));
    }
  }
  if (req.files.offerLetter) {
    const pdfFile = req.files.offerLetter[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `offerLetter-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/offerLetter/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.offerLetter = pdfFileName;
    } else {
      return next(new ApiError("Invalid offerLetter file format", 400));
    }
  }
  if (req.files.signedOfferLetter) {
    const pdfFile = req.files.signedOfferLetter[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `signedOfferLetter-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/signedOfferLetter/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.signedOfferLetter = pdfFileName;
    } else {
      return next(new ApiError("Invalid signedOfferLetter file format", 400));
    }
  }
  if (req.files.MOHERE) {
    const pdfFile = req.files.MOHERE[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `MOHERE-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/MOHERE/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.MOHERE = pdfFileName;
    } else {
      return next(new ApiError("Invalid MOHERE file format", 400));
    }
  }
  if (req.files.MOHEREApproval) {
    const pdfFile = req.files.MOHEREApproval[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `MOHEREApproval-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/MOHEREApproval/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.MOHEREApproval = pdfFileName;
    } else {
      return next(new ApiError("Invalid MOHERE Approval file format", 400));
    }
  }
  if (req.files.EVAL) {
    const pdfFile = req.files.EVAL[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `EVAL-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/EVAL/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.EVAL = pdfFileName;
    } else {
      return next(new ApiError("Invalid EVAL file format", 400));
    }
  }
  if (req.files.finalAcceptanceLetter) {
    const pdfFile = req.files.finalAcceptanceLetter[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `finalAcceptanceLetter-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/finalAcceptanceLetter/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.finalAcceptanceLetter = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid final Acceptance Letter file format", 400)
      );
    }
  }
  if (req.files.visaFeesFile) {
    const pdfFile = req.files.visaFeesFile[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `visaFeesFile-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/visaFeesFile/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.visaFeesFile = pdfFileName;
    } else {
      return next(new ApiError("Invalid visa Fees File file format", 400));
    }
  }
  if (req.files.EMGS) {
    const pdfFile = req.files.EMGS[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `EMGS-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/EMGS/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.EMGS = pdfFileName;
    } else {
      return next(new ApiError("Invalid EMGS file format", 400));
    }
  }
  if (req.files.registrationFeesFile) {
    const pdfFile = req.files.registrationFeesFile[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `registrationFeesFile-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/registrationFeesFile/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.registrationFeesFile = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid registration Fees File file format", 400)
      );
    }
  }
  if (req.files.ticket) {
    const pdfFile = req.files.ticket[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `ticket-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/RequestDocument/ticket/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.ticket = pdfFileName;
    } else {
      return next(new ApiError("Invalid ticket file format", 400));
    }
  }

  next();
});

const createOrder = async (requestId, requestType, totalOrderPrice, nextStep) => {
 
  try {
    const order = await Order.create({
      requestId: requestId,
      requestType: requestType,
      type: nextStep,
      totalOrderPrice: totalOrderPrice,
    });
    return order ? true : false;
  } catch (error) {
    console.error("Error creating order:", error);
    return error;  // Return the error for further inspection
  }
};


//-----------------------------------------------------------------------------------
const steps = [
  "sign_contract",
  "contract_fees",
  "sending_offerLetter",
  "deliver_and_sign_offerLetter",
  "get_copy_of_mohere",
  "mohere_approval",
  "visa_fees",
  "getting_EMGS_approval",
  "EVAL",
  "registration_fees",
  "getting_final_acceptance_letter",
  "recieving_ticket_copy",
  "applying_for_SEV",
  "arranging_airport_pickup",
  "Done",
];
// eslint-disable-next-line no-shadow
exports.nextStep = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const { totalOrderPrice } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let modelToUpdate;
  switch (requestType.toLowerCase()) {
    case "bachelor":
      modelToUpdate = Bachelor;
      break;
    case "master":
      modelToUpdate = Master;
      break;
    case "phd":
      modelToUpdate = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }
  // Check if the request exists
  const request = await modelToUpdate.findByPk(requestId);
  if (!request) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  // Check if the associated user exists
  const requestUser = await User.findByPk(request.UserId);
  if (!requestUser) {
    return next(new ApiError(`User is not Avaliable any more`, 401));
  }
  //-----------------------------
  //make a middleware for it
  if (req.user.role !== "admin") {
    const requestEmployee = await User.findByPk(request.employeeId);
    if (!requestEmployee) {
      return next(
        new ApiError(`You are not allowed to access this route`, 401)
      );
    }
  }
  //-----------------------------

  // Get the current status index
  const currentStatusIndex = steps.indexOf(request.currentStep);

  // Check if the current status is not in the steps array
  if (currentStatusIndex === -1) {
    return next(new ApiError(`Invalid current currentStep`, 400));
  }

  // Check if the current status is the last one in the steps array
  if (currentStatusIndex === steps.length - 1) {
    return res.status(400).json({
      msg: `Request is already in the final step`,
    });
  }

  // Get the next status
  const nextStep = steps[currentStatusIndex + 1];

  //------------------ Create UnPaid Order
  if (
    nextStep === "contract_fees" ||
    nextStep === "visa_fees" ||
    nextStep === "registration_fees"
  ) {
    if (!totalOrderPrice && totalOrderPrice > 0) {
      return next(
        new ApiError(
          `totalOrderPrice is required for nextStep ${nextStep} and must be greater than 0`,
          400
        )
      );
    }

    const flag = await createOrder(
      requestId,
      requestType,
      totalOrderPrice,
      nextStep
    );
    if (flag === false) {
      return next(new ApiError(`Failed to create order`, 500));
    }
  }
  //-----------------------------------------------
  // Update the currentStep to the next step
  const [affectedRowCount] = await modelToUpdate.update(
    { currentStep: nextStep },
    { where: { id: requestId } }
  );

  if (affectedRowCount === 0) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  // Create notification
  const message = `Your request has been updated to ${nextStep} by ${req.user.username}`;
  await createNotification(request.UserId, message, request.id);
  // send notification to user email
  await sendEmail({
    to: requestUser.email,
    subject: " Hamad-Education Notification",
    text: message,
  });

  res.status(200).json({
    msg: `Request updated successfully, Current Step is ${nextStep}`,
  });
});
//---------------------------------------------------------------------------------- start step 1 *****************************************************
//upload Contract this if first step
//@role : employee

// we need calidation here to ensure that the empolyee who upload the contract is the one who assigned to request
exports.uploadContract = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;

  if (!requestType) {
    return next(new ApiError(`There is no request type specified`, 404));
  }

  const newRequestDocument = await RequestDoc.create({
    contract: req.body.contract,
  });

  let modelToUpdate;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      modelToUpdate = Bachelor;
      break;
    case "master":
      modelToUpdate = Master;
      break;
    case "phd":
      modelToUpdate = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  if (modelToUpdate) {
    const [affectedRowCount] = await modelToUpdate.update(
      { requestDocId: newRequestDocument.id },
      { where: { id: requestId } }
    );

    if (affectedRowCount === 0) {
      return next(new ApiError(`Document Not Found`, 404));
    }

    // Fetch the user associated with the request
    const request = await modelToUpdate.findByPk(requestId);
    const user = await User.findByPk(request.UserId);

    if (!user) {
      return next(new ApiError(`User Not Found`, 404));
    }

    // Create notification for the user
    const message = `A new contract has been uploaded for your ${requestType} request`;
    await createNotification(user.id, message, requestId);
    // send notification to user email
    await sendEmail({
      to: user.email,
      subject: " Hamad-Education Notification",
      text: message,
    });
  }

  return res.status(200).json({
    message: "Contract uploaded successfully",
    newRequestDocument: newRequestDocument,
  });
});

//  upload signed Contract this if first step
//@ role : user
exports.uploadSignedContract = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { signedContract } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  // gathering data from request
  const { requestDocId, employeeId } = request;

  if (!requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  // Update the RequestDoc with signedContract
  const [updatedRowCount] = await RequestDoc.update(
    { signedContract },
    { where: { id: requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A signed contract has been uploaded for a request "${requestType}" assigned to you, user: ${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  // Fetch and return the updated request document
  const updatedRequestDoc = await RequestDoc.findByPk(requestDocId);

  return res.status(200).json({
    message: "uploadSignedContract uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload contract Fees File this if first step
//@ role : user
exports.uploadcontractFeesFile = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { contractFeesFile } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  // gathering data from request
  const { requestDocId, employeeId } = request;

  if (!requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  // Update the RequestDoc with signedContract
  const [updatedRowCount] = await RequestDoc.update(
    { contractFeesFile },
    { where: { id: requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A contract Fees File has been uploaded for a request "${requestType}" assigned to you, user: ${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  // Fetch and return the updated request document
  const updatedRequestDoc = await RequestDoc.findByPk(requestDocId);

  return res.status(200).json({
    message: "contract Fees File uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//---------------------------------------------------------------------------------- end step 1 --------------------------------------------

//---------------------------------------------------------------------------------- start step 2 *****************************************************
//pay the fees
//@access protected/user
exports.checkoutSessionToPayFees = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;

  //----------------------select request
  let Model;
  switch (requestType.toLowerCase()) {
    case "bachelor":
      Model = Bachelor;
      break;
    case "master":
      Model = Master;
      break;
    case "phd":
      Model = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }
  // Check if the request exists
  const request = await Model.findByPk(requestId);
  if (!request) {
    return next(new ApiError(`Document Not Found`, 404));
  }
  //-----------------------------
  //select from order where requestId and requestType
  const order = await Order.findOne({
    requestId,
    requestType,
    type: request.currentStep,
  });

  if (!order) {
    return next(
      new ApiError(
        `your employee didn't assign you ${request.currentStep}`,
        404
      )
    );
  }
  const totalFees = order.totalOrderPrice;
  //------------------------------
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalFees * 100,
          currency: "usd",
          product_data: {
            name: req.user.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `https://www.hamad-edu.com/profile`,
    cancel_url: `https://www.hamad-edu.com`,
    customer_email: req.user.email,

    client_reference_id: requestId,
    metadata: {
      feesType: request.currentStep,
      requestType: requestType,
    },
  });

  //3) send session to response
  res.status(200).json({ status: "success", session });
});

const updateOrderFees = async (session) => {
  const requestId = session.client_reference_id;
  //type = metadata visa /contract
  const { feesType, requestType } = session.metadata;

  let Model;
  switch (requestType.toLowerCase()) {
    case "bachelor":
      Model = Bachelor;
      break;
    case "master":
      Model = Master;
      break;
    case "phd":
      Model = PHD;
      break;
    default:
  }

  const [affectedRowCount] = await Order.update(
    {
      isPaid: true,
      paidAt: new Date(), // Use new Date() to get the current date and time
    },
    {
      where: { requestId, requestType, type: feesType },
    }
  );

  if (affectedRowCount !== 0) {
    // Get and update the request's current step
    const TheRequest = await Model.findByPk(requestId);
    if (TheRequest) {
      const currentStatusIndex = steps.indexOf(TheRequest.currentStep);
      const nextStep = steps[currentStatusIndex + 1];

      if (nextStep) {
        TheRequest.currentStep = nextStep;
        await TheRequest.save();
      }
    }
  }
};
// the webhook for pay fees
exports.webhookCheckoutPayFees = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    await updateOrderFees(event.data.object);
  }

  res.status(200).json({ received: true });
});
//------------------------------------------------------------------------------------ start step 3 *****************************************************
//  upload  offer letter this if third step
//@role : employee
exports.uploadOfferLetter = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const employeeId = req.user.id;
  // Check if requestType is valid
  if (!["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid request type`, 400));
  }

  let requestModel;

  // Select the appropriate model based on the requestType
  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: {
      id: requestId,
    },
  });

  // Check if the request exists
  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Check if there is a requestDocId associated with the request
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }
  // Ensure the authenticated employee matches the employee in the request
  if (employeeId !== request.employeeId) {
    return next(
      new ApiError(`Unauthorized: Employee mismatch for this request`, 403)
    );
  }

  // Update the RequestDoc with the offer letter
  const [updatedRowCount] = await RequestDoc.update(
    { offerLetter: req.body.offerLetter },
    {
      where: { id: request.requestDocId },
    }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the user associated with the request
  const user = await User.findByPk(request.UserId);

  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  // Create notification for the user
  const message = `An offer letter has been uploaded for your ${requestType} request`;
  await createNotification(user.id, message, requestId);
  // send notification to user email
  await sendEmail({
    to: user.email,
    subject: " Hamad-Education Notification",
    text: message,
  });
  // Fetch the updated RequestDoc
  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "Offer letter uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload signed offer lettert this if third step
//@ role : user
exports.uploadSignedOfferLetter = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { signedOfferLetter } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }
  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  const [updatedRowCount] = await RequestDoc.update(
    { signedOfferLetter },
    { where: { id: request.requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(request.employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A signed offer letter has been uploaded for a request "${requestType}" assigned to you, user:${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "Signed offer letter uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//------------------------------------------------
//  upload MOHERE this if forth step
//@ role : user
exports.uploadMOHERE = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { MOHERE } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }
  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  const [updatedRowCount] = await RequestDoc.update(
    { MOHERE },
    { where: { id: request.requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(request.employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A MOHERE has been uploaded for a request "${requestType}" assigned to you, user:${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "Signed offer letter uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload MOHERE Approval this if third step
//@role : employee
exports.uploadMOHEREApproval = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const employeeId = req.user.id;
  // Check if requestType is valid
  if (!["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid request type`, 400));
  }

  let requestModel;

  // Select the appropriate model based on the requestType
  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: {
      id: requestId,
    },
  });

  // Check if the request exists
  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Check if there is a requestDocId associated with the request
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }
  // Ensure the authenticated employee matches the employee in the request
  if (employeeId !== request.employeeId) {
    return next(
      new ApiError(`Unauthorized: Employee mismatch for this request`, 403)
    );
  }

  // Update the RequestDoc with the offer letter
  const [updatedRowCount] = await RequestDoc.update(
    { MOHEREApproval: req.body.MOHEREApproval },
    {
      where: { id: request.requestDocId },
    }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the user associated with the request
  const user = await User.findByPk(request.UserId);

  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  // Create notification for the user
  const message = `An MOHERE has been uploaded for your ${requestType} request`;
  await createNotification(user.id, message, requestId);
  // send notification to user email
  await sendEmail({
    to: user.email,
    subject: " Hamad-Education Notification",
    text: message,
  });
  // Fetch the updated RequestDoc
  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "MOHERE Approval uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload EMGS this if third step
//@role : employee
exports.uploadEMGS = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const employeeId = req.user.id;
  // Check if requestType is valid
  if (!["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid request type`, 400));
  }

  let requestModel;

  // Select the appropriate model based on the requestType
  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: {
      id: requestId,
    },
  });

  // Check if the request exists
  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Check if there is a requestDocId associated with the request
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }
  // Ensure the authenticated employee matches the employee in the request
  if (employeeId !== request.employeeId) {
    return next(
      new ApiError(`Unauthorized: Employee mismatch for this request`, 403)
    );
  }

  // Update the RequestDoc with the offer letter
  const [updatedRowCount] = await RequestDoc.update(
    { EMGS: req.body.EMGS },
    {
      where: { id: request.requestDocId },
    }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the user associated with the request
  const user = await User.findByPk(request.UserId);

  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  // Create notification for the user
  const message = `An EMGS has been uploaded for your ${requestType} request`;
  await createNotification(user.id, message, requestId);
  // send notification to user email
  await sendEmail({
    to: user.email,
    subject: " Hamad-Education Notification",
    text: message,
  });
  // Fetch the updated RequestDoc
  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "EMGS uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload EVAL this if third step
//@role : employee
exports.uploadEVAL = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const employeeId = req.user.id;
  // Check if requestType is valid
  if (!["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid request type`, 400));
  }

  let requestModel;

  // Select the appropriate model based on the requestType
  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }
  const request = await requestModel.findOne({
    where: {
      id: requestId,
    },
  });

  // Check if the request exists
  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Check if there is a requestDocId associated with the request
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }
  // Ensure the authenticated employee matches the employee in the request
  if (employeeId !== request.employeeId) {
    return next(
      new ApiError(`Unauthorized: Employee mismatch for this request`, 403)
    );
  }

  // Update the RequestDoc with the offer letter
  const [updatedRowCount] = await RequestDoc.update(
    { EVAL: req.body.EVAL },
    {
      where: { id: request.requestDocId },
    }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the user associated with the request
  const user = await User.findByPk(request.UserId);

  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  // Create notification for the user
  const message = `An EVAL has been uploaded for your ${requestType} request`;
  await createNotification(user.id, message, requestId);
  // send notification to user email
  await sendEmail({
    to: user.email,
    subject: " Hamad-Education Notification",
    text: message,
  });
  // Fetch the updated RequestDoc
  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "EVAL uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});
//  upload finalAcceptanceLetter
//@role : employee
exports.uploadfinalAcceptanceLetter = asyncHandler(async (req, res, next) => {
  const { requestId, requestType } = req.params;
  const employeeId = req.user.id;
  // Check if requestType is valid
  if (!["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid request type`, 400));
  }

  let requestModel;

  // Select the appropriate model based on the requestType
  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: {
      id: requestId,
    },
  });

  // Check if the request exists
  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Check if there is a requestDocId associated with the request
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }
  // Ensure the authenticated employee matches the employee in the request
  if (employeeId !== request.employeeId) {
    return next(
      new ApiError(`Unauthorized: Employee mismatch for this request`, 403)
    );
  }

  // Update the RequestDoc with the offer letter
  const [updatedRowCount] = await RequestDoc.update(
    { finalAcceptanceLetter: req.body.finalAcceptanceLetter },
    {
      where: { id: request.requestDocId },
    }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the user associated with the request
  const user = await User.findByPk(request.UserId);

  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  // Create notification for the user
  const message = `An EVAL has been uploaded for your ${requestType} request`;
  await createNotification(user.id, message, requestId);
  // send notification to user email
  await sendEmail({
    to: user.email,
    subject: " Hamad-Education Notification",
    text: message,
  });
  // Fetch the updated RequestDoc
  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "EVAL uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//  upload visa Fees File this if first step
//@ role : user
exports.uploadvisaFeesFile = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { visaFeesFile } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  // gathering data from request
  const { requestDocId, employeeId } = request;

  if (!requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  // Update the RequestDoc with signedContract
  const [updatedRowCount] = await RequestDoc.update(
    { visaFeesFile },
    { where: { id: requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A visa Fees File has been uploaded for a request "${requestType}" assigned to you, user: ${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  // Fetch and return the updated request document
  const updatedRequestDoc = await RequestDoc.findByPk(requestDocId);

  return res.status(200).json({
    message: "visa Fees File uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//  upload registration Fees File this if first step
//@ role : user
exports.uploadregistrationFeesFile = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { registrationFeesFile } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }

  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }

  // gathering data from request
  const { requestDocId, employeeId } = request;

  if (!requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  // Update the RequestDoc with signedContract
  const [updatedRowCount] = await RequestDoc.update(
    { registrationFeesFile },
    { where: { id: requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A registration Fees File has been uploaded for a request "${requestType}" assigned to you, user: ${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  // Fetch and return the updated request document
  const updatedRequestDoc = await RequestDoc.findByPk(requestDocId);

  return res.status(200).json({
    message: "registration Fees File uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//  upload ticket
//@ role : user
exports.uploadTicket = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;
  const { ticket } = req.body;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }
  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  const [updatedRowCount] = await RequestDoc.update(
    { ticket },
    { where: { id: request.requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(request.employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A ticket document has been uploaded for a request assigned to you, user:${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "Ticket uploaded successfully",
    requestDoc: updatedRequestDoc,
  });
});

//  apply for SEV
//@ role : user
exports.applyFoSEV = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const requestType = req.user.type;

  if (!requestType || !["Bachelor", "Master", "PHD"].includes(requestType)) {
    return next(new ApiError(`Invalid or missing request type`, 400));
  }

  let requestModel;

  switch (requestType.toLowerCase()) {
    case "bachelor":
      requestModel = Bachelor;
      break;
    case "master":
      requestModel = Master;
      break;
    case "phd":
      requestModel = PHD;
      break;
    default:
      return next(new ApiError(`Invalid request type`, 400));
  }

  const request = await requestModel.findOne({
    where: { id: requestId },
  });

  if (!request) {
    return next(new ApiError(`No request found for this user`, 404));
  }
  // Ensure the authenticated user sent this request
  if (request.UserId !== req.user.id) {
    return next(
      new ApiError(`Unauthorized: You did not send this request`, 403)
    );
  }
  if (!request.requestDocId) {
    return next(new ApiError(`No associated request document found`, 404));
  }

  const [updatedRowCount] = await RequestDoc.update(
    { applyingForSEV: 1 },
    { where: { id: request.requestDocId } }
  );

  if (updatedRowCount === 0) {
    return next(new ApiError(`Failed to update request document`, 500));
  }

  // Fetch the employee associated with the request
  const employee = await User.findByPk(request.employeeId);

  if (!employee) {
    return next(new ApiError(`Employee Not Found`, 404));
  }

  // Create notification for the employee
  const message = `A visa application has been requested for a request assigned to you, user:${req.user.username}`;
  await createNotification(employee.id, message, requestId);

  const updatedRequestDoc = await RequestDoc.findByPk(request.requestDocId);

  return res.status(200).json({
    message: "Your request for a SVE has been sent successfully",
    requestDoc: updatedRequestDoc,
  });
});

//------------------------------------------------------------------------------------end step 8 --------------------------------------------
