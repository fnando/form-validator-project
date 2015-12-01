//Get the form to validate
var form = document.getElementsByTagName('form')[0];

//Validations to be executed
var validations = {
	rules: {
		'name': {
			'required': true
		},
		'email': {
			'email': true
		},
		'password': {
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

	//Instantiate form
	var validateForm = new FormValidator(form, validations);
	//console.log(validateForm);
	
	//Validation and ajax action
	/*form.onsubmit = function(e){
		
		e.preventDefault();

		if(validateForm.valid())
		{
			alert("Enviando dados via ajax...");
		}
	};*/
};