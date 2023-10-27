const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const requestRoute=require('./requestRoute')

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/requests", requestRoute);
};
module.exports = mountRoutes;
