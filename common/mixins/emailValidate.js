var _ = require("lodash");
module.exports = (Model, options) => {
  this.emailFields = [];
  let properties = Model.definition.rawProperties;
  let keyName = "type";
  let customValue = "email";
  for (let field in properties) {
    if (
      properties.hasOwnProperty(field) &&
      properties[field].type == customValue
    ) {
      this.emailFields.push(field);

      Model.definition.rawProperties[field][keyName] = Model.definition.properties[field][keyName] = String;
    }
  }

  Model.observe("before save", (ctx, next) => {
    

    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance) {
      instance = instance.__data;
    }
    // console.log(instance)
    // let keySet = _.get(instance,_.keys(instance['__data']),_.keys(instance))

    let keySet= instance.__data ? _.keys(instance.__data) : _.keys(instance)
    // _.keys(instance.__data)||_.keys(instance)

    console.log(this.emailFields, instance,keySet);
    let err = [];
    let promises = [];
    keySet.forEach(key => {
      if (this.emailFields.includes(key)) {
        console.log(key)
        promises.push(emailValidator(instance[key]));
        // try {
        //     await emailValidator(instance[key])
        // } catch (error) {
        //     console.log(error)
        //     err.push(error)
        // }
        // emailValidator(instance[key])
        // .then(ok=>console.log(instance[key]+"  ... ok"))
        // .catch(rej=>{console.log("Error inside emailValidator"); err.push(rej); console.log(err)})
      }
    });
    //   console.log(promises)

    Promise.all(promises)
      .catch(rej => {
        next(rej);
      })
      .then(res => next());
    
  });
};
function emailValidator(email) {
  let isEmail = require("isemail");
  return new Promise((resolve, reject) => {
    if (!isEmail.validate(email)) {
      reject(`Invalid Email...'${email}'`);
    } else {
      resolve();
    }
  });
}
