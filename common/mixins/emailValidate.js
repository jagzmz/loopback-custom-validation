var _ = require("lodash")
debug=require('debug')('custom-validation:email')

this.populateEmailFields = (Model, arr) => {
  let properties = Model.definition.rawProperties;
  let keyName = "type";
  let customValue = "email";
  for (let field in properties) {
    if (
      properties.hasOwnProperty(field) &&
      properties[field].type == customValue
    ) {
      this.emailFields.push(field);

      Model.definition.rawProperties[field][
        keyName
      ] = Model.definition.properties[field][keyName] = String;
    }
  }
};
this.emailValidator = email => {
  let isEmail = require("isemail"),
    formatErr = require("./helper.js").formatErr;
  newErr = formatErr(this.defErrMsg, email);
  if (!isEmail.validate(email)) {
    throw new Error(newErr);
  }
};

this.checkForValidMail = (ctx, next) => {
  try {
    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance && instance.__data) {
      instance = instance.__data;
    }

    let keySet = instance.__data ? _.keys(instance.__data) : _.keys(instance);

    debug(this.emailFields, instance, keySet);
    let err = [];
    let promises = [];

    for (let key of keySet) {
      if (this.emailFields.includes(key)) {
        let email = instance[key];
        this.emailValidator(email);
      }
    }
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = (Model, options) => {
  this.defErrMsg = options.defEmailErrMsg || "Invalid email %s";
  this.emailFields = [];
  this.populateEmailFields(Model, this.emailFields);

  Model.observe("before save", (ctx, next) => {
    this.checkForValidMail(ctx, next);
  });
};

