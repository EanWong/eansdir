var express = require('express');
var router = express.Router();

/* Connect to db using monk*/
var common = require('../config/common');
var config = common.config();

var db = require('monk')(config.mongodb.url);
var users = db.get('users');

var contacts = db.get('contacts');

var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;


var makeEmptyContact = function(contact_id) {
  var empty_contact = {
    "_id": contact_id,
    "Name": "-",
    "Email": "-",
    "CellPhone": "-",
    "CurrentAddress": "-",
    "UpdateAddressDate": "-",
    "contacts": [contact_id]};
  return empty_contact;
};



router.get('/', function(req, res) {
  /* GET user list*/
  //Return all users via JSON
  users.find({},{}, function(e, docs) {
    if (e) {
      res.send(e);
    } else {
      res.send(docs);
    }

  });
});

router.route('/')

  /* POST uniquely named contact with JSON contact in body */
  /* Does not ensure uniqueness */
  .post(function(req, res) {

    //Make a contact ID?

    var user = req.body; //{username:"testuser",password:"testpwd"}
    var username = user.username;
    var password = user.password;

    var contact_id = new ObjectID().toString();

    //Insert contact if totally unique document: dependent on unique indices in collection
    users.insert({username:username, password:password, contactID:contact_id}, function(e, doc) {

      //after creating user, pass to make contactID
      var blank_contact = makeEmptyContact(contact_id);
      
      contacts.insert(blank_contact, function(e, doc) {
        res.send({redirect:'/login'});
      });

    });
  })

  /* DELETE named contact with JSON contact in body */
  .delete(function(req, res) {

    var user = req.body; //{username:"testuser",password:"testpwd"}

    users.remove(user, function(e, doc) {

      res.send(
        (e === null) ? {msg : ''} : {msg : e}
      );

    });
  })
  .put(function(req, res) {
  
    var linkedUser = req.body; // {username:"testuser",password"testpwd",contactID:"contactid"}
    var username = linkedUser.username;
    var password = linkedUser.password;
    var contactID = linkedUser.contactID;
    users.update({'username' : username}, linkedUser, function(e, doc) {

      res.send(
        (e === null) ? {msg : 'No errors in linking user with contact'} : {msg : e}
      );

  });
});

//Requires username and returns the contact id
router.route('/contactID/:username')
  .get(function(req, res) {
    
    var username = req.params.username;

    users.find({'username':username}, 'contactID', function(e, docs) {
      if (e) {
        res.send(e);
      } else {
        res.json(docs);
      }
    });
  });

/* Disconnect from db */
db.close();

module.exports = router;
