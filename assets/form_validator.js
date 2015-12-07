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
 var FormValidator = (function(form, validations, options) {

 	var validator = {
 		_valid: false,
 		_fields: [],
 		_messages: {},
 		_errors: {},
 		_containerFieldErrorClass: 'with-error',
 		_messageErrorClass: 'error',
 		_defaultErrorMessage: 'Fix this field.',
 		_defaultErrorListMessage: 'Please double check your data before continuing:',
 		_defaultMessages: {
	 		required: 'This field is required',
	 		email: 'Fill this field with the format "user@server.com"',
	 		min: 'Fill this field with minimun of {0} characters.',
	 		max: 'Fill this field with maximun of {0} characters.',
	 		equalTo: 'This field is wrong.'
	 	},
 		_validations: {
 			//Return if element attemp the requisitions
 			required: function( value, element, param ) {

 				//Fallback to select element
 				if( element.nodeName.toLowerCase() === 'select' ) {
 					return element.value.length > 0;
 				}
 				//Fallback to radio and checkbox
 				else if( (/radio|checkbox/).test(element.type) ) {
 					return element.length > 0;
 				}
 				else {

	 				switch(typeof param) {

	 					case 'string':
	 						var newElement = document.querySelector(param);
	 						return validator.call(this, newElement);
	 					break;
	 					case 'boolean':
	 						return value.length > 0;
	 					break;
	 					case 'function':
	 						return param.call(this, element, value);
	 					break;

	 				}
 					
 				}
 			},
 			//Checks if the value is a valid e-mail
	 		email: function( value, element, param ) {
	 			
    			//return /^[a-z0-9]+([._][a-z0-9]+)*(+[a-z0-9_-]+)@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}?$/i.test(value);
	 			var reg = /\S+@\S+\.\S+/;

 				return validator.optional( element ) || reg.test( value );
 			},
 			//Checks if the value is greather than the set
	 		min: function( value, element, param ) {
 				return validator.optional( element ) || value.length >= param;
 			},
 			//Checks if the value is less than the set
	 		max: function( value, element, param ) {
 				return validator.optional( element ) || value.length <= param;
 			},
 			//Checks if the current field value is equal to another
	 		equalTo: function( value, element, param ) {
	 			var elEqual = form.querySelector(param);
	 			
 				return validator.optional(elEqual) || (value === elEqual.value && value.length > 0);
 			}
 		},

 		/**
 		 * Return if this field its defined with optional
 		 * 
 		 * @param  object field
 		 * @return boolean
 		 */
 		optional: function( field ) {

 			var fieldRules = validations.rules[field.name];
 			
 			if((typeof fieldRules.required !== 'undefined' && fieldRules.required === true) || field.value.length > 0) return false;
 			
 			return true;

 		},

 		/**
 		 * Return the fields
 		 * 
 		 * @return object _fields
 		 */
 		getFields: function() {

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
 				fields = validator.getFields(),
 				fieldName;

 			//Each field
 			for(var field in fields) {

 				//Get the field name
 				fieldName = fields[field].name;

 				//Create a object to each field
 				messages[fieldName] = {};

 				//Fill rules with your default messages
 				for( var rule in validations.rules[fieldName] )

 					if( validations.rules[fieldName][rule] ) {
						messages[fieldName][rule] = defaultMessages[rule] ? defaultMessages[rule] : validator._defaultErrorMessage;

						//Replace param rules
						messages[fieldName][rule] = validator.replaceMessageParams(messages[fieldName][rule], validations.rules[fieldName][rule]);
					}

 				//If exists custom messages
 				if( customMessages[fieldName] )

 					if( Object.keys(customMessages[fieldName]).length > 0 )

	 					for( var rule in customMessages[fieldName] )

	 						//Set custom message, if its exists
	 						if( customMessages[fieldName][rule] )
	 							messages[fieldName][rule] = validator.replaceMessageParams(customMessages[fieldName][rule], validations.rules[fieldName][rule]);
 				
 			}

 			return messages;
 		},

 		/**
 		 * Add class from field's container
 		 * 
 		 * @param object field
 		 */
 		addContainerErrorClass: function( field ) {
 			
 			field.parentElement.className = validator._containerFieldErrorClass;

 		},

 		/**
 		 * Remove class from field's container
 		 * 
 		 * @param  object field
 		 */
 		removeContainerErrorClass: function( field ) {
 			
 			field.parentElement.className = '';

 		},

 		/**
 		 * Add field error message to a field
 		 * 
 		 * @param object field
 		 * @param string message
 		 * @param string param
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
 		 * @param  string|array params
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

 		/**
 		 * Return errors messages
 		 * 
 		 * @param  object fieldName
 		 * @return array messages
 		 */
 		errorsMessages: function( fieldName ) {

 			if(fieldName) {
 				
 				return validator._errors[fieldName];

 			}
 			else {

 				var messages = [],
 					avoid = {},
 					currentField,
 					lastMessage;

 				for( var field in validator._errors ) {

 					if( !avoid[field] ) {
 						
		 				currentField = validator._errors[field];

		 				lastMessage = validator._errors[field][currentField.length - 1];

		 				messages.push(lastMessage);

		 				avoid[field] = true;
 					}

	 			}

	 			return messages;

 			}
 		},

 		/**
 		 * Validate a field, add errors and show messages
 		 * 
 		 * @param  object field
 		 * @return boolean validField
 		 */
 		check: function( field ) {

 			var validField = true,
 				errors = 0,
 				fieldName = field.name;
 				validator._errors[fieldName] = [];

 			if ( fieldName in validations.rules ) {	

				var rules = validator.normalizeRules(validations.rules[field.name]);

				for( var rule in rules ) {

					var method = rule,
						param = rules[rule],
						message;

					if( validator._validations[method] ) {
						
						if( !validator._validations[method].call(this, field.value, field, param) ) {

							message = validator._messages[fieldName][method];

							//Add message
							validator.addFieldErrorMessage(field, message, param);
							
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

				//No errors found, remove array
				delete validator._errors[fieldName];
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
 				fields = validator.getFields(),
 				field;

 			for(var i = 0; i < fields.length; i++){

 				field = fields[i];

 				validField = validator.check(field);

 				//Invalidate form
 				if( !validField ) validForm = false;

 			};

 			validator._valid = validForm;

 			validator.handleRemoveErrorOnBlur();

 			return validator._valid;
 		},

 		/**
 		 * Handle the onBlur field event
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

		 		if( field ) {

			 		field.onblur = (function() {
	
		 				validator.removeContainerErrorClass(this);
		 				
		 				validator.removeFieldErrorMessage(this);

			 		}.bind(field));

		 		}

		 	};

 		},

 		/**
 		 * Handle onSubmit event controled by the validator
 		 * 
 		 * @param  object e (event)
 		 * @return
 		 */
 		handleOnSubmit: function( e ) {

 			//Prevent the form's submit
			e.preventDefault();

			//Validate the form
			validator.validate();

			//Verify if form is valid
			if( validator._valid ) {
				form.submit();
			}
			else {

				if( options.containerErrorsList ) {

			 		validator.handleErrorsList( options.containerErrorsList );
			 	}

			}
		},

		/**
		 * Handle errors list at a defined container
		 * 
		 * @param  object containerErrorsList
		 * @return
		 */
		handleErrorsList: function( containerErrorsList ) {

			var containerErrorsList = document.querySelector( containerErrorsList ),
				list = document.createDocumentFragment(),
				div = document.createElement('div'),
				p = document.createElement('p'),
				ul = document.createElement('ul'),
				li;

			div.className = 'error-messages';
			p.textContent = validator._defaultErrorListMessage;
			div.appendChild(p);
			div.appendChild(ul);
			list.appendChild(div);

			validator.errorsMessages().forEach(function(element, index) {

				li = document.createElement('li');
				li.textContent = element;
				ul.appendChild(li);

			});

			list.appendChild(ul);

			containerErrorsList.innerHTML = '';
			containerErrorsList.appendChild(list);

		},

		/**
		 * Initialize configurations
		 * 
		 * @return 
		 */
		init: function() {
			
			//Define form object by the object form or by string
			form = typeof form === 'string' ? document.querySelector(form) : form;

			if ( validations ) {

				//Brake the submit
			 	form.onsubmit = validator.handleOnSubmit;

			 	//Set the messages
			 	validator._messages = validator.exchangeMessages(validator._defaultMessages, validations.messages);

			}
			else {

				//
				validator._valid = true;

				//throw("Nothing to validate.");

			}

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
 		errorsMessages: validator.errorsMessages

 	};

 });