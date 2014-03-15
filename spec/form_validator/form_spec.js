describe("Validator.Form", function(){
  var form, input, validator;

  beforeEach(function(){
    form = $("<form/>");
    input = $("<input name='name'/>").appendTo(form);

    validator = new Validator.Form(form);
    validator.validate("presence", ":text", {message: "is required"});
  });

  it("isn't valid", function(){
    expect(validator.isValid()).toBeFalsy();
  });

  it("is valid", function(){
    input.val("John Doe");
    expect(validator.isValid()).toBeTruthy();
  });
});
