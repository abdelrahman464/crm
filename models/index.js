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
const EmployeeModel=require('./employee')

//createa models
const User = UserModel(db, Sequelize);
const Bachelor = BachelorModel(db, Sequelize);
const Master = MasterModel(db, Sequelize);
const PHD = PhDModel(db, Sequelize);
const Employee=EmployeeModel(db,Sequelize)



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


//Employee & Bachelor => relationships (one to many)
Employee.hasMany(Bachelor, { as: "Bachelor" });
Bachelor.belongsTo(Employee);
//Employee & Master => relationships (one to many)
Employee.hasMany(Master, { as: "Master" });
Master.belongsTo(Employee);
//Employee & PHD => relationships (one to many)
Employee.hasMany(PHD, { as: "PHD" });
PHD.belongsTo(Employee);

//generate tables in DB
db.sync({ force: false }).then(() => {
  console.log("Tables Created");
});

module.exports = { User, Bachelor, Master, PHD };
