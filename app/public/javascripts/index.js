$(document).ready(function() {
  /************** Constants ***********/
  var startingUserName = "dan";
  /******************* Begin Script ******************/
  userManager.init(startingUserName);
});

/************************************ USER CONTACT MODULE *******/
var userContactSettings = {
  contact: {},
  init: function(contact) {
    this.contact = contact;
    this.cacheDom();
    this.bindEvents();
    this.render();
    console.log("User Contact Setting Initialized");
  },
  destroy: function() {
    this.contact = {};
    this.unbindEvents();
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
    this.$form.find('fieldset input#updateEmail').val('');
    this.$form.find('fieldset input#updateCellPhone').val('');
    this.$form.find('fieldset input#updateCurrentAddress').val('');
    this.$form.find('fieldset input#updateAddressChangeDate').val('');
    //Display current contact in ContactSettings
    this.$info.find('span#userContactSettingsName').text(this.contact.Name);
    this.$info.find('span#userContactSettingsEmail').text(this.contact.Email);
    this.$info.find('span#userContactSettingsCellPhone').text(this.contact.CellPhone);
    this.$info.find('span#userContactSettingsCurrentAddress').text(this.contact.CurrentAddress);
    this.$info.find('span#userContactSettingsUpdateAddressDate').text(this.contact.UpdateAddressDate);
  },
  updateContact: function(e) {
    var contactIDtoLookup = this.contact._id; //For lookup in db

    updatedContact = this.contact;
    updatedContact.Email = this.$form.find('fieldset input#updateEmail').val();
    updatedContact.CellPhone = this.$form.find('fieldset input#updateCellPhone').val();
    updatedContact.CurrentAddress = this.$form.find('fieldset input#updateCurrentAddress').val();
    updatedContact.UpdateAddressDate = this.$form.find('fieldset input#updateAddressChangeDate').val();
    viewController.updateModel(updatedContact);
    viewController.updateViews(updatedContact);
  },
  updateView: function(contact) {
    this.contact = contact;
    this.render();
  }
};

/************************************ END USER CONTACT MODULE *******/

/************************************ USER DIRECTORY MODULE *******/
var userDirectory = {
  directory: {},
  init: function(contacts) {
    this.directory = contacts;
    this.cacheDom();
    this.bindEvents();
    this.render();
    console.log("User Directory Initialized");
  },
  cacheDom: function() {
    this.$dir = $('#userDirectory');
    this.$template = this.$dir.find('#userDirectoryTableTemplate');
    this.$formatted = this.$dir.find('#formatted');
  }, 
  bindEvents: function() {

  },
  render: function() {
    var html = Mustache.to_html(this.$template.html(), {directory:this.directory});
    this.$formatted.html(html);
  },
  updateView: function(contact) {
    for (var i = 0; i < this.directory.length; i++) {
      if (contact._id === this.directory[i]._id) {
        this.directory[i] = contact;
      }
      break;
    }
    this.render();
  }
}
/************************************ END USER DIRECTORY MODULE *******/

/************************************ GLOBAL DIRECTORY MODULE *******/
var globalDirectory = {
  directory: {},
  init: function(contacts) {
    this.directory = contacts;
    this.cacheDom();
    this.bindEvents();
    this.render();
    console.log("Global Directory Initialized");
  },
  cacheDom: function() {
    this.$dir = $('#globalDirectory');
    this.$template = this.$dir.find('#globalDirectoryTableTemplate');
    this.$formatted = this.$dir.find('#formattedGlobal');
  }, 
  bindEvents: function() {

  },
  render: function() {
    this.addPersonal(dataManager.contacts);
    var html = Mustache.to_html(this.$template.html(), {directory:this.directory});
    this.$formatted.html(html);
  },
  updateView: function(contact) {
    for (var i = 0; i < this.directory.length; i++) {
      if (contact._id === this.directory[i]._id) {
        this.directory[i] = contact;
      }
      break;
    }
    this.render();
  },
  addPersonal: function(userContacts) { //change this name plz

    var contactID;
    var contact;
    //Run through each directory entry
    for (var i = 0; i < this.directory.length; i++) {
      contact = this.directory[i];
      contact.inList = false;

      for(var j = 0; j < userContacts.length; j++) {
        contactID = userContacts[j]._id;

        if (contact._id == contactID) {//There's a match

          contact.inList = true;
          this.directory[i] = contact;
        }
      }
    }


  }
}
/************************************ END GLOBAL DIRECTORY MODULE *******/


/******************* View Controller *****************/
var viewController = {
  init: function() {
    console.log("View Controller Initialized");
    userContactSettings.init(dataManager.loadContacts(dataManager.contactID));
    userDirectory.init(dataManager.loadContacts());
  },
  globalDirectory_init: function() {
    globalDirectory.init(dataManager.globalContacts);
  },
  render: function() {
    userContactSettings.render();
    userDirectory.render();
    globalDirectory.render();
  },
  updateViews: function(contact) {
    userContactSettings.updateView(contact);
    userDirectory.updateView(contact);
    globalDirectory.updateView(contact);
  },
  updateModel: function(contact) {
    dataManager.updateContact(contact._id, contact);
  }
}
/******************* End View Controller ***************/


/******************* Data Manager - Manages PERSONAL data *****************/
var dataManager = {
  contactID: null, //User's personal contactID
  contacts: {}, //Base data model
  globalContacts: {},
  init: function(contactID) {
    this.contactID = contactID;
    this.getContacts();
  },
  getContacts: function() {

    //Get local user contacts
    $.getJSON({
      data: {contactID: this.contactID},
      url:'/contacts/',
      dataType: 'JSON'
    }).done(function(data) {
      console.log("User Data manager Initialized:");
      dataManager.contacts = data;
      viewController.init();

      //Get global contacts
      $.getJSON({
        url:'/contacts/',
        dataType: 'JSON'
      }).done(function(data) {
        console.log("Global data manager Initialized");
        dataManager.globalContacts = data;
        viewController.globalDirectory_init();
      });
    });

  },
  loadContacts: function(contactID) { //Returns a contact, for external use from User Contact
    //Run through, contacts, until it's been found
    if (contactID) {
      for (var i = 0; i < this.contacts.length; i++) {
        if (contactID === this.contacts[i]._id) {
          return this.contacts[i];
        }
      }
      return {error:"No such contact found| in Data Manager"};
    } else {
      return this.contacts;
    }
  },
  updateContact: function(contactID, updatedContact) { //Update front end model and in database
    for (var i = 0; i < this.contacts.length; i++) {
      if (contactID === this.contacts[i]._id) {
        this.contacts[i] = updatedContact;
        break;
      }
    }
    for (var i = 0; i < this.globalContacts.length; i++) {
      if (contactID === this.globalContacts[i]._id) {
        this.globalContacts[i] = updatedContact;
        break;
      }
    }
    $.ajax({
      type: "POST",
      data: JSON.stringify(updatedContact),
      contentType: "application/json",
      url:'/contacts/byID/' + contactID
    }).done(function(res) {
      //If successful
      if (res.msg === '') {
        console.log("Successful POST");
      } else {
        alert("Error: check log");
        console.log(res.msg);
      }  
    });
  }
}
/******************* End Data Manager *********************/

var userManager = {
  username: null,
  contactID: null,
  init: function(username) {
    userManager.username = username;
    this.getContactID();
  },
  getContactID: function() {
    $.getJSON('/users/contactID/' + this.username, function(data) {
      userManager.contactID = data[0].contactID;
      console.log("userManager Initialized");
      dataManager.init(userManager.contactID);
    });
  }
}