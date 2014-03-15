// The Validator constructor will do generic validations,
// without using any DOM functionality. That way we can use
// it to validate generic data structures.
//
// To validate a form element, you can use the adapter `Validator.Form`.
//
// ```javascript
// var record = {name: null};
// var validator = new Validator();
// var validator.validate("presence", "name", {message: "The name is required"});
// validator.isValid(record); // runs validators and return a boolean.
// validator.errors.all();    // return an object containing all error messages.
// ```
var Validator = (function(){
  function Validator() {
    this._validations = [];
    this.errors = new Validator.Errors();
  }

  Validator.fn = Validator.prototype;

  Validator.getValidatorName = function(name) {
    var constructorName = name
      .replace(/[-_](.)/g, matchToUpperCase)
      .replace(/^(.)/, matchToUpperCase)
    ;

    return constructorName + "Validator";
  };

  Validator.getValidatorConstructor = function(name) {
    return Validator[Validator.getValidatorName(name)];
  };

  // Add a new validation.
  // The `type` argument will be used to find a validator like
  // `Validator.PresenceValidator`. This validator will receive
  // the attributes object and must implement the `isValid()`
  // method.
  Validator.fn.validate = function(type, attribute, options) {
    this._validations.push({
        type: type
      , attribute: attribute
      , options: options || {}
    });
  };

  // Run all validations.
  Validator.fn.isValid = function(record) {
    // Clean the error object.
    this.errors.clean();

    // Run all validations.
    this._validations.forEach(function(validation){
      // Retrieve the validator constructor based on the `type` option.
      var constructor = Validator.getValidatorConstructor(validation.type);

      // Instantiate the validator, passing the record and the options.
      var validator = new constructor(record, validation.attribute, validation.options);

      // If validator is invalid, add the error message.
      if (!validator.isValid()) {
        this.errors.add(validation.attribute, validator.errorMessage());
      }
    }, this);

    // To be considered as valid, the errors object must
    // have no messages.
    return this.errors.isEmpty();
  };

  // Convert the matched char to uppercase.
  var matchToUpperCase = function(match, letter){
    return letter.toUpperCase();
  }

  return Validator;
})();

//==========================================================

Validator.Errors = (function(){
  function Errors() {
    this._messages = {};
  }

  Errors.fn = Errors.prototype;

  Errors.fn.length = 0;

  Errors.fn.clean = function() {
    this._messages = {};
    this.length = 0;
  };

  Errors.fn.add = function(attribute, message) {
    if (!this._messages[attribute]) {
      this._messages[attribute] = [];
      this.length += 1;
    }

    this._messages[attribute].push(message);
  };

  Errors.fn.isEmpty = function() {
    return this.length === 0;
  };

  Errors.fn.all = function() {
    return this._messages;
  };

  Errors.fn.on = function(attribute) {
    return this._messages[attribute] || [];
  };

  return Errors;
})();

//==========================================================

// Creates an easy way to define validators.
Validator.addValidator = function(name, defaultMessage, condition) {
  var constructorName = Validator.getValidatorName(name);
  var constructor;

  constructor = Validator[constructorName] = function(record, attribute, options) {
    this.record = record;
    this.attribute = attribute;
    this.options = options;
    this.defaultMessage = defaultMessage;
  };

  constructor.prototype.errorMessage = function() {
    return this.options.message || this.defaultMessage;
  };

  constructor.prototype.isValid = condition;
};

// Define the presence validator.
Validator.addValidator("presence", "can't be blank", function(){
  var value = this.record[this.attribute];
  return !!value && !!value.replace(/\s/mg, "");
});

// Define the format validator.
Validator.addValidator("format", "is an invalid format", function(){
  var value = this.record[this.attribute] || "";
  return !!value.match(this.options.format);
});

// Define the confirmation validator.
Validator.addValidator("confirmation", "must be equal to the confirmation", function(){
  var confirmationAttribute = this.attribute + "_confirmation";
  var confirmation = this.record[confirmationAttribute] || "";
  var value = this.record[this.attribute] || "";

  return value == confirmation;
});

