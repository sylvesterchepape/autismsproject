(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms)
      .forEach(function (form) {
          form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  event.preventDefault()
                  event.stopPropagation()
              }

              form.classList.add('was-validated')
          }, false)
      })
})()
/*
const schema = joi.object({
  username: joi.string().min(3).max(30).label("Name").required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .label("Email")
    .required(),
  mobileNumber: joi
    .string()
    .ruleset.min(10)
    .max(10)
    .pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
    .rule({ keep: true, message: "Invalid Mobile Number" }),

    password: joi.string().alphanum().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).label("Password").required()
  
});

function validate(dataObject) {
  // dataObject = {username:"",email:""}
  const result = schema.validate(
    {
      ...dataObject,
    },
    { abortEarly: false }
  );
  return result;
}

// contact form

$(document).ready(function () {
  $(".contact-form").on("submit", function (e) {
    // prevent form submission
    e.preventDefault();
    const contactForm = this;

    const usernameField = $(contactForm).find("#username");

    const emailField = $(contactForm).find("#email");

    const mobileNumberField = $(contactForm).find("#mobileNumber");

    const passwordField = $(contactForm).find("#password");






    // bootstrap alert message
    const responseMessage = $(this).find("#responseMessage");

    const formErrors = validate({
      username: usernameField.val(),
      email: emailField.val(),
     
      mobileNumber: mobileNumberField.val(),
      password: passwordField.val(),
     
    });

    const initialErros = {
      username: null,
      email: null,
      mobileNumber: null,
      password: null

    };

    if (formErrors?.error) {
      const { details } = formErrors.error;
      details.map((detail) => {
        initialErros[detail.context.key] = detail.message;
      });
    }

    // write the errors to the UI
    Object.keys(initialErros).map((errorName) => {
      if (initialErros[errorName] !== null) {
        // if the error exist
        // username input #username
        $(`#${errorName}`).removeClass("is-valid").addClass("is-invalid");

        // invalid feedback element
        $(`#${errorName}`)
          .next(".invalid-feedback")
          .text(initialErros[errorName]);
      } else {
        $(`#${errorName}`).removeClass("is-invalid").addClass("is-valid");
      }
    });

    // to submit
    let isFormValid = Object.values(initialErros).every(
      (value) => value === null
    );
    if (isFormValid) {
     $(".contact-form").onsubmit();
  
    } else console.log("check errors");
  });
});*/