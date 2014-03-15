describe("Validator.ListRenderer", function(){
  var form, input, validator, banner;

  beforeEach(function(){
    form = $("<form/>");
    input = $("<input name='name'/>").appendTo(form);
    banner = "Please check your data before continuing:";

    validator = new Validator.Form(form, [new Validator.ListRenderer(banner)]);
    validator.validate("presence", ":text", {message: "Name is required"});
  });

  it("sets banner", function(){
    validator.isValid();
    expect(form.find(".error-messages > p").text()).toEqual(banner);
  });

  it("sets error messages", function(){
    validator.isValid();
    expect(form.find(".error-messages > ul > li").text()).toEqual("Name is required");
  });

  it("cleans error messages", function(){
    validator.isValid();
    input.val("John Doe");
    validator.isValid();

    expect(form.find(".error-messages").length).toEqual(0);
  });
});
