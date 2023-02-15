const validator = require("validator");
const isEmpty = require("./is-empty");
const path = require("path");


module.exports = function kycvalidation(data) {
  let errors = {};

  //console.log("data.files.front_pic")
  //console.log(isEmpty(data.files.front_pic))
    if (isEmpty(data.files)|| isEmpty(data.files.front_pic)) { 
        errors= "Front side image required";
        return {
            errors,
            isValid: false
        };
    }else{
        let front_pic = data.files.front_pic; 
        let extensionName = path.extname(front_pic.name);
        let allowedExtension = ['.png','.jpg','.jpeg'];
        let containsMarcus = allowedExtension.includes(extensionName) 
        if(!containsMarcus){
            errors= "Front side image type is invalid.";
            return {
                errors,
                isValid: false
            };
        }
    }
    // if (isEmpty(data.files)||  isEmpty(data.files.back_pic)) { 
    //     errors= "Back side image required";
    //     return {
    //         errors,
    //         isValid: false
    //     };
    // }else{
    //     let back_pic = data.files.back_pic; 
    //     let extensionName = path.extname(back_pic.name);
    //     let allowedExtension = ['.png','.jpg','.jpeg'];
    //     let containsMarcus = allowedExtension.includes(extensionName) 
    //     if(!containsMarcus){
    //         errors= "Back side image type is invalid.";
    //         return {
    //             errors,
    //             isValid: false
    //         };
    //     }
    // }
    
    data.type = !isEmpty(data.body.type) ? data.body.type : "";
    data.document_type = !isEmpty(data.body.document_type) ? data.body.document_type : "";

    if (validator.isEmpty(data.type)) {
        errors= "Type field is Required";
        return {
            errors,
            isValid: false
        };
    }  
    if (validator.isEmpty(data.document_type)) {
        errors= "Dcoument type field is Required";
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
