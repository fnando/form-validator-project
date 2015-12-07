/*var customMatchers = {

	toBeInstanceOf : function( actual, expected ) {
		console.log(actual);
		console.log(expected);
		return this.actual instanceof expected && this.actual.length > 0;
    
	}

};*/

//jasmine.addMatchers(customMatchers);

	//https://gist.github.com/m4nuC/4052863
	// this.addMatchers({
	// 	toBeInstanceOf : function( expected ) {
	// 		return this.actual instanceof expected && this.actual.length > 0;
	// 	},

	// 	toBeA: function( expected ) {
	// 		return typeof this.actual === expected;
	// 	}
	
// });

describe("FormValidator Suite Test", function() {

	var	formObject,
		formStringSelector;

	beforeEach(function() {

		formObject = document.createElement('form'),
		formStringSelector = '#frm-selector';

	});

	it("should be a object", function() {

		// and FormValidator instance
		
		var formValidate = new FormValidator( formObject );
		
		expect( formObject ).toEqual( jasmine.any( Object ) );
		
		//expect( formValidate ).toBe( FormValidator );
		//expect( formValidate ).toEqual( jasmine.any( FormValidator ) );

	});

	it("build a form", function() { 

		var fields = {
			'name': {
				'type': 'text',
				'value': ''
			},
			'email': {
				'type': 'text',
				'value': ''
			},
			'password': {
				'type': 'password',
				'value': ''
			},
			'password_confirmation': {
				'type': "password",
				'value': ''
			}
		};

		var currentField,
			element;

		for(var prop in fields) {

			currentField = fields[prop];

			p = document.createElement( 'p' );
			element = document.createElement( 'input' );
			element.type = currentField.type;
			element.value = currentField.value;
			
			formObject.appendChild( element );

		}

		expect( formObject.childNodes.length ).toEqual( 4 );

	});
	
	//Fail validation
	it("demonstrate a fail validation", function() { 

		var fields = {
			'name': {
				'type': 'text',
				'value': ''
			},
			'email': {
				'type': 'text',
				'value': ''
			},
			'password': {
				'type': 'password',
				'value': ''
			},
			'password_confirmation': {
				'type': 'password',
				'value': ''
			}
		};


		var currentField,
			element;

		for(var fieldName in fields) {

			currentField = fields[fieldName];

			p = document.createElement( 'p' );
			element = document.createElement( 'input' );
			element.name = fieldName;
			element.type = currentField.type;
			element.value = currentField.value;
			
			formObject.appendChild( element );

		}

		var validations = {
			rules: {
				'name': {
					'required': true
				},
				'email': {
					'required': true,
					'email': true
				},
				'password': {
					'min': 8
				},
				'password_confirmation': {
					'equalTo': "input[name='password']"
				}
			}
		};

		var validateForm = new FormValidator( formObject, validations );

		expect( validateForm.valid() ).toBeFalsy();

	});

	//Fail validation and errors messages
	it("demonstrate a fail validation and get errors messages", function() { 

		var fields = {
			'name': {
				'type': 'text',
				'value': ''
			},
			'email': {
				'type': 'text',
				'value': ''
			},
			'password': {
				'type': 'password',
				'value': ''
			},
			'password_confirmation': {
				'type': 'password',
				'value': ''
			}
		};


		var currentField,
			element;

		for(var fieldName in fields) {

			currentField = fields[fieldName];

			p = document.createElement( 'p' );
			element = document.createElement( 'input' );
			element.name = fieldName;
			element.type = currentField.type;
			element.value = currentField.value;
			
			formObject.appendChild( element );

		}

		var validations = {
			rules: {
				'name': {
					'required': true
				},
				'email': {
					'required': true,
					'email': true
				},
				'password': {
					'required': true,
					'min': 8
				},
				'password_confirmation': {
					'equalTo': "input[name='password']"
				}
			}
		};

		var validateForm = new FormValidator( formObject, validations ),
			handleValidateForm = validateForm.valid(),
			errorsMessages = validateForm.errorsMessages();

		expect( errorsMessages.length ).toBeGreaterThan( 0 );
			
		//Name
		expect( errorsMessages[0] ).toEqual( 'This field is required' );

		//E-mail
		expect( errorsMessages[1] ).toEqual( 'Fill this field with the format "user@server.com"' );

		//Password
		expect( errorsMessages[2] ).toEqual( 'Fill this field with minimun of 8 characters.' );

		//Password confirmations
		expect( errorsMessages[3] ).toEqual( 'This field is wrong.' );

	});

	//Success validation
	it("demonstrate a success validation", function() { 

		var fields = {
			'name': {
				'type': 'text',
				'value': 'Carlos Henrique Carvalho de Santana'
			},
			'email': {
				'type': 'text',
				'value': 'carlohcs@gmail.com'
			},
			'password': {
				'type': 'password',
				'value': '12345678'
			},
			'password_confirmation': {
				'type': 'password',
				'value': '12345678'
			}
		};


		var currentField,
			element;

		for(var fieldName in fields) {

			currentField = fields[fieldName];

			p = document.createElement( 'p' );
			element = document.createElement( 'input' );
			element.name = fieldName;
			element.type = currentField.type;
			element.value = currentField.value;
			
			formObject.appendChild( element );

		}

		var validations = {
			rules: {
				'name': {
					'required': true
				},
				'email': {
					'required': true,
					'email': true
				},
				'password': {
					'min': 8
				},
				'password_confirmation': {
					'equalTo': "input[name='password']"
				}
			}
		};

		var validateForm = new FormValidator( formObject, validations );

		expect( validateForm.valid() ).toBeTruthy();

	});


});