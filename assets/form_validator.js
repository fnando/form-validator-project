/**
 * Form Validator by Carlos Henrique Carvalho de Santana <carlohcs@gmail.com>
 * 2015-11-30
 */

 var FormValidator = (function(formObject, validations) {

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
 				return value < minValue;
 			},
	 		max: function(value, maxValue) {
 				return value > maxValue;
 			},
	 		equalTo: function(value, elementEqual) {
	 			var elEqual = document.querySelector(elementEqual);
 				return value === elEqual.value;
 			}
 		},
 		getFormFields: function() {
 			var fields = [];
 			fields = formObject.querySelectorAll("input");
 			
 			validator._fields = fields;

 			return validator._fields;
 		},
 		addContainerFieldErrorClass: function(field) {
 			field.parentElement.className = validator._containerFieldErrorClass;

 			console.log("Parent -> ", field.parentElement);
 			console.log("Container class -> ", validator._containerFieldErrorClass);
 		},
 		removeContainerFieldErrorClass: function(field) {
 			field.parentElement.className = '';
 		},
 		//Validate and set the valid var 
 		validate: function() {
 			var valid = false;

 			var fields = validator.getFormFields();

 			for(var i = 0; i < fields.length; i++){

 				var field = fields[i];

 				if(field.name in validations.rules) {
 					
 					var rules = validations.rules[field.name];

 					for(var rule in rules) {
 						
 					// 	//validator._validations[]
 						//console.log("Rule -> ", rule, "\n");
 						//console.log("Value -> ", rules[rule], "\n");
 						
 						var method = rule;
 						var args = rules[rule];

 						if(validator._validations[method]) {
 							//console.log(validator._validations[method], " -> ", validator._validations[method](field, args));
 							
 							if(!validator._validations[method](field.value, args)){
 								validator.addContainerFieldErrorClass(field);
 							}
 							else
 								validator.removeContainerFieldErrorClass(field);
 						}
 					}
 				}

 			};

 			validator._valid = valid;
 		},
 		onSubmit: function(e) {

			e.preventDefault();

			validator.validate();
						
			if(validator._valid) {
				formObject.submit();
			}
		}
 	};

 	var defaultMessages = {
 		required: 'This field is required',
 		email: 'Fill this field with the format "user@server.com"',
 		min: 'Fill this field with minimun of {0} characters.',
 		max: 'Fill this field with maximun of {0} characters.',
 		equalTo: 'This field is not equal to {0}'
 	};

 	//Brake the submit
 	formObject.onsubmit = validator.onSubmit;
 	
 	return {
 		//Return if form is valid
 		valid: validator.validate
 	};

 });