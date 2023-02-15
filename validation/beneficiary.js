const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function beneficiary(data) {
    let errors = {};

    data.type = !isEmpty(data.type) ? data.type : "";
    data.upi = !isEmpty(data.upi) ? data.upi : "";
    data.account_number = !isEmpty(data.account_number) ? data.account_number : "";
    data.ifsc = !isEmpty(data.ifsc) ? data.ifsc : "";
    data.name = !isEmpty(data.name) ? data.name : "";
    data.social_type = !isEmpty(data.social_type) ? data.social_type : "";

    if (validator.isEmpty(data.type)) {
        errors= "Please select type.";
        return {
            errors,
            isValid: false
        };
    }
    if(data.type == "upi"){
        console.log("test")
        if (validator.isEmpty(data.upi)) {
            errors= "Please enter UPI address.";
            return {
                errors,
                isValid: false
            };
        }

    }else if(data.type == "bank"){
        if (validator.isEmpty(data.account_number)) {
            errors= "Please enter account number.";
            return {
                errors,
                isValid: false
            };
        }if (validator.isEmpty(data.ifsc)) {
            errors= "Please enter IFSC code .";
            return {
                errors,
                isValid: false
            };
        }if (validator.isEmpty(data.name)) {
            errors= "Please enter account holder name.";
            return {
                errors,
                isValid: false
            };
        }
    }else{
        errors= "Invalid Type select.";
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
