const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.country_code = !isEmpty(data.country_code) ? data.country_code : "";

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

  if (validator.isEmpty(data.country_code)) {
    errors= "Country code field is Required";
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
