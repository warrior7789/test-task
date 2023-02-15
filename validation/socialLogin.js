const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function socialLogin(data) {
  let errors = {};

  data.social_id = !isEmpty(data.social_id) ? data.social_id : "";
  data.social_type = !isEmpty(data.social_type) ? data.social_type : "";

  if (validator.isEmpty(data.social_id)) {
    errors= "Social ID field is Required";
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
  if (validator.isEmpty(data.social_type)) {
    errors= "Social type field is Required";
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
