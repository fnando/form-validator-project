describe("Validator.Errors", function(){
  var errors;

  beforeEach(function(){
    errors = new Validator.Errors();
  });

  it("sets length", function(){
    expect(errors.length).toEqual(0);
  });

  it("is empty", function(){
    expect(errors.isEmpty()).toBeTruthy();
  });

  it("returns all error messages", function(){
    errors.add("name", "is required");
    errors.add("email", "is invalid");
    errors.add("email", "is already taken");

    expect(errors.all()["name"]).toEqual(["is required"]);
    expect(errors.all()["email"]).toEqual(["is invalid", "is already taken"]);
  });

  it("cleans all errors", function(){
    errors.add("name", "is required");
    errors.clean();

    expect(errors.isEmpty()).toBeTruthy();
    expect(errors.length).toEqual(0);
  });

  it("returns errors for an attribute", function(){
    errors.add("name", "is required");
    expect(errors.on("name")).toEqual(["is required"]);
  });

  it("returns empty array for missing attribute", function(){
    expect(errors.on("name")).toEqual([]);
  });
});
