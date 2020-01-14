
function helper(){}

helper.prototype.testAndReplacePlaceholder=(msg, pholder, defReg) =>{
  pholder = "'" + pholder + "'";
  console.log(pholder);
  defReg = defReg || "%s";
  defReg = new RegExp(defReg);
  if (defReg.test(msg)) {
    msg = msg.replace(defReg, pholder);

    return msg;
  } else {
    return msg + " " + pholder;
  }
}
const isRequired = (param) => { throw new Error(`${param}`) };

helper.prototype.populateFields = (Model, arr,key,value) => {

  let error="Invalid arguments"
  // if(!Model||!arr||!key||!value) isRequired('More arguments are required')

  let properties = Model.definition.rawProperties;
  let keyName = key;
  let customValue = value;
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

helper.prototype.popupateFieldsAllModels=(models,populateFields)=>{
  console.log(populateFields.arguments)
}

module.exports = {
  helper,
  formatErr:helper.prototype.testAndReplacePlaceholder
}
