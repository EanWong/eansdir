$(document).ready(function() {

  //test: btnAddContact - POST for /contacts/:name
  $('#btnAddContact').on('click',addContact);

  //test: btnDeleteContact - DELETE for /contacts/:name
  $('#btnDeleteContact').on('click',deleteContact);

  $('#btnUpdateContact').on('click', updateContact);

  populateContactsDirectory();
  listUsers();
  
  var username;

  if (username) {
    switchUser(username);
  }


  $('#btnCreateUser').on('click', createUser);
  $('#btnDeleteUser').on('click', deleteUser);
  
  $('#btnLinkUserContact').on('click', linkUserContact);

  $('#btnLogin').on('click', loginUser);

  $('#btnSwitchUser').on('click', switchUser);

  $('#btnSaveContact').on('click', saveContact);
  $('#btnRemoveContact').on('click', removeContact);

});

function addContact(e) {
  e.preventDefault();
  
  var contactName = $('#addContact fieldset input#nameAddContact').val();
  var newContact = {};
  //If manually input contact info, use it
  if (contactName) { 
    newContact = {
      Name: contactName,
      Email: $('#addContact fieldset input#emailAddContact').val(),
      CellPhone: $('#addContact fieldset input#cellPhoneAddContact').val(),
      CurrentAddress: $('#addContact fieldset input#currentAddressAddContact').val(),
      UpdateAddressDate: $('#addContact fieldset input#updateAddressDateAddContact').val(),
    }
  
  } else { //No manually input contact info used; use default
    contactName = 'Dan';
    newContact = {
      Name: contactName,
      Email: 'dan@test.com',
      CellPhone: '0001112222',
      CurrentAddress: 'Somewhere in Mexico',
      UpdateAddressDate: '10/01/2016',
    }
  }

  //Use AJAX to post the object to the addContact service
  $.ajax({
    type: 'POST',
    data: newContact,
    url:'/contacts/byName/' + contactName,
    dataType: 'JSON'
  }).done(function(res) {
    
    //If successful
    if (res.msg === '') {
      console.log("Successful POST");
    } else {
      alert("Error: check log");
      console.log(res.msg);
    }

  });
};

function deleteContact(e) {
  e.preventDefault();

  var contactName = $('#nameDeleteContact').val();

  //Use ajax to send DELETE request on a given name
  $.ajax({
    type: 'DELETE',
    url:'/contacts/byName/' + contactName,
    dataType: 'JSON'
  }).done(function(res) {
        //If successful
    if (res.msg === '') {
      console.log("Successful DELETE");
    } else {
      alert("Error: check log");
      console.log(res.msg);
    }
  });

};

function updateContact(e) {
  e.preventDefault();

  var contactName = $('#updateContact fieldset input#nameUpdateContact').val();
  console.log(contactName);
  var updatedContact = {
    Name: $('#updateContact fieldset input#newNameUpdateContact').val(),
    Email: $('#updateContact fieldset input#emailUpdateContact').val(),
    CellPhone: $('#updateContact fieldset input#cellPhoneUpdateContact').val(),
    CurrentAddress: $('#updateContact fieldset input#currentAddressUpdateContact').val(),
    UpdateAddressDate: $('#updateContact fieldset input#updateAddressDateUpdateContact').val(),
  }

  console.log(updatedContact);
  $.ajax({
    type: "PUT",
    data: updatedContact,
    url:'/contacts/byName/' + contactName,
    dataType: 'JSON'
  }).done(function(res) {

    //If successful
    if (res.msg === '') {
      console.log("Successful PUT");
    } else {
      alert("Error: check log");
      console.log(res.msg);
    }  
  });
  
};

function populateContactsDirectory() {
  console.log("Populating directory");
  $.getJSON('/contacts/', function(data) {
    console.log(data);
    $('#contactsDirectory').html(JSON.stringify(data));
  });
};

function populateUserDirectory(username) {
  console.log("Populating user directory");

  //Get contactID of user
  $.getJSON('/users/contactID/' + username, function(data) {
      console.log(data);
     if (data[0] != null) {
      var contactID = data[0].contactID;

      //Get contacts related to a particular contact
      $.get({
        data: {contactID: contactID},
        url:'/contacts/',
        dataType: 'JSON'
      }).done(function(res) {
        console.log(res);
        $('#userDirectory').html(JSON.stringify(res));
      });
    }
  });
};

function createUser(e) {
  e.preventDefault();
  //Get input
  var username = $('input#createUserName').val();
  var password = $('input#createPassword').val();
  var data = {username: username, password:password};
  console.log("Add user Button pressed");
  console.log(data);
  
  $.ajax({
        type: "POST",
        data: {username: username, password:password},
        url:'/users/',
        dataType: 'JSON'
      }).done(function(res) {
        //Done adding user to collection, now link with particular contact
        console.log(res.msg);
      });
  

};

function listUsers() {
  $.getJSON('/users/', function(data) {
    console.log(data);
    $('#userList').html(JSON.stringify(data));
  });
};

function linkUserContact(e) {
  e.preventDefault();
  var username = $('input#linkUserName').val();
  var password = $('input#linkUserPassword').val();
  var contactID = $('input#linkUserContactID').val();
  var data = {username:username, password:password, contactID:contactID};
  console.log("Pressed link user and contact button");
  console.log(data);

  
  $.ajax({
        type: "PUT",
        data: {username: username, password:password, contactID:contactID},
        url:'/users/',
        dataType: 'JSON'
      }).done(function(res) {
        //Done adding user to collection, now link with particular contact
        console.log(res.msg);
      }); 

}

