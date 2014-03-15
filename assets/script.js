$(function(){
  var emailFormat = /^[a-z0-9]+([._][a-z0-9]+)*(\+[a-z0-9_-]+)?@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,4}$/i;
  var form = $("form");
  var renderers = [
      new Validator.InlineErrorRenderer()
    , new Validator.ListRenderer("Please double check your data before continuing:")
    , new Validator.ContainerRenderer()
  ];

  var validator = new Validator.Form(form, renderers);
  validator.validate("presence", "#name", {message: "Name is required"});
  validator.validate("format", "#email", {message: "E-mail is invalid", format: emailFormat});
  validator.validate("presence", "#password", {message: "Password is required"});
  validator.validate("length", "#password", {message: {min: "Password must have at least 8 characters"}, min: 8});
  validator.validate("confirmation", "#password", {message: "Password must be equal to the confirmation"});

  form.on("submit", function(event){
    event.preventDefault();

    if (validator.isValid()) {
      alert("Your form data is valid!\nNot submitting the form for practical reasons.");
      // this.submit();
    }
  });
});
