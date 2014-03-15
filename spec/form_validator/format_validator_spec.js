describe("Validator.FormatValidator", function(){
  var validator, record, options;

  beforeEach(function(){
    record = {};
    options = {attribute: "username", format: /^[a-z0-9_-]+$/i};
    validator = new Validator.FormatValidator(record, options);
  });

  it("returns the default error message", function(){
    validator.isValid();
    expect(validator.errorMessage()).toEqual("is an invalid format");
  });

  it("returns custom error message", function(){
    options.message = "custom";
    validator.isValid();
    expect(validator.errorMessage()).toEqual("custom");
  });

  it("rejects invalid format", function(){
    record.username = "this is invalid";
    expect(validator.isValid()).toBeFalsy();
  });

  it("accepts valid format", function(){
    record.username = "johndoe";
    expect(validator.isValid()).toBeTruthy();
  });
});
