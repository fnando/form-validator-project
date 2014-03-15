describe("Validator.ConfirmationValidator", function(){
  var validator, record, options;

  beforeEach(function(){
    record = {};
    options = {attribute: "password"};
    validator = new Validator.ConfirmationValidator(record, "password", options);
  });

  it("returns the default error message", function(){
    validator.isValid();
    expect(validator.errorMessage()).toEqual("must be equal to the confirmation");
  });

  it("returns custom error message", function(){
    options.message = "custom";
    validator.isValid();
    expect(validator.errorMessage()).toEqual("custom");
  });

  it("rejects different values", function(){
    record.password = "test";
    record.password_confirmation = "invalid";
    expect(validator.isValid()).toBeFalsy();
  });

  it("accepts equal values", function(){
    record.password = "test";
    record.password_confirmation = "test";
    expect(validator.isValid()).toBeTruthy();
  });
});
