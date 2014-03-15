describe("Validator.InlineErrorRenderer", function(){
  var form, input, validator;

  beforeEach(function(){
    form = $("<form/>");
    input = $("<input name='name'/>").appendTo(form);

    validator = new Validator.Form(form, [new Validator.InlineErrorRenderer()]);
    validator.validate("presence", ":text", {message: "Name is required"});
  });

  it("sets error message", function(){
    validator.isValid();
    console.log(form.html());
    expect(input.next(".error").text()).toEqual("Name is required");
  });

  it("cleans error messages", function(){
    validator.isValid();
    input.val("John Doe");
    validator.isValid();

    expect(input.next(".error").length).toEqual(0);
  });
});
