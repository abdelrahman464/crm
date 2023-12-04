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
Bachelor.belongsTo(User);
//User & Master => relationships (one to many)
User.hasMany(Master, { as: "Master" });
Master.belongsTo(User);
//User & PHD => relationships (one to many)
User.hasMany(PHD, { as: "PHD" });
PHD.belongsTo(User);

User.hasMany(Bachelor, { as: "ManageBachelors", foreignKey: "employeeId" });
Bachelor.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

User.hasMany(Master, { as: "ManageMasters", foreignKey: "employeeId" });
Master.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

User.hasMany(PHD, { as: "ManagePHD", foreignKey: "employeeId" });
PHD.belongsTo(User, { as: "Employee", foreignKey: "employeeId" });

//relation of orders , requst has many order
Bachelor.hasMany(Order, { as: "BachelorOrders", foreignKey: "requstId" });
Order.belongsTo(Bachelor, { as: "BRequests", foreignKey: "requstId" });

Master.hasMany(Order, { as: "MasterOrders", foreignKey: "requstId" });
Order.belongsTo(Master, { as: "MRequests", foreignKey: "requstId" });

PHD.hasMany(Order, { as: "PHDOrders", foreignKey: "requstId" });
Order.belongsTo(PHD, { as: "PRequests", foreignKey: "requstId" });

// Create one-to-one relationship between RequestDoc and Bachelor
RequestDoc.hasOne(Bachelor, { foreignKey: "requestDocId" });
Bachelor.belongsTo(RequestDoc, { foreignKey: "requestDocId" });

// Create one-to-one relationship between RequestDoc and Master
RequestDoc.hasOne(Master, { foreignKey: "requestDocId" });
Master.belongsTo(RequestDoc, { foreignKey: "requestDocId" });

// Create one-to-one relationship between RequestDoc and PHD
RequestDoc.hasOne(PHD, { foreignKey: "requestDocId" });
PHD.belongsTo(RequestDoc, { foreignKey: "requestDocId" });

//for user and order
User.hasMany(Order, { as: "userOrders", foreignKey: "UserId" });
Order.belongsTo(User, { as: "userOrders", foreignKey: "UserId" });
// ... (the rest of your code)

// relationship between User and Notification
User.hasMany(Notification, { foreignKey: 'UserId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'UserId' });



//generate tables in DB
db.sync({ force: false }).then(() => {
  console.log("Tables Created");
});

module.exports = { User, Bachelor, Master, PHD, RequestDoc };
