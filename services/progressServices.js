const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Master, Bachelor, PhD, User, Order, RequestDoc } = require("../models");
const ApiError = require("../utils/apiError");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

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
    name: "applyingForVisa",
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
//@actore  employee
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
//---------------------------------------------------------------------------------- start step 1 *****************************************************
//upload Contract this if first step
//@role : employee
exports.uploadContract = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId, requestType } = req.params;

    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    const newrequestDocument = await RequestDoc.create({
      conract: req.body.conract,
    });

    //-------------------- !! START CREATION AND ASSIGNMENT !!   --------------------------
    if (requestType === "Master") {
      // realte the request with req_doc
      await Master.updateOne(
        { requestDocId: newrequestDocument.id },
        {
          where: { id: requestId },
        }
      );
    }
    //---------------   !  ELSE !    --------------------
    if (requestType === "Bachelor") {
      // realte the request with req_doc
      await Bachelor.updateOne(
        { requestDocId: newrequestDocument.id },
        {
          where: { id: requestId },
        }
      );
    }
    //---------------   !  ELSE !    --------------------
    if (requestType === "PhD") {
      // realte the request with req_doc
      await PhD.updateOne(
        { requestDocId: newrequestDocument.id },
        {
          where: { id: requestId },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "signed Contract uploaded successfuly" });
  });

//  upload signed Contract this if first step
//@ role : user
exports.uploadSignedContract = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const requestType = req.user.type;
    const { offerLetter } = req.body;

    //if null
    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------       ELSE     -------------------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------    !!  ELSE  !!  -------------------------------------

    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "signed Contract uploaded successfuly" });
  });
//---------------------------------------------------------------------------------- end step 1 --------------------------------------------

//---------------------------------------------------------------------------------- start step 2 *****************************************************
//pay the fees
//@access protected/user
exports.checkoutSessionToPayFees = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const request = req.user.type;
  let feesPrrice;
  if (request === "Bachelor") {
    //select object   --> get price
    feesPrrice = process.env.BachelorFeesPrices;
  } else if (request === "Master") {
    feesPrrice = process.env.MasterFeesPrices;
  } else if (request === "PhD") {
    feesPrrice = process.env.PhDFeesPrices;
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: feesPrrice * 100,
          currency: "usd",
          product_data: {
            name: req.user.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,

    client_reference_id: requestId,
    metadata: {
      feesType: "contract_fees",
    },
  });

  //3) send session to response
  res.status(200).json({ status: "success", session });
});
const createOrderPayFees = async (session) => {
  const requestId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;
  //type = metadata visa /contract
  const { feesType } = session.metadata;
  const user = await User.findOne({ email: session.customer_email });
  const request = user.type;

  const order = await Order.create({
    UserId: user.id,
    requstId: requestId,
    type: feesType,
    totalOrderPrice: orderPrice,
    isPaid: 1,
    paidAt: Date.now(),
  });

  if (order) {
    //got to next step
    if (request === "Bachelor") {
      const Therequest = await Bachelor.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "Master") {
      const Therequest = await Master.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "PhD") {
      const Therequest = await PhD.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    }
  }
};
// the webhook for pay fees
exports.webhookCheckoutPayFees = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.data.object.metadata.feesType === "contract_fees") {
    if (event.type === "checkout.session.completed") {
      createOrderPayFees(event.data.object);
    }
  }
  res.status(200).json({ received: true });
});
//-------------------------------------------------------------------------------- end step 2 --------------------------------------------

//------------------------------------------------------------------------------------ start step 3 *****************************************************
//  upload  offer letter this if third step
//@role : employee
exports.uploadOfferLetter = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId, requestType } = req.params;

    //get request

    //upload offer letter , create object

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: req.body.offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: req.body.offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------
    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { offerLetter: req.body.offerLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "signed Contract uploaded successfuly" });
  });

//  upload signed offer lettert this if third step
//@ role : user
exports.uploadSignedOfferLetter = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const requestType = req.user.type;
    const { signedOfferLetter } = req.body;

    //if null
    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { signedOfferLetter: signedOfferLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------       ELSE     -------------------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { signedOfferLetter: signedOfferLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------    !!  ELSE  !!  -------------------------------------

    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { signedOfferLetter: signedOfferLetter },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "signed Contract uploaded successfuly" });
  });
//------------------------------------------------------------------------------------end step 3 --------------------------------------------

//------------------------------------------------------------------------------------ start step 4 *****************************************************

//  upload MOHERE this if forth step
//@ role : user
exports.uploadMOHERE = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const requestType = req.user.type;
    const { MOHERE } = req.body;

    //if null
    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { MOHERE: MOHERE },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------       ELSE     -------------------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { MOHERE: MOHERE },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------    !!  ELSE  !!  -------------------------------------

    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { MOHERE: MOHERE },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res.status(200).json({ message: "MOHERE uploaded successfuly" });
  });
//------------------------------------------------------------------------------------end step 4 --------------------------------------------

//------------------------------------------------------------------------------------ start step 5 *****************************************************

//pay visa fees

