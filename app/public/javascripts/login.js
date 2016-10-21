$(document).ready(function() {

  $('#btnCreateUser').on('click',createUser);
  $('#btnLogin').on('click', loginUser);

});

function createUser() {
  // Get input

  var newUser = {
      username: $('#createUser fieldset input#desiredUserName').val(),
      password: $('#createUser fieldset input#desiredPassword').val(),
     }

     console.log(newUser);

 $.post('/users', newUser, 
    function(returnedData) {
      if (typeof returnedData.redirect == 'string') {
        $.post('/login', newUser, function(returnedData) {
          if (typeof returnedData.redirect == "string") {
            window.location = returnedData.redirect;
          }
        }).fail(function() {
          console.log("error");
        });
        
      }
  }).fail(function() {
    console.log("error");
  });

}

function loginUser() {
  var user = {
      username: $('#userLoginForm fieldset input#loginUserName').val(),
      password: $('#userLoginForm fieldset input#loginPassword').val(),
  }
  $.post('/login', user, 
    function(returnedData) {
      if (typeof returnedData.redirect == 'string') {
        window.location = returnedData.redirect;
      }
    }).fail(function() {
      console.log("error");
    });
}