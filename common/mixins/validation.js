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
  require("./emailValidate")(Model, options);
};

this.ConstantValidation = (Model, options) => {
  require("./constantValidation")(Model, options);
};

//for put
// Model.observe("before save", (ctx, next) => {

//   let instance = ctx.instance || ctx.data;
//   // console.log(instance)
//   let keySet = _.keys(instance.__data);
//   console.log(keySet)
//   _.forEach(keySet, key => {
//     console.log(key)
//     if (this.readOnlyFields.includes(key)) {
//       console.log(`Contains readOnly field '${key}'`)
//       delete instance.__data[key]
//       console.log(instance)
//       console.log("exits");
//     }
//   });

//   // console.log(instance)
//   next();
// });
