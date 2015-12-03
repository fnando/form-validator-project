/**
 * Form Validator by Carlos Henrique Carvalho de Santana <carlohcs@gmail.com>
 * 2015-11-30
 */

function extendOptions(def, config) {

	var options = {};

	for(var item in def) {
		//options[p] = config[p] == null ? def[p] : config[p];
	}

	return options;
};

 var FormValidator = (function(form, validations) {

 	var defaultMessages = {
 		required: 'This field is required',
 		email: 'Fill this field with the format "user@server.com"',
 		min: 'Fill this field with minimun of {0} characters.',
 		max: 'Fill this field with maximun of {0} characters.',
 		equalTo: 'This field is wrong.'
 	};

	//console.log("Validations -> ", validations.messages);
 	
 	//Extend the messages
 	// var messages = validations.messages ? 
 	// 	extendOptions(defaultMessages, validations.messages) : defaultMessages;
 	var messages = defaultMessages;

 	var validator = {
 		_valid: false,
 		_fields: [],
 		_containerFieldErrorClass: 'with-error',
 		_messageErrorClass: 'error',
 		_validations: {
 			required: function(value) {
 				return value !== "";
 			},
	 		email: function(value, arg) {
	 			//var reg = /^[a-z0-9]+([._][a-z0-9]+)*(+[a-z0-9_-]+)@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}?$/i;
	 			var reg = /\S+@\S+\.\S+/;
    			//return /^[a-z0-9]+([._][a-z0-9]+)*(+[a-z0-9_-]+)@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}?$/i.test(value);
 				return reg.test(value);
 			},
	 		min: function(value, minValue) {
 				return value.length >= minValue;
 			},
	 		max: function(value, maxValue) {
 				return value.length <= maxValue;
 			},
	 		equalTo: function(value, elementEqual) {
	 			var elEqual = document.querySelector(elementEqual);
	 			
 				return value === elEqual.value && value.length > 0;
 			}
 		},
 		/**
 		 * [getFormFields description]
 		 * 
 		 * @return {[type]} [description]
 		 */
 		getFormFields: function() {
 			var fields = [];
 			fields = form.querySelectorAll("input, textarea, select");
 			
 			validator._fields = fields;

 			return validator._fields;
 		},
 		/**
 		 * [addContainerFieldErrorClass description]
 		 * 
 		 * @param {[type]} field [description]
 		 */
 		addContainerFieldErrorClass: function(field) {
 			
 			field.parentElement.className = validator._containerFieldErrorClass;

 		},
 		/**
 		 * [removeContainerFieldErrorClass description]
 		 * 
 		 * @param  {[type]} field [description]
 		 * @return {[type]}       [description]
 		 */
 		removeContainerFieldErrorClass: function(field) {
 			
 			field.parentElement.className = '';

 		},
 		/**
 		 * [addFieldErrorMessage description]
 		 * 
 		 * @param {[type]} field   [description]
 		 * @param {[type]} message [description]
 		 * @param {[type]} args    [description]
 		 */
 		addFieldErrorMessage: function(field, message, args) {
 			
 			var component = field.parentElement.querySelector('.error');

 			var message = validator.replaceMessageArguments(message, args);

 			if(!component) {
 			
 				var errorComponent = document.createElement("span");
 				errorComponent.className = "error";
 				errorComponent.textContent = message;

 				field.parentElement.insertBefore(errorComponent, field.nextSibling);
 			}

 		},
 		/**
 		 * Remove a field error message
 		 * 
 		 * @param  object field
 		 * @return 
 		 */
 		removeFieldErrorMessage: function(field) {
 			
 			var component = field.parentElement.querySelector('.error');

 			if(component) {
 			
 				component.remove();
 			}

 		},
 		/**
 		 * Replace arguments in a message
 		 * 
 		 * @param  string message
 		 * @param  string|array args
 		 * @return string
 		 */
 		replaceMessageArguments: function(message, args) {

 			var args = args instanceof Array ? args.join("") : args;

 			return message.replace("{0}", args);
 		},
 		/**
 		 * Add a custom validate method
 		 * 
 		 * @param string name
 		 * @param object method
 		 * @param string message
 		 */
 		addValidateMethod: function(name, method, message) {

 			validator._validations[name] = method;
 			messages[name] = !message ? "Please fix this field." : message;

 		},
 		/**
 		 * Validate and set the valid var 
 		 * 
 		 * @return boolean validator._valid
 		 */
 		validate: function() {
 			
 			var valid = true,
 				fields = validator.getFormFields();

 			for(var i = 0; i < fields.length; i++){

 				var field = fields[i];

 				if(field.name in validations.rules) {
 					
 					var rules = validations.rules[field.name];

 					for(var rule in rules) {
 						
 					// 	//validator._validations[]
 						//console.log("Rule -> ", rule, "\n");
 						//console.log("Value -> ", rules[rule], "\n");
 						
 						var method = rule,
 							args = rules[rule];

 						if(validator._validations[method]) {
 							//console.log(validator._validations[method], " -> ", validator._validations[method](field, args));
 							
 							if(!validator._validations[method](field.value, args)){

 								//Add container field error class
 								validator.addContainerFieldErrorClass(field);

 								//Add message
 								validator.addFieldErrorMessage(field, messages[method], args);

 								//The validations fail
 								valid = false;
 							}
 							else {

 								//Remove container field error class
 								validator.removeContainerFieldErrorClass(field);

 								//Remove field error message
 								validator.removeFieldErrorMessage(field);
 							}
 						}
 					}
 				}

 			};

 			validator._valid = valid;

 			validator.handleRemoveErrorOnBlur();
 		},
 		/**
 		 * [handleRemoveErrorOnBlur description]
 		 * 
 		 * @return
 		 */
 		handleRemoveErrorOnBlur: function() {
 			
		 	var elements = form.querySelectorAll('.' + validator._containerFieldErrorClass),
		 	element,
		 	field;

		 	for(var i = 0; i < elements.length; i++) {

		 		element = elements[i];

		 		field = element.querySelector("input, textarea, select");

		 		if(field) {

			 		field.onblur = (function() {

			 				//console.log("Onblur of element -> ", this.name);
			 				
			 				//Remove the errors messages and classes
			 				validator.removeContainerFieldErrorClass(this);
			 				
			 				validator.removeFieldErrorMessage(this);

			 		}.bind(field));

		 		}

		 	};

 		},
 		/**
 		 * onSubmit event controled by the validator
 		 * 
 		 * @param  object e (event)
 		 * @return
 		 */
 		handleOnSubmit: function(e) {

			e.preventDefault();

			//Validate the form
			validator.validate();

			//Verify if form is valid
			if(validator._valid) {
				form.submit();
			}
		}
 	};

 	//Brake the submit
 	form.onsubmit = validator.handleOnSubmit;

 	//API
 	return {
 		//Return if form is valid
 		valid: validator.validate,
 		//Add a custom validate method
 		addValidateMethod: validator.addValidateMethod
 	};

 });