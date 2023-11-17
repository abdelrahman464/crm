const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const {
  Master,
  Bachelor,
  PhD,
  RequestDocument,
  User,
  Order,
} = require("../models");
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
//pay the fees

//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSessionToPayFees = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const request = req.user.type;
  let feesPrrice;
  if (request === "Bachelor") {
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
  });

  //3) send session to response
  res.status(200).json({ status: "success", session });
});
const createOrderPayFees = async (session) => {
  const requestId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;
  const user = await User.findOne({ email: session.customer_email });
  const request = user.type;

  const order = await Order.create({
    user: user.id,
    requstId: requestId,
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
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
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
  if (event.type === "checkout.session.completed") {
    createOrderPayFees(event.data.object);
  }

  res.status(200).json({ received: true });
});
