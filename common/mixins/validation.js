"use strict";
var _ = require("lodash");
module.exports = (Model, options) => {
  let customValidation = require("./customValidations.js");

  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      this[prop](Model, options);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
};

this.EmailType = (Model, options) => {
  require("./validations/emailValidate")(Model, options);
};

this.ConstantValidation = (Model, options) => {
  require("./validations/constantValidation")(Model, options);
};
this.StringValidation=(Model,options)=>{

  // require("./validations/stringValidation")(Model, options);
}
