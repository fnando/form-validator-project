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
      , options: options
    });
  };

  // Run all validations.
  Validator.fn.isValid = function(record) {
    // Clean the error object.
    this.errors.clean();

    // Run all validations.
    this._validations.forEach(function(options){
      // Retrieve the validator constructor based on the `type` option.
      var constructor = Validator.getValidatorConstructor(options.type);

      // Instantiate the validator, passing the record and the options.
      var validator = new constructor(record, options);

      // If validator is invalid, add the error message.
      if (!validator.isValid()) {
        this.errors.add(options.attribute, options.message);
      }
    }, this);

    // To be considered as valid, the errors object must
    // have no messages.
    return this.errors.isEmpty();
  };

  // Convert the matched char to uppercase.
  var matchToUpperCase = function(match, char){
    return char.toUpperCase();
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
    this._messages.length = 0;
  };

  Errors.fn.add = function(attribute, message) {
    if (!this._messages[attribute]) {
      this._messages[attribute] = [];
      this.length += 1;
      this._messages.length = this.length;
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

  constructor = Validator[constructorName] = function(record, options) {
    this.record = record;
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
  var value = this.record[this.options.attribute];
  return !!value && !!value.replace(/\s/mg, "");
});

// Define the format validator.
Validator.addValidator("format", "is an invalid format", function(){
  var value = this.record[this.options.attribute] || "";
  return !!value.match(this.options.format);
});

// Define the confirmation validator.
Validator.addValidator("confirmation", "must be equal to the confirmation", function(){
  var confirmationAttribute = this.options.attribute + "_confirmation";
  var confirmation = this.record[confirmationAttribute] || "";
  var value = this.record[this.options.attribute] || "";

  return value == confirmation;
});

//==========================================================
