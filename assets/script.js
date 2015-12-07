//Get the form to validate
var form = document.getElementsByTagName( 'form' )[ 0 ];

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
			'required': false,
			'min': 8
		},
		'password_confirmation': {
			'required': false,
			'equalTo': "input[name='password']"
		}
	}/* 
	//Custom fields messages
	,messages: {
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
	}*/
};

//Custom options to FormValidator
var validateOptions = {

	//Container errors list
	_containerErrorsList: '#error-messages-content',

	//Default title before container errors list
	_defaultErrorListMessage: 'Por favor, verifique os erros.',

	//Exchange default messages
	_defaultMessages: {
 		required: 'Este campo é requerido.',
 		email: 'Preencha este campo no formato "usuario@servidor.com"',
 		min: 'Preencha este campo com no mínimo de {0} caracteres.',
 		max: 'Preencha este campo com no máximo of {0} caracteres.',
 		equalTo: 'Este campo não é igual ao anterior'
 	}

};

window.onload = function() {

	//Instantiate form
	var validateForm = new FormValidator( form, validations, validateOptions );

	//Get form by selector
	//var validateForm = new FormValidator('body > form', validations);

	//Custom method
	// validateForm.addMethod("myCustomMethod", function( value, element, param ){

	// 	return value.length > 8;

	// }, "Message from my custom method.");
	
	//Validation with ajax action
	// form.onsubmit = function(e){
		
	// 	e.preventDefault();

	//Handle the validate 
	// 	validateForm.valid();

	//Show message errors
	// 	console.log("List of errors -> ", validateForm.errorsMessages());

	// 	if( validateForm.valid() )
	// 	{
	// 		alert("Sending the data...");
	// 	}
	// };
};