var _ = require("lodash");
var baseDebg = "custom-validation:numberValidation";
var debug = require("debug")(baseDebg),
  observe = debug.extend("beforeSave");

this.defProps = {
  minLen: 1,
  maxLen: 10
};

module.exports=(app)=>{
    let helper= require('../validations/helper')

    // helper.
}