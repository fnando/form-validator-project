describe("Validator.PresenceValidator", function(){
  var validator, record, options;

  beforeEach(function(){
    record = {};
    options = {attribute: "name"};
    validator = new Validator.PresenceValidator(record, "name", options);
  });

  it("returns the default error message", function(){
    validator.isValid();
    expect(validator.errorMessage()).toEqual("can't be blank");
  });

  it("returns custom error message", function(){
    options.message = "custom";
    validator.isValid();
    expect(validator.errorMessage()).toEqual("custom");
  });

  it("rejects empty strings", function(){
    record.name = "";
    expect(validator.isValid()).toBeFalsy();
  });

  it("rejects undefined", function(){
    record.name = undefined;
    expect(validator.isValid()).toBeFalsy();
  });

  it("rejects whitespaces", function(){
    record.name = "\n\n\n    \t\t    ";
    expect(validator.isValid()).toBeFalsy();
  });

  it("accepts text", function(){
    record.name = "John Doe";
    expect(validator.isValid()).toBeTruthy();
  });
});
