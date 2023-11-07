const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const BechlortRoute=require('./BachelorRoute')
const MasterRoute=require('./MasterRoute')
const PHDRoute=require('./PHDRoute')
// const CrmRoute=require('./CrmRoute')

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/bechlor", BechlortRoute);
  app.use("/api/v1/master", MasterRoute);
  app.use("/api/v1/phd", PHDRoute);
  // app.use("/api/v1/crm", CrmRoute);
};
module.exports = mountRoutes;
