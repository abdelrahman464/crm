const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
//import schemas
const UserModel = require("./User");
const BachelorModel = require("./Bachelor");
const MasterModel = require("./Master");
const PhDModel = require("./Ph_D");
const RequestDocumentModel = require("./RequestDocument");
const OrderModel = require("./order");
const NotificationModel = require("./Notification");

//createa models
const User = UserModel(db, Sequelize);
const Bachelor = BachelorModel(db, Sequelize);
const Master = MasterModel(db, Sequelize);
const PHD = PhDModel(db, Sequelize);
const RequestDoc = RequestDocumentModel(db, Sequelize);
const Order = OrderModel(db, Sequelize);
const Notification = NotificationModel(db, Sequelize);

//define relationships
//User & Bachelor => relationships (one to many)
User.hasMany(Bachelor, { as: "Bachelor" });
Bachelor.belongsTo(User, { foreignKey: "UserId", as: "UserDetails" });
//User & Master => relationships (one to many)
User.hasMany(Master, { as: "Master" });
Master.belongsTo(User, { foreignKey: "UserId", as: "UserDetails" });
//User & PHD => relationships (one to many)
User.hasMany(PHD, { as: "PHD" });
PHD.belongsTo(User, { foreignKey: "UserId", as: "UserDetails" });

User.hasMany(Bachelor, { as: "ManageBachelors", foreignKey: "employeeId" });
Bachelor.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

User.hasMany(Master, { as: "ManageMasters", foreignKey: "employeeId" });
Master.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

User.hasMany(PHD, { as: "ManagePHD", foreignKey: "employeeId" });
PHD.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

//relation of orders , requst has many order
Bachelor.hasMany(Order, { as: "BachelorOrders", foreignKey: "requestId" });
Order.belongsTo(Bachelor, { as: "BRequests", foreignKey: "requestId" });

Master.hasMany(Order, { as: "MasterOrders", foreignKey: "requestId" });
Order.belongsTo(Master, { as: "MRequests", foreignKey: "requestId" });

PHD.hasMany(Order, { as: "PHDOrders", foreignKey: "requestId" });
Order.belongsTo(PHD, { as: "PRequests", foreignKey: "requestId" });

// Create one-to-one relationship between RequestDoc and Bachelor
RequestDoc.hasOne(Bachelor, { foreignKey: "requestDocId" });
Bachelor.belongsTo(RequestDoc, {
  foreignKey: "requestDocId",
  as: "RequestDocumentDetails",
});

// Create one-to-one relationship between RequestDoc and Master
RequestDoc.hasOne(Master, { foreignKey: "requestDocId" });
Master.belongsTo(RequestDoc, {
  foreignKey: "requestDocId",
  as: "RequestDocumentDetails",
});

// Create one-to-one relationship between RequestDoc and PHD
RequestDoc.hasOne(PHD, { foreignKey: "requestDocId" });
PHD.belongsTo(RequestDoc, {
  foreignKey: "requestDocId",
  as: "RequestDocumentDetails",
});

// relationship between User and Notification
User.hasMany(Notification, { foreignKey: "UserId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "UserId", as: "UserNotification" });

//generate tables in DB
db.sync({ force: true }).then(() => {
  console.log("Tables Created");
});

module.exports = { User, Bachelor, Master, PHD, RequestDoc, Notification ,Order};
