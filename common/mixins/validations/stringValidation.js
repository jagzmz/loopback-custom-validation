var _ = require("lodash");
var baseDebg = "custom-validation:stringValidation";
var debug = require("debug")(baseDebg),
  observe = debug.extend("beforeSave");

this.defProps = {
  minLen: 1,
  maxLen: 2000
};

this.populateStringFields = (Model, arr) => {
  let properties = Model.definition.rawProperties;
  let keyName = "type";
  let customValue = "string";
  let props = [];
  for (let field in properties) {
    if (
      properties.hasOwnProperty(field) &&
      properties[field].type == customValue
    ) {
      props.push(field);
    }
  }
  arr[Model.modelName] = props;
};

this.verifyString = (Model, instance, debg) => {
  // debg(instance)
  this.debg = debg;
  let chckFields = Model.options.fields || [];
  let defProps = Model.options.defProps;
  for (let field in instance) {
    if (chckFields.includes(field)) {
      defProps = Model.definition.rawProperties[field].stringProps || defProps;

      for (let prop in this.defProps) {
        defProps[prop] = defProps[prop] || this.defProps[prop];
      }
      validateLen.call(this, instance[field], defProps);
      debg(field, defProps);
    }
  }
};
validateLen = (string, options) => {
  this.debg(options);
  // return "lo"
  let minLen = options.minLen || 1;
  let maxLen = options.maxLen || 300;
  if (string.length < minLen || string.length > maxLen) {
    this.debg("Invalid string length");
    throw new Error(
      `Invalid string length of '${string}'. Accepted range is '${minLen}' to '${maxLen}`
    );
  }
};

this.initObserveHook = (app, modelName) => {
  let Model = app.models[modelName];
  observe("Initializing observe hook for ", Model.modelName);
  Model.options = {};
  Model.options.fields = this.models[modelName];
  let tmpProps = app.get("defStringProps");
  for (let prop in this.defProps) {
    this.defProps[prop] = tmpProps[prop] || this.defProps[prop];
  }
  observe(this.defProps);

  Model.options.defProps = this.defProps;
  Model.observe("before save", async ctx => {
    let obs = observe.extend(modelName);
    //init ctx data

    let instance = ctx.instance || ctx.data;
    if (ctx.isNewInstance && instance.__data) {
      instance = instance.__data;
    }

    this.verifyString(Model, instance, obs);
  });
};

testObserver = () => {
  let fetch = require("node-fetch");
  let deb = observe.extend("test-fetch");
  params = {
    name: "dd",
    email: "string@d"
  };

  setTimeout(() => {
    // postData();
  }, 1000);

  postData = () => {
    fetch("http://localhost:3000/api/tests", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(params)
    })
      .then(res => {
        // deb(res.status, res.statusText, res.body());
        return res.json();
      })
      .then(res => {
        deb(res);
      });
  };
};
module.exports = app => {
  this.models = {};

  _.keys(app.models).forEach(model => {
    this.populateStringFields(app.models[model], this.models);
  });
  for (let modelName in this.models) {
    this.initObserveHook(app, modelName);
  }
  testObserver();
};
