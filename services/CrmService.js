const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { User, Bachelor, Master, PHD } = require("../models");


//1- assign employee for each request
//@params     employeeId userId
exports.assignEmployeeForRequest = asyncHandler(async (req, res) => {
  const { employeeId, userId, requestId } = req.body;

  const user = await User.findByPk(userId);
  if (user.type === "bachelor") {
    await Bachelor.update(
      { employeeId: employeeId },
      { where: { id: requestId } }
    );
    //TODO
    //save these assignments to employee to see it in his dashboard
  }
  else if (user.type === "master") {
    await Master.update(
      { employeeId: employeeId },
      { where: { id: requestId } }
    );
    //TODO
    //save these assignments to employee to see it in his dashboard
  }
  else if (user.type === "PHD") {
    await PHD.update({ employeeId: employeeId }, { where:  { id: requestId }});
  }

 return res.status(200).json({status:"success","msg":"employee has been assigned sucessfully to this user"})
   //TODO 
    //save these assignments to employee to see it in his dashboard
});



exports.removeEmployeeFormRequest = asyncHandler(async (req, res) => {
    const { userId, requestId } = req.body;
  
    const user = await User.findByPk(userId);
    if (user.type === "bachelor") {
      await Bachelor.update(
        { employeeId: null },
        { where: { id: requestId } }
      );
      //TODO
      //save these assignments to employee to see it in his dashboard
    }
    else if (user.type === "master") {
      await Master.update(
        { employeeId: null },
        { where: { id: requestId } }
      );
      //TODO
      //save these assignments to employee to see it in his dashboard
    }
    else if (user.type === "PHD") {
      await PHD.update({ employeeId: null }, { where:  { id: requestId }});
    }
  
   return res.status(200).json({status:"success","msg":"employee has been assigned sucessfully to this user"})
     //TODO 
      //save these assignments to employee to see it in his dashboard
  });

