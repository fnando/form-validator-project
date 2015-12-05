/**
 * Form Validator
 *
 * @author Carlos Henrique Carvalho de Santana <carlohcs@gmail.com>
 *
 * @date 2015-11-30 
 * 
 * Description:
 *
 * Syntax:
 *
 * 	//Get the form to validate
 *  var form = document.getElementsByTagName('form')[0];
 *
 * 	//Validations to be executed
 	var validations = {
		rules: {
			'name': {
				'required': true
			},
			'email': {
				'required': true,
				'email': true
			}
		},
		messages: {
			'name': {
				'required': 'Este campo não pode ficar em branco.'
			},
			'email': {
				'email': 'Informe um e-mail válido'
			}
		};
	};

 	var validateForm = new FormValidator(form, validations);
 
 */
 var FormValidator = (function(form, validations) {

 	var validator = {
 		_valid: false,
 		_fields: [],
 		_messages: {},
 		_errors: {},
 		_containerFieldErrorClass: 'with-error',
 		_messageErrorClass: 'error',
 		_defaultErrorMessage: 'Fix this field.',
 		_defaultMessages: {
	 		required: 'This field is required',
	 		email: 'Fill this field with the format "user@server.com"',
	 		min: 'Fill this field with minimun of {0} characters.',
	 		max: 'Fill this field with maximun of {0} characters.',
	 		equalTo: 'This field is wrong.'
	 	},
 		_validations: {
 			required: function(value, element, param) {

 				switch(typeof param) {

 					case 'string':

 					break;
 					case 'boolean':
 						return value.length > 0;
 					break;
 					case 'function':

 						return param.call(this, element, value);

 					break;

 				}
 			},
 			//Checks if the value is a valid e-mail
	 		email: function(value, element, param) {
	 			
    			//return /^[a-z0-9]+([._][a-z0-9]+)*(+[a-z0-9_-]+)@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}?$/i.test(value);
	 			var reg = /\S+@\S+\.\S+/;

 				return validator.optional(element) || reg.test(value);
 			},
 			//Checks if the value is greather than the set
	 		min: function(value, element, param) {
 				return validator.optional(element) || value.length >= param;
 			},
 			//Checks if the value is less than the set
	 		max: function(value, element, param) {
 				return validator.optional(element) || value.length <= param;
 			},
 			//Checks if the current field value is equal to another
	 		equalTo: function(value, element, param) {
	 			var elEqual = document.querySelector(param);
	 			
 				return validator.optional(elEqual) || (value === elEqual.value && value.length > 0);
 			}
 		},
 		/**
 		 * Return if this field its defined with optional
 		 * 
 		 * @param  object field
 		 * @return boolean
 		 */
 		optional: function(field) {

 			var fieldRules = validations.rules[field.name];
 			
 			if((typeof fieldRules.required !== 'undefined' && fieldRules.required === true) || field.value.length > 0) return false;
 			
 			return true;

 		},
 		/**
 		 * [getFormFields description]
 		 * 
 		 * @return {[type]} [description]
 		 */
 		getFormFields: function() {

 			if(validator._fields.length === 0) {

 				var fields = [];
 				fields = form.querySelectorAll("input, textarea, select");
 			
 				validator._fields = fields;
 				
 			}

 			return validator._fields;
 		},
 		/**
 		 * Exchange messages
 		 * 
 		 * @param  object defaultMessages
 		 * @param  object customMessages
 		 * @return object messages
 		 */
 		exchangeMessages: function(defaultMessages, customMessages) {

 			var	messages = {},
 				customMessages = customMessages || {},
 				fields = validator.getFormFields(),
 				fieldName;

 			//Each field
 			for(var field in fields) {

 				//Get the field name
 				fieldName = fields[field].name;

 				//Create a object to each field
 				messages[fieldName] = {};

 				//Fill rules with your default messages
 				for(var rule in validations.rules[fieldName])

 					if(validations.rules[fieldName][rule])

						messages[fieldName][rule] = defaultMessages[rule] ? defaultMessages[rule] : validator._defaultErrorMessage;

 				//If exists custom messages
 				if(customMessages[fieldName])

 					if(Object.keys(customMessages[fieldName]).length > 0)

	 					for(var rule in customMessages[fieldName])

	 						//Set custom message, if its exists
	 						if(customMessages[fieldName][rule])
	 							messages[fieldName][rule] = customMessages[fieldName][rule];
 				
 			}

 			return messages;
 		},
 		/**
 		 * Add class from field's container
 		 * 
 		 * @param object field
 		 */
 		addContainerErrorClass: function(field) {
 			
 			field.parentElement.className = validator._containerFieldErrorClass;

 		},
 		/**
 		 * Remove class from field's container
 		 * 
 		 * @param  object field
 		 */
 		removeContainerErrorClass: function(field) {
 			
 			field.parentElement.className = '';

 		},
 		/**
 		 * Add field error message to a field
 		 * 
 		 * @param object field
 		 * @param string message
 		 * @param {[type]} args    [description]
 		 */
 		addFieldErrorMessage: function(field, message, param) {
 			
 			var component = field.parentElement.querySelector('.error');

 			var message = validator.replaceMessageParams(message, param);

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

 			if(component)
 			
 				component.remove();

 		},
 		/**
 		 * Replace params in a message
 		 * 
 		 * @param  string message
 		 * @param  string|array args
 		 * @return string
 		 */
 		replaceMessageParams: function(message, params) {

 			var params = params instanceof Array ? params.join("") : params;

 			return message.replace("{0}", params);
 		},
 		/**
 		 * Add a custom validate method
 		 * 
 		 * @param string name
 		 * @param object method
 		 * @param string message
 		 */
 		addMethod: function(name, method, message) {

 			//Set the name and the method
 			validator._validations[name] = method;
 			
 			//Exchange between default and custom message
 			message = !message ? validator._defaultErrorMessage : message;

 			//Add message to valirator default messages
 			validator._defaultMessages[name] = message;
 			
 			//Refresh changes
 			validator._messages = validator.exchangeMessages(validator._defaultMessages, validations.messages);
 		},
 		/**
 		 * Remove anomalies from rules
 		 * 
 		 * @param  object rules
 		 * @return object normalizedRules
 		 */
 		normalizeRules: function(rules) {
 			
 			var normalizedRules = rules;

 			for(var rule in rules) {
 				
 				//Remove {rule: false}
 				if(rules[rule] === false)
 					delete rules[rule];

 			}

 			return normalizedRules;
 		},
 		getErrorsMessages: function(fieldName) {

 			return fieldName ? validator._errors[fieldName] : validator._errors;
 		},
 		check: function(field) {

 			var validField = true,
 				errors = 0,
 				fieldName = field.name;

 			if(fieldName in validations.rules) {
 					
				var rules = validator.normalizeRules(validations.rules[field.name]);

				for(var rule in rules) {

					var method = rule,
						param = rules[rule],
						message;

					if(validator._validations[method]) {
						
						if(!validator._validations[method].call(this, field.value, field, param)) {

							message = validator._messages[fieldName][method];

							//Add message
							validator.addFieldErrorMessage(field, message, param);

							
							if(!validator._errors[fieldName]) 
								validator._errors[fieldName] = [];

							validator._errors[fieldName].push(message);

							errors++;
						}
					}
				}
			}
			
			if(errors > 0) {
				
				validField = false;

				//Add container field error class
				validator.addContainerErrorClass(field);

			}
			else {

				//Remove container field error class
				validator.removeContainerErrorClass(field);

				//Remove field error message
				validator.removeFieldErrorMessage(field);
			}

			return validField;

 		},
 		/**
 		 * Validate and set the valid var 
 		 * 
 		 * @return boolean validator._valid
 		 */
 		validate: function() {
 			
 			var validForm = true,
 				validField = true,
 				fields = validator.getFormFields(),
 				field;

 			for(var i = 0; i < fields.length; i++){

 				field = fields[i];

 				validField = validator.check(field);

 				//Invalidate form
 				if(!validField) validForm = false;

 			};

 			validator._valid = validForm;

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
		 				validator.removeContainerErrorClass(this);
		 				
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

 			//Prevent the form's submit
			e.preventDefault();

			//Validate the form
			validator.validate();

			//console.log("List of errors: ", validator.getErrorsMessages());

			//Verify if form is valid
			if(validator._valid) {
				form.submit();
			}
		},
		/**
		 * Initialize configurations
		 * 
		 * @return 
		 */
		init: function() {
			
			//Define form object by the object form or by string
			form = typeof form === 'string' ? document.querySelector(form) : form;

			//Brake the submit
		 	form.onsubmit = validator.handleOnSubmit;

		 	//Set the messages
		 	validator._messages = validator.exchangeMessages(validator._defaultMessages, validations.messages);

		}
 	};

 	//Initialize configs
 	validator.init();

 	//API
 	return {
 		//Return if form is valid
 		valid: validator.validate,

 		//Add a custom validate method
 		addMethod: validator.addMethod,

 		//Return errors messages object
 		getErrorsMessages: validator.getErrorsMessages
 	};

 });