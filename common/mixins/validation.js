"use strict";
var _ = require("lodash");
module.exports = (Model, options) => {
  let customValidation = require("./customValidations.js");

  _.forEach(customValidation, prop => {
    if (typeof this[prop] === "function") {
      options.fieldName = prop.toLowerCase();
      this[prop](Model, options);
    } else {
      throw new Error(`Function defination for '${prop}' not given`);
    }
  });
};

this.EmailType = (Model, options) => {
  var emailValidate = require("./emailValidate");
  emailValidate(Model, options);
};

this.ReadOnly = (Model, options) => {
  this.readOnlyFields = [];

  let properties = Model.definition.rawProperties;

  for (let field in properties) {
    let fieldName = options.fieldName;
    if (
      properties.hasOwnProperty(field) &&
      fieldName in properties[field] &&
      properties[field][fieldName] === true
    ) {
      this.readOnlyFields.push(field);
    }
  }

  Model.observe("before save", (ctx, next) => {
    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance) {
      next();
      return;
    } else {
      this.stripReadOnly(instance);
    }
    next();
  });

  this.stripReadOnly = instance => {
    let keySet = _.keys(instance);
    _.forEach(keySet, key => {
      if (this.readOnlyFields.includes(key)) {
        console.log(`Instance contains readOnly field '${key}'`);
        delete instance[key];
      }
    });
  };
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