//@access protected/user
exports.checkoutSessionToPayVisaFees = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const request = req.user.type;
  let feesPrrice;
  if (request === "Bachelor") {
    //select object   --> get price
    feesPrrice = process.env.BachelorFeesPrices;
  } else if (request === "Master") {
    feesPrrice = process.env.MasterFeesPrices;
  } else if (request === "PhD") {
    feesPrrice = process.env.PhDFeesPrices;
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: feesPrrice * 100,
          currency: "usd",
          product_data: {
            name: req.user.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,

    client_reference_id: requestId,
    metadata: {
      feesType: "visa_fees",
    },
  });

  //3) send session to response
  res.status(200).json({ status: "success", session });
});
const createOrderPayVisaFees = async (session) => {
  const requestId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;
  //type = metadata visa /contract
  const { feesType } = session.metadata;
  const user = await User.findOne({ email: session.customer_email });
  const request = user.type;

  const order = await Order.create({
    UserId: user.id,
    requstId: requestId,
    type: feesType,
    totalOrderPrice: orderPrice,
    isPaid: 1,
    paidAt: Date.now(),
  });

  if (order) {
    //got to next step
    if (request === "Bachelor") {
      const Therequest = await Bachelor.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "Master") {
      const Therequest = await Master.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "PhD") {
      const Therequest = await PhD.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    }
  }
};
// the webhook for pay fees
exports.webhookCheckoutPayVisaFees = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.data.object.metadata.feesType === "visa_fees") {
    if (event.type === "checkout.session.completed") {
      createOrderPayVisaFees(event.data.object);
    }
  }
  res.status(200).json({ received: true });
});

//------------------------------------------------------------------------------------end step 5 --------------------------------------------

//------------------------------------------------------------------------------------ start step 6 *****************************************************

//pay visa fees

//@access protected/user
exports.checkoutSessionToRegistrationFees = asyncHandler(
  async (req, res, next) => {
    const { requestId } = req.params;
    const request = req.user.type;
    let feesPrrice;
    if (request === "Bachelor") {
      //select object   --> get price
      feesPrrice = process.env.BachelorFeesPrices;
    } else if (request === "Master") {
      feesPrrice = process.env.MasterFeesPrices;
    } else if (request === "PhD") {
      feesPrrice = process.env.PhDFeesPrices;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: feesPrrice * 100,
            currency: "usd",
            product_data: {
              name: req.user.username,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}`,
      cancel_url: `${req.protocol}://${req.get("host")}`,
      customer_email: req.user.email,

      client_reference_id: requestId,
      metadata: {
        feesType: "registration_fees",
      },
    });

    //3) send session to response
    res.status(200).json({ status: "success", session });
  }
);
const createOrderPayRegistrationFees = async (session) => {
  const requestId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;
  //type = metadata visa /contract
  const { feesType } = session.metadata;
  const user = await User.findOne({ email: session.customer_email });
  const request = user.type;

  const order = await Order.create({
    UserId: user.id,
    requstId: requestId,
    type: feesType,
    totalOrderPrice: orderPrice,
    isPaid: 1,
    paidAt: Date.now(),
  });

  if (order) {
    //got to next step
    if (request === "Bachelor") {
      const Therequest = await Bachelor.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "Master") {
      const Therequest = await Master.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    } else if (request === "PhD") {
      const Therequest = await PhD.findByPk(requestId);

      Therequest.currentStep = "sending_offerLetter";
      await Therequest.save();
    }
  }
};
// the webhook for pay fees
exports.webhookCheckoutRegistrationFees = asyncHandler(
  async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.data.object.metadata.feesType === "registration_fees") {
      if (event.type === "checkout.session.completed") {
        createOrderPayRegistrationFees(event.data.object);
      }
    }
    res.status(200).json({ received: true });
  }
);

//------------------------------------------------------------------------------------end step 6 --------------------------------------------
//------------------------------------------------------------------------------------ start step 7 *****************************************************

//  upload ticket
//@ role : user
exports.uploadTicket = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const requestType = req.user.type;
    const { ticket } = req.body;

    //if null
    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { ticket: ticket },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------       ELSE     -------------------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { ticket: ticket },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------    !!  ELSE  !!  -------------------------------------

    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { ticket: ticket },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res.status(200).json({ message: "ticket uploaded successfuly" });
  });
//------------------------------------------------------------------------------------end step 7 --------------------------------------------
//------------------------------------------------------------------------------------ start step 8 *****************************************************

//  upload ticket
//@ role : user
exports.applyForVisa = () =>
  asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const requestType = req.user.type;

    //if null
    if (requestType === null) {
      return next(new ApiError(`there is no request for this user`, 404));
    }

    if (requestType === "Master") {
      const request = await Master.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is no request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { applyingForVisa: 1 },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------       ELSE     -------------------------------------
    if (requestType === "Bachelor") {
      const request = await Bachelor.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(
          new ApiError(`there is Bachelor request for this user`, 404)
        );
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { applyingForVisa: 1 },
        {
          where: { id: request.requestDocId },
        }
      );
    }
    //-----------------------------    !!  ELSE  !!  -------------------------------------

    if (requestType === "PhD") {
      const request = await PhD.findOne({
        where: {
          id: requestId,
        },
      });
      // Check if there requests in the Master table for this user
      if (request.length > 0) {
        return next(new ApiError(`there is PhD request for this user`, 404));
      }
      // updated the row of the request
      await RequestDoc.updateOne(
        { applyingForVisa: 1 },
        {
          where: { id: request.requestDocId },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "your request to visa sending successfuly" });
  });
//------------------------------------------------------------------------------------end step 8 --------------------------------------------
