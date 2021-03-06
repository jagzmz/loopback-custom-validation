module.exports = (Model, options) => {
  //this wont work at PUT request

  // add property as
  //          "profilePic":{
  //            ...,
  //            "readonly":true|false
  //           }

  var _ = require("lodash");
  var debug=require('debug')('custom-validation:constant')
  this.constantFields = [];

  let properties = Model.definition.rawProperties;

  for (let field in properties) {
    let fieldName = "constant";
    if (
      properties.hasOwnProperty(field) &&
      fieldName in properties[field] &&
      properties[field][fieldName] === true
    ) {
      this.constantFields.push(field);
    }
  }

  Model.observe("before save", (ctx, next) => {
    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance) {
      next();
      return;
    } else {
      this.removeConstants(instance);
    }
    next();
  });

  this.removeConstants = instance => {
    let keySet = _.keys(instance);
    _.forEach(keySet, key => {
      if (this.constantFields.includes(key)) {
        debug(`Instance contains constant field '${key}'`);
        delete instance[key];
      }
    });
  };
};
