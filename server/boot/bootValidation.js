"use strict";
let debug = require("debug")("custom-validation:boot")
let _=require('lodash')


module.exports = server => {
    
    //String Validation
    require('../../common/mixins/validations/stringValidation')(server)

    //Number Validation
    require('../../common/mixins/validations/numberValidate')(server)



  
};
