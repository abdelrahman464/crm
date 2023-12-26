const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const BechlortRoute=require('./BachelorRoute')
const MasterRoute=require('./MasterRoute')
const PHDRoute=require('./PHDRoute')
const ProgressRoute=require('./progressRoute')
const CrmRoute=require('./CrmRoute')
const NotificationRoute=require('./notificationRoute')
const orderRoute=require('./orderRoute')

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/bachelor", BechlortRoute);
  app.use("/api/v1/master", MasterRoute);
  app.use("/api/v1/phd", PHDRoute);
  app.use("/api/v1/progress", ProgressRoute);
  app.use("/api/v1/crm", CrmRoute);
  app.use("/api/v1/notification", NotificationRoute);
  app.use("/api/v1/order", orderRoute);
};
module.exports = mountRoutes;
