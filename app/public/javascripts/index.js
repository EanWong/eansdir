$(document).ready(function() {
  /************** Constants ***********/
  var startingUserName = $('#user').val();
  console.log("Starting username for loading is:" + startingUserName);
  /******************* Begin Script ******************/
  userManager.init(startingUserName);
});

/************************************ USER MENU MODULE *******/

/************************************ END MENU MODULE *******/

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
    updatedContact.Name = this.$form.find('fieldset input#updateName').val();
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
    this.handleMe();
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
              //Maybe change later?
              console.log("Inside updateView");
      }
      break; 
    }
    this.render();
  },
  handleMe: function() { //Maybe the wrong place for this
    var meID = dataManager.contactID
    for (var i = 0; i < this.directory.length; i++) {
        if (this.directory[i]._id == meID) {
          //console.log("There's a match!" + this.directory[i]._id + dataManager.contactID);
          this.directory[i].isMe = true;
        }
    }
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
    //this.$btnAddRemoveContact = this.$formatted.find('table tbody tr td button');
  }, 
  cacheDynamicDom: function() {
    this.$table = this.$formatted.find('#globalDirectoryTable');
    this.$btnAddRemoveContact = this.$table.find('button');
  },
  bindEvents: function() {
  },
  bindDynamicEvents: function() {
    this.$btnAddRemoveContact.on('click', this.addRemoveContactSwitch.bind(this, this.$btnAddRemoveContact));
  },
  render: function() {
    this.updatePersonalMatches(dataManager.contacts);
    var html = Mustache.to_html(this.$template.html(), {directory:this.directory});
    this.$formatted.html(html);

    //May cause problems, can this be done better?
    this.cacheDynamicDom();
    this.bindDynamicEvents(); 
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
  addRemoveContactSwitch: function(context, $element) {
    var buttonClass = $element.target.className;
    var contact_id = $element.target.id;
    console.log(contact_id);
    console.log(buttonClass);
    if (buttonClass.localeCompare('btnAddContact') == 0) {
      console.log("Diverting to addContact");
      this.addContact(contact_id);
    } else if (buttonClass.localeCompare('btnRemoveContact') == 0) {
      console.log("Diverting to removeContact");
      this.removeContact(contact_id);
    }
  },
  addContact: function(contact_id) {
    if (contact_id)
      viewController.addToModel(contact_id);
  },
  removeContact: function(contact_id) {
    if (contact_id)
      viewController.removeFromModel(contact_id);
  },
  updatePersonalMatches: function(userContacts) { //change this name plz

    var contactID;
    var contact;
    //Run through each directory entry
    for (var i = 0; i < this.directory.length; i++) {
      contact = this.directory[i];
      contact.inList = false;

      for(var j = 0; j < userContacts.length; j++) {
        contactID = userContacts[j]._id;

        if (contact._id == contactID) {//There's a match between global / user directory

          contact.inList = true;
          this.directory[i] = contact;
        }
      }
      
      //Maybe change later?
      if (contact._id == dataManager.contactID) {
        //console.log("There's a match!" + contact._id + dataManager.contactID);
        contact.isMe = true;
      }

    }

    //Set personal directory to something specific?


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
  },
  addToModel: function(contact_id) {
    dataManager.addContact(contact_id);
  },
  removeFromModel: function(contact_id) {
    dataManager.removeContact(contact_id);
  }
}
/******************* End View Controller ***************/


/******************* Data Manager - Manages PERSONAL data *****************/
var dataManager = {
  contactID: null, //User's personal contactID
  contacts: [], //Base data model
  globalContacts: {},
  init: function(contactID) {
    this.contactID = contactID;
    this.getContacts();
  },
  getContacts: function() {
    if (this.contactID) {

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

    } else {
      this.contacts = [];
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

    }
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
  addContact: function(contactID) {
    //Use contactID to get a complete contact
    var contactRoot = this.contactID;
    var contactToAdd = null;
    for (var i = 0; i < this.globalContacts.length; i++) {
      if (contactID === this.globalContacts[i]._id) {
        contactToAdd = this.globalContacts[i];
        break;
      }
    }
    if (contactToAdd !== null) {
      //Add complete contact to personalContacts
      this.contacts.push(contactToAdd);
      viewController.render();

        //Update database about it?
        $.ajax({
          type: "POST",
          data: {contactRoot: contactRoot},
          url:'/contacts/link/' + contactID,
          dataType: 'JSON'
        }).done(function(res) {
            //If successful
            if (res.msg === '') {
              console.log("Successful POST");

              //Pass control to module that re-renders tables?
              //How do we update views with new information?

            } else {
              alert("Error: check log");
              console.log(res.msg);
            }
        })
    } else {
      console.log(contactToAdd + ' is not available. Failed to add');
    }

    },
  removeContact: function(contactIDtoRemove) {
    console.log("In data manager removeContact for id: " + contactIDtoRemove);

    var contactToRemove = null;
    var contactRoot = this.contactID;

    var index = -1;
    for (var i = 0; i < this.contacts.length; i++) {
      if (contactIDtoRemove === this.contacts[i]._id) {
        contactToRemove = this.contacts[i];
        console.log(contactToRemove);
        console.log(i);
        index = i;
        break;
      }
    }
    
    if (contactToRemove !== null && index >= 0) {
      //Update Model
      this.contacts.splice(index, 1);
      viewController.render();

      //Update Database
      $.ajax({
        type: "DELETE",
        data: {contactRoot: contactRoot},
        url:'/contacts/link/' + contactIDtoRemove,
        dataType: 'JSON'
      }).done(function(res) {
          //If successful
          if (res.msg === '') {
            console.log("Successful DELETE");

            //Pass control to module that re-renders tables?
            //How do we update views with new information?

          } else {
            alert("Error: check log");
            console.log(res.msg);
          }
      })

    } else {
       console.log(contactToRemove + ' is not available. Failed to Remove');
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
    if (contactID) {
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
    } else {
      //If I haven't made a contactID For myself yet,
    }

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
      console.log("Contact ID is " + userManager.contactID);
      dataManager.init(userManager.contactID);
    });
  }
}