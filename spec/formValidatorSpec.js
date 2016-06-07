/**
 * FormValidator Spec
 *
 * @author Carlos Henrique Carvalho de Santana <carlohcs@gmail.com>
 *
 * @date 2015-12-07 
 * 
 **/
describe("FormValidator", function() {
  'use strict';

  var
    formObject,
    formStringSelector;

  beforeEach(function() {
    formObject = document.createElement('form');
    formStringSelector = '#frm-selector';
  });

  afterEach(function() {
    formObject =
      formStringSelector = null;
  });

  it("should be a object", function() {
    var
      formValidate = new FormValidator(formObject);
    expect(formValidate).toEqual(jasmine.any(Object));
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

    formObject = createForm(fields, formObject);
    expect(formObject.childNodes.length).toEqual(4);
  });

  //Fail validation
  it("a fail validation", function() {
    var
      fields = {
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
      },
      validations = {
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
      },
      validateForm;

    formObject = createForm(fields, formObject);
    validateForm = new FormValidator(formObject, validations);
    expect(validateForm.valid()).toBeFalsy();
  });

  //Fail validation and errors messages
  it("a fail validation and get errors messages", function() {
    var
      fields = {
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
      },
      validations = {
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
      },
      validateForm,
      handleValidateForm,
      errorsMessages;

    formObject = createForm(fields, formObject);

    validateForm = new FormValidator(formObject, validations);
    handleValidateForm = validateForm.valid();
    errorsMessages = validateForm.errorsMessages();

    expect(errorsMessages.length).toBeGreaterThan(0);
    //Name
    expect(errorsMessages[0]).toEqual('This field is required');
    //E-mail
    expect(errorsMessages[1]).toEqual('Fill this field with the format "user@server.com"');
    //Password
    expect(errorsMessages[2]).toEqual('Fill this field with minimum of 8 characters.');
    //Password confirmations
    expect(errorsMessages[3]).toEqual('This field is wrong.');
  });

  //Success validation
  it("a success validation", function() {
    var
      fields = {
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
      },
      validations = {
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
      },
      validateForm;

    formObject = createForm(fields, formObject);
    validateForm = new FormValidator(formObject, validations);
    expect(validateForm.valid()).toBeTruthy();
  });

  //Success validation with custom method
  it("a success validation with a custom method", function() {
    var
      fields = {
        'name': {
          'type': 'text',
          'value': 'Carlos Henrique Carvalho de Santana'
        }
      },
      validations = {
        rules: {
          'name': {
            'myCustomMethod': true
          }
        }
      },
      validateForm;

    formObject = createForm(fields, formObject);
    validateForm = new FormValidator(formObject, validations);
    validateForm.addMethod("myCustomMethod", function(value, element, param) {
      return value.length > 8;
    }, "Message from a custom method.");
    expect(validateForm.valid()).toBeTruthy();
  });
});

function createForm(fields, formObject) {
  'use strict';

  var
    currentField,
    element,
    p;

  for (var fieldName in fields) {
    if (fields.hasOwnProperty(fieldName)) {
      currentField = fields[fieldName];

      p = document.createElement('p');
      element = document.createElement('input');
      element.name = fieldName;
      element.type = currentField.type;
      element.value = currentField.value;

      formObject.appendChild(element);
    }
  }

  return formObject;
}