// Define the length validator.
Validator.addValidator("length", null, function(){
  var value = this.record[this.attribute] || "";
  var length = value.length;
  var success = true;
  var errorMessage;

  var customMessage = this.options.message || {};

  this.defaultMessage = {
      min: "can't have less than " + this.options.min + " characters"
    , max: "can't have more than " + this.options.max + " characters"
  };

  if (this.options.min && value.length < this.options.min) {
    success = false;
    errorMessage = customMessage.min || this.defaultMessage.min;
  } else if (this.options.max && value.length > this.options.max) {
    success = false;
    errorMessage = customMessage.max || this.defaultMessage.max;
  }

  // Override the errorMessage method, so we
  // can receive custom messages as an object.
  this.errorMessage = function() {
    return errorMessage;
  };

  return success;
});

//==========================================================

Validator.Form = (function(){
  var caller = function(funcName, context, args) {
    return function(item) {
      return item[funcName].apply(context || item, args);
    };
  };

  function Form(form, renderers) {
    this.form = form;
    this.renderers = renderers || [];
    this._validator = new Validator();
    this.errors = this._validator.errors;
  }

  Form.fn = Form.prototype;

  Form.fn.validate = function(type, field, options) {
    this._validator.validate(
        type
      , this.form.find(field).attr("name")
      , options
    );
  };

  Form.fn.clean = function() {
    this.renderers.map(caller("clean", null, [this]));
  };

  Form.fn.render = function() {
    this.renderers.map(caller("render", null, [this]));
  };

  Form.fn.isValid = function() {
    var record = this._record();
    var result = this._validator.isValid(record);

    this.clean();

    if (!result) {
      this.render();
    }

    return result;
  };

  Form.fn._record = function() {
    var formData = this.form.serializeArray();

    return formData.reduce(function(record, field){
      record[field.name] = field.value;
      return record;
    }, {});
  };

  return Form;
})();

//==========================================================

Validator.InlineErrorRenderer = (function(){
  function InlineErrorRenderer() {
  }

  InlineErrorRenderer.fn = InlineErrorRenderer.prototype;

  InlineErrorRenderer.fn.render = function(validator) {
    var errors = validator.errors.all();

    for (var name in errors) {
      this._renderError(validator, name, errors[name]);
    }
  };

  InlineErrorRenderer.fn.clean = function(validator) {
    validator.form.find(".error").remove();
  };

  InlineErrorRenderer.fn._renderError = function(validator, name, errors) {
    var error = $("<span>")
      .addClass("error")
      .text(errors[0])
    ;

    validator.form.find("[name='" + name + "']").after(error);
  };

  return InlineErrorRenderer;
})();

//==========================================================

Validator.ListRenderer = (function(){
  function ListRenderer(banner) {
    this.banner = banner;
  }

  ListRenderer.fn = ListRenderer.prototype;

  ListRenderer.fn.render = function(validator) {
    var container = $("<div class='error-messages'>");
    this._renderBanner(container);
    this._renderList(container, validator.errors.all());
    validator.form.prepend(container);
  };

  ListRenderer.fn.clean = function(validator) {
    validator.form.find(".error-messages").remove();
  };

  ListRenderer.fn._renderBanner = function(container) {
    $("<p>").text(this.banner).appendTo(container);
  };

  ListRenderer.fn._renderList = function(container, errors) {
    var list = $("<ul>").appendTo(container);

    for (var name in errors) {
      errors[name].forEach(function(error){
        $("<li>").text(error).appendTo(list);
      });
    }
  };

  return ListRenderer;
})();

//==========================================================

Validator.ContainerRenderer = (function(){
  function ContainerRenderer() {
  }

  ContainerRenderer.fn = ContainerRenderer.prototype;

  ContainerRenderer.fn.render = function(validator) {
    var errors = validator.errors.all();

    for (var name in errors) {
      validator.form.find("input[name='" + name + "']").parent().addClass("with-error");
    }
  };

  ContainerRenderer.fn.clean = function(validator) {
    validator.form.find(".with-error").removeClass("with-error");
  };

  return ContainerRenderer;
})();
