const nav = document.querySelector(".navbar");
var catText=document.querySelector(".cat-text");
const btnScrollToTop =document.querySelector("#btnScrollToTop");


window.addEventListener("scroll",function(){
    nav.classList.toggle("bg-extra",window.scrollY >1);
})

//text appear

window.addEventListener("scroll",function(){
    var introPosition=catText.getBoundingClientRect.top;
    var screenPosition = window.innerHeight/2;
 
    if(introPosition < screenPosition){
        catText.classList.add(".intro-appear");
    }
});

//scroll to the top button event
btnScrollToTop.addEventListener("click", function(){
  
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
})



// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


//form toggler
function _id(name){
  return document.getElementById(name);
}
function _class(name){
  return document.getElementsByClassName(name);
}
_class("toggle-password")[0].addEventListener("click",function(){
  _class("toggle-password")[0].classList.toggle("active");
  if(_id("password").getAttribute("type") == "password"){
    _id("password").setAttribute("type","text");
  } else {
    _id("password").setAttribute("type","password");
  }
});

_id("password").addEventListener("focus",function(){
  _class("password-policies")[0].classList.add("active");
});
_id("password").addEventListener("blur",function(){
  _class("password-policies")[0].classList.remove("active");
});

_id("password").addEventListener("keyup",function(){
  let password = _id("password").value;
  
  if(/[A-Z]/.test(password)){
    _class("policy-uppercase")[0].classList.add("active");
  } else {
    _class("policy-uppercase")[0].classList.remove("active");
  }
  
  if(/[0-9]/.test(password)){
    _class("policy-number")[0].classList.add("active");
  } else {
    _class("policy-number")[0].classList.remove("active");
  }
  
  if(/[^A-Za-z0-9]/.test(password)){
    _class("policy-special")[0].classList.add("active");
  } else {
    _class("policy-special")[0].classList.remove("active");
  }
  
  if(test(password).length > 7){
    _class("policy-length")[0].classList.add("active");
  } else {
    _class("policy-length")[0].classList.remove("active");
  }
});



