const validator = require("validator");
const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;


    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid attacker will know if the email is present in db so instead use INVALID CREDENTIALS!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a storng Password");
    }

  
};

module.exports  ={
    validateSignUpData,
};