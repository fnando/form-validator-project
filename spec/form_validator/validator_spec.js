describe("Validator", function(){
  describe("when record is valid", function(){
    var validator, record;

    beforeEach(function(){
      record = {name: "John Doe"};
      validator = new Validator();
      validator.validate("presence", "name", {message: "Name is required"});
    });

    it("returns true", function(){
      expect(validator.isValid(record)).toBeTruthy();
    });
  });

  describe("when record is invalid", function(){
    var validator, record;

    beforeEach(function(){
      record = {name: "John Doe", email: null};
      validator = new Validator();
      validator.validate("presence", "name", {message: "Name is required"});
      validator.validate("presence", "email", {message: "E-mail is required"});
    });

    it("returns false", function(){
      expect(validator.isValid(record)).toBeFalsy();
    });

    it("has error messages", function(){
      validator.isValid(record);
      expect(validator.errors.length).toEqual(1);
    });
  });
});
