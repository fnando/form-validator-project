//Get the form to validate
var form = document.getElementsByTagName('form')[0];

//Validations to be executed
var validations = {
	rules: {
		'name': {
			'required': true,
			'greather': true
		},
		'email': {
			'required': true,
			'email': true
		},
		'password': {
			//'required': false,
			'min': 8
		},
		'password_confirmation': {
			'equalTo': "input[name='password']"
		}
	},
	messages: {
		'name': {
			'required': 'Este campo não pode ficar em branco.'
		},
		'email': {
			'required': 'Este campo não pode ficar em branco.',
			'email': 'Informe um e-mail válido'
		},
		'password': {
			'min': "Informe ao menos {0} caracteres."
		},
		'password_confirmation': {
			'equalTo': "A confirmação de senha não confere."
		}
	}
};


window.onload = function(){

	var optionsValidate = {
		containerErrorsList: '.error-messages'
	};

	//Instantiate form
	var validateForm = new FormValidator(form, validations, optionsValidate);
	//var validateForm = new FormValidator('body > form', validations);

	validateForm.addMethod("greather", function(value, element, param){

		return value.length > 8;

	}, "Greather than 8.");

	//console.log(validateForm);
	
	//Validation and ajax action
	// form.onsubmit = function(e){
		
	// 	e.preventDefault();

	// 	validateForm.valid();

	// 	//console.log("List of errors -> ", validateForm.errorsMessages());

	// 	if(validateForm.valid())
	// 	{
	// 		alert("Enviando dados via ajax...");
	// 	}
	// };
};