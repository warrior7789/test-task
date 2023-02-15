const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.otp = !isEmpty(data.otp) ? data.otp : "";

  if (validator.isEmpty(data.phone)) {
    errors= "Phone field is Required";
    return {
      errors,
      isValid: false
    };
  }
  /*if (!validator.isEmail(data.email)) {    
    errors= "Email is not Valid";
    return {
        errors,
        isValid: false
    };
  }*/

  if (validator.isEmpty(data.otp)) {
    errors= "OTP Required";
    return {
      errors,
      isValid: false
    };
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