function deleteUser(e) {
  e.preventDefault();

  var username = $('#userNameDeleteUser').val();
  var password = $('#passwordDeleteUser').val();
  var data = {"username": username, "password": password};
  console.log("Pressed delete button for user ");
  console.log(data);

  //Use ajax to send DELETE request on a given name
  $.ajax({
    type: 'DELETE',
    url:'/users/',
    data: {username: username, password: password},
    dataType: 'JSON'
  }).done(function(res) {
        //If successful
    if (res.msg === '') {
      console.log("Successful DELETE");
    } else {
      alert("Error: check log");
      console.log(res.msg);
    }
  });

};

function loginUser() {
  console.log("login Button clicked");
  var username = $('input#loginUserName').val();
  var password = $('input#loginPassword').val();

  $.ajax({
        type: "POST",
        data: {username: username, password:password},
        url:'/users/auth',
        dataType: 'JSON'
      }).done(function(res) {
        console.log(res.msg);
      });

};

/********** Changing session for each user ******/
function switchUser() {
  var username = $('input#nameSwitchUser').val();
  console.log("Pressed switchUser button: " + username);
  if (username){

    //Get contactID associated with username
    $.getJSON('/users/contactID/' + username, function(data) {
      if (data[0] != null) {
        //set context
        var contactID = data[0].contactID;
        console.log("Contact ID is " + contactID);
        //get contactinfo by ID
        $.ajax({
          type: "GET",
         // data: {contactID: contactID},
          url:'/contacts/byID/' + contactID,
          dataType: 'JSON'
        }).done(function(res) {
          if (res[0] != null) {
            console.log("Here's the response");
            console.log(res);
            populateUserDirectory(username);            
            userContactSettings.init(res[0].Name);
          }

        });
  
      } else {
        console.log("Username '" + username + "' is not in database");
      }
      
     // $('#userList').html(JSON.stringify(data));
    });

  }
};

function saveContact() {
  contactRoot = $('input#rootIDSaveContact').val();
  contactToSave = $('input#idSaveContact').val();
  console.log("Save contact button pressed");
  console.log("Root ID = " + contactRoot);
  console.log("Contact to Save = " + contactToSave);

  //Add contact to my particular contact
  $.ajax({
    type: "POST",
    data: {contactRoot: contactRoot},
    url:'/contacts/link/' + contactToSave,
    dataType: 'JSON'
  }).done(function(res) {
    console.log("Returned from linking contact");
    console.log(res);
  });
    
};

function removeContact() {
  contactRoot = $('input#rootIDRemoveContact').val();
  contactToRemove = $('input#idRemoveContact').val();
  console.log("Button pressed to remove contact");

  console.log("Root ID = " + contactRoot);
  console.log("Contact to Save = " + contactToRemove);
  $.ajax({
    type: "DELETE",
    data: {contactRoot: contactRoot},
    url:'/contacts/link/' + contactToRemove,
    dataType: 'JSON'
  }).done(function(res) {
    console.log("Returned from unlinking contact");
    console.log(res);
  });
    

}

//Got rid of anonymous function to hold the module and unglobalize it
//(function() {

  var userContactSettings = {
    contact: {},
    init: function(contactName) {
      this.getContact(contactName);
      this.cacheDom();
      this.bindEvents();
      //this.render();
    },
    cacheDom: function() {
      this.$el = $('#userContactSettings');
      this.$btnUpdate = this.$el.find('fieldset button#updateContactBtn');
      this.$info = this.$el.find('#userContactSettingsInfo');
      this.$form = this.$el.find('#userContactSettingsForm');
    },
    bindEvents: function() {
      this.$btnUpdate.on('click', this.updateContact.bind(this));
    },
    render: function() {
      //Clear form
      //Display current contact in ContactSettings
      this.$info.find('span#userContactSettingsName').text(this.contact.Name);
      this.$info.find('span#userContactSettingsEmail').text(this.contact.Email);
      this.$info.find('span#userContactSettingsCellPhone').text(this.contact.CellPhone);
      this.$info.find('span#userContactSettingsCurrentAddress').text(this.contact.CurrentAddress);
      this.$info.find('span#userContactSettingsUpdateAddressDate').text(this.contact.UpdateAddressDate);
    },
    getContact: function(contactName) {
      $.getJSON('/contacts/byName/' + contactName, function(data) {
        userContactSettings.contact = data[0]; //data is an array, first el is the contact unless error
        userContactSettings.render();
      });
    },
    updateContact: function(e, updatedContactInfo) {
      var contactNametoLookup = this.contact.Name; //For lookup in db

      //Get vals from contact
      var updatedContact = (updatedContactInfo || {
        Name: contactNametoLookup,
        Email: this.$form.find('fieldset input#updateEmail').val(),
        CellPhone: this.$form.find('fieldset input#updateCellPhone').val(),
        CurrentAddress: this.$form.find('fieldset input#updateCurrentAddress').val(),
        UpdateAddressDate: this.$form.find('fieldset input#updateAddressChangeDate').val(),
      });

      $.ajax({
        type: "PUT",
        data: updatedContact,
        url:'/contacts/byName/' + contactNametoLookup,
        dataType: 'JSON'
      }).done(function(res) {

        //If successful
        if (res.msg === '') {
          console.log("Successful PUT");
        } else {
          alert("Error: check log");
          console.log(res.msg);
        }  
      });

      this.contact = updatedContact;
      this.render();
    }
  };
  
//})();
//End of anonymous containment
