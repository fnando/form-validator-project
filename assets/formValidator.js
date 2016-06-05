/**
 * Form Validator
 *
 * @author Carlos Henrique Carvalho de Santana <carlohcs@gmail.com>
 *
 * @date 2015-11-30 
 * 
 * Description: 
 *
 * 	Simple class to validate a form. See bellow the syntax.
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

	//Custom validate options
	var validateOptions = {
		containerErrorsList: '#error-messages-content',
		defaultErrorListMessage: 'Por favor, verifique os erros.',
		defaultMessages: {
	 		required: 'Este campo é requerido.',
	 		email: 'Preencha este campo no formato "usuario@servidor.com"',
	 		min: 'Preencha este campo com no mínimo de {0} caracteres.',
	 		max: 'Preencha este campo com no máximo of {0} caracteres.',
	 		equalTo: 'This field is wrong.'
	 	}
	};

 	var validateForm = new FormValidator(form, validations, validateOptions);
 */
var
  FormValidator = (function(form, validations, options) {
    'use strict';
    var
      validator = {
        _valid: false,
        _fields: [],
        _messages: {},
        _errors: {},
        containerFieldErrorClass: options && options.containerFieldErrorClass || 'with-error',
        messageErrorClass: options && options.messageErrorClass || 'error',
        defaultErrorMessage: options && options.defaultErrorMessage || 'Fix this field.',
        defaultErrorListMessage: options && options.defaultErrorListMessage || 'Please double check your data before continuing:',
        defaultMessages: {
          required: options && options.defaultMessages.required || 'This field is required',
          email: options && options.defaultMessages.email || 'Fill this field with the format "user@server.com"',
          min: options && options.defaultMessages.min || 'Fill this field with minimum of {0} characters.',
          max: options && options.defaultMessages.max || 'Fill this field with maximum of {0} characters.',
          equalTo: 'This field is wrong.'
        },
        _validations: {
          required: function(value, element, param) {
            //Fallback to select element
            if (element.nodeName.toLowerCase() === 'select') {
              return element.value.length > 0;
            }
            //Fallback to radio and checkbox
            else if ((/radio|checkbox/).test(element.type)) {
              return element.length > 0;
            } else {

              switch (typeof param) {
                case 'string':
                  return validator.call(this, document.querySelector(param));
                case 'boolean':
                  return value.length > 0;
                case 'function':
                  return param.call(this, element, value);
              }
            }
          },
          email: function(value, element) {
            var
              reg = /\S+@\S+\.\S+/;

            return validator.optional(element) || reg.test(value);
          },
          min: function(value, element, param) {
            return validator.optional(element) || value.length >= param;
          },
          max: function(value, element, param) {
            return validator.optional(element) || value.length <= param;
          },
          equalTo: function(value, element, param) {
            var
              elEqual = form.querySelector(param),
              equal = value === elEqual.value && value.length > 0;

            return validator.optional(elEqual) || equal;
          }
        },
        /**
         * Return if this field its defined with optional
         *
         * @param  {Object} field
         * @return {Boolean}
         */
        optional: function(field) {
          var
            fieldRules = validations.rules[field.name],
            required = typeof fieldRules.required !== 'undefined' && fieldRules.required;

          if (required || field.value.length > 0) {
            return false;
          }

          return true;
        },
        /**
         * Return the fields
         *
         * @return {Object} _fields
         */
        getFields: function() {
          if (validator._fields.length === 0) {
            var
              fields = [];

            fields = form.querySelectorAll('input, textarea, select');

            validator._fields = fields;
          }

          return validator._fields;
        },
        /**
         * Exchange messages
         *
         * @param  {Object} defaultMessages
         * @param  {Object} customMessages
         * @return {Object} messages
         */
        exchangeMessages: function(defaultMessages, customMessages) {
          var
            fields = validator.getFields(),
            messages = {},
            fieldName;

          customMessages = customMessages || {};

          //Each field
          for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
              var
                rule,
                customMessage;

              //Get the field name
              fieldName = fields[field].name;

              //Create a {Object} to each field
              messages[fieldName] = {};

              //Fill rules with your default messages
              for (rule in validations.rules[fieldName]) {

                if (validations.rules[fieldName][rule]) {
                  messages[fieldName][rule] = defaultMessages[rule] ? defaultMessages[rule] : validator.defaultErrorMessage;

                  //Replace param rules
                  messages[fieldName][rule] = validator.replaceMessageParams(messages[fieldName][rule], validations.rules[fieldName][rule]);
                }
              }

              //If exists custom messages
              if ((customMessage = customMessages[fieldName])) {
                if (Object.keys(customMessage).length > 0) {
                  for (rule in customMessage) {
                    //Set custom message, if its exists
                    if (customMessage[rule]) {
                      messages[fieldName][rule] = validator.replaceMessageParams(customMessage[rule], validations.rules[fieldName][rule]);
                    }
                  }
                }
              }
            }
          }

          return messages;
        },
        /**
         * Add class from field's container
         *
         * @param {Object} field
         * @return {Void}
         */
        addErrorClass: function(field) {
          field.parentElement.className = validator.containerFieldErrorClass;
        },
        /**
         * Remove class from field's container
         *
         * @param  {Object} field
         * @return {Void}
         */
        removeErrorClass: function(field) {
          field.parentElement.className = '';
        },
        /**
         * Add field error message to a field
         *
         * @param {Object} field
         * @param string message
         * @param string param
         * @return {Void}
         */
        addErrorMessage: function(field, message, param) {
          var
            component = field.parentElement.querySelector('.' + validator.messageErrorClass);

          message = validator.replaceMessageParams(message, param);

          if (!component) {
            var
              errorComponent = document.createElement('span');

            errorComponent.className = validator.messageErrorClass;
            errorComponent.textContent = message;

            field.parentElement.insertBefore(errorComponent, field.nextSibling);
          }
        },
        /**
         * Remove a field error message
         *
         * @param  {Object} field
         * @return {Void}
         */
        removeErrorMessage: function(field) {
          var
            component = field.parentElement.querySelector('.' + validator.messageErrorClass);

          if (component) {
            component.remove();
          }
        },
        /**
         * Replace params in a message
         *
         * @param  {String} message
         * @param  {Mixin} params
         * @return {String}
         */
        replaceMessageParams: function(message, params) {
          params = params instanceof Array ? params.join('') : params;
          return message.replace('{0}', params);
        },
        /**
         * Add a custom validate method
         *
         * @param {String} name
         * @param {Object} method
         * @param {String} message
         */
        addMethod: function(name, method, message) {
          //Set the name and the method
          validator._validations[name] = method;

          //Exchange between default and custom message
          message = !message ? validator.defaultErrorMessage : message;

          //Add message to valirator default messages
          validator.defaultMessages[name] = message;

          //Refresh changes
          validator._messages = validator.exchangeMessages(validator.defaultMessages, validations.messages);
        },
        /**
         * Remove anomalies from rules
         *
         * @param  {Object} rules
         * @return {Object} normalizedRules
         */
        normalizeRules: function(rules) {
          var
            normalizedRules = rules;

          for (var rule in rules) {
            //Remove {rule: false}
            if (rules[rule] === false) {
              delete rules[rule];
            }
          }

          return normalizedRules;
        },
        /**
         * Return errors messages
         *
         * @param  {Object} fieldName
         * @return {Array} messages
         */
        errorsMessages: function(fieldName) {
          if (!fieldName) {
            var
              messages = [],
              avoid = {},
              currentField,
              lastMessage;

            for (var field in validator._errors) {
              if (validator._errors.hasOwnProperty(field)) {
                if (!avoid[field]) {

                  currentField = validator._errors[field];

                  lastMessage = validator._errors[field][currentField.length - 1];

                  messages.push(lastMessage);

                  avoid[field] = true;
                }
              }
            }

            return messages;
          }

          return validator._errors[fieldName];
        },
        /**
         * Validate a field, add errors and show messages
         *
         * @param  {Object} field
         * @return {Boolean}
         */
        check: function(field) {
          var
            validField = true,
            errors = 0,
            fieldName = field.name;

          validator._errors[fieldName] = [];

          if (fieldName in validations.rules) {
            var
              rules = validator.normalizeRules(validations.rules[field.name]);

            for (var rule in rules) {
              if (rules.hasOwnProperty(rule)) {
                var
                  method = rule,
                  param = rules[rule],
                  message;

                if (validator._validations[method]) {

                  if (!validator._validations[method].call(this, field.value, field, param)) {

                    message = validator._messages[fieldName][method];

                    //Add message
                    validator.addErrorMessage(field, message, param);

                    validator._errors[fieldName].push(message);

                    errors++;
                  }
                }
              }
            }
          }

          if (errors > 0) {

            validField = false;

            //Add container field error class
            validator.addErrorClass(field);

          } else {

            //Remove container field error class
            validator.removeErrorClass(field);

            //Remove field error message
            validator.removeErrorMessage(field);

            //No errors found, remove array
            delete validator._errors[fieldName];
          }

          return validField;
        },
        /**
         * Validate and set the valid var
         *
         * @return {Boolean}
         */
        validate: function() {

          var
            validForm = true,
            validField = true,
            fields = validator.getFields(),
            field;

          for (var i = 0; i < fields.length; i++) {

            field = fields[i];

            validField = validator.check(field);

            //Invalidate form
            if (!validField) {
              validForm = false;
            }
          }

          validator._valid = validForm;

          validator.handleRemoveErrorOnBlur();

          return validator._valid;
        },

        /**
         * Handle the onBlur field event
         *
         * @return {Void}
         */
        handleRemoveErrorOnBlur: function() {
          var
            elements = form.querySelectorAll('.' + validator.containerFieldErrorClass),
            element,
            field;

          function removeError(field) {
            return function() {
              validator.removeErrorClass(field);
              validator.removeErrorMessage(field);
            };
          }

          for (var i = 0; i < elements.length; i++) {
            element = elements[i];

            field = element.querySelector('input, textarea, select');

            if (field) {
              field.addEventListener('blur', removeError(field));
            }
          }
        },
        /**
         * Handle onSubmit event controled by the validator
         *
         * @param  {Object} e (event)
         * @return {Void}
         */
        handleOnSubmit: function(e) {
          //Prevent the form's submit
          e.preventDefault();

          //Validate the form
          validator.validate();

          //Verify if form is valid
          if (!validator._valid) {
            if (options.containerErrorsList) {
              validator.handleErrorsList(options.containerErrorsList);
            }
            return;
          }

          form.submit();
        },
        /**
         * Handle errors list at a defined container
         *
         * @param  {Object} containerErrorsList
         * @return {Void}
         */
        handleErrorsList: function(containerErrorsList) {
          var
            list = document.createDocumentFragment(),
            div = document.createElement('div'),
            p = document.createElement('p'),
            ul = document.createElement('ul'),
            li;

          containerErrorsList = document.querySelector(containerErrorsList);

          div.className = 'error-messages';
          p.textContent = validator.defaultErrorListMessage;
          div.appendChild(p);
          div.appendChild(ul);
          list.appendChild(div);

          validator.errorsMessages().forEach(function(element) {

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
         * @return {Void}
         */
        init: function() {

          //Define form {Object} by the {Object} form or by string
          form = typeof form === 'string' ? document.querySelector(form) : form;

          if (!validations) {
            //Validate the form
            validator._valid = true;
            console.log("Nothing to validate.");
          } else {
            //Set the messages
            validator._messages = validator.exchangeMessages(validator.defaultMessages, validations.messages);
          }

          //Brake the submit
          form.addEventListener('submit', validator.handleOnSubmit);
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