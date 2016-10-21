var express = require('express');
var router = express.Router();

/* Connect to db using monk*/
/* For dev / prod configuration testing */
var common = require('../config/common');
var config = common.config();
var db = require('monk')(config.mongodb.url);

var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

var contacts = db.get('contacts');

//If standalone, returns ALL contacts
//If with query of a specific contactID, gets all contacts associated with that id
router.route('/')
  .get(function(req, res) {
  /* GET contacts listing. {"contacts": array[i] of contacts} */
  //Return all contacts via JSON
  var query = {};
  var filter = {};

  // If no query parameters used (i.e. looking for all contacts)
  if (Object.keys(req.query).length === 0) {
    contacts.find({},{fields: {contacts:0}}, function(e, docs) {
     if (e) {
        res.send(e);
      } else {
        // use contacts
        res.send(docs);
      }
    });
  // If query used (i.e. looking for specific contacts)
  } else {

    query = {"_id": db.id(req.query.contactID)};
    filter = "contacts";
    contacts.find(query, filter, function(e, user_contact_ids) {
      if (e) {
        res.send(e);
      } else {
        console.log(user_contact_ids);
        var contact_ids = user_contact_ids[0].contacts;

        // Converts all contact ids stored as strings to ObjectIDs for processing
        for (var i = 0; i < contact_ids.length; i++) {
          contact_ids[i] = db.id(contact_ids[i]);
        }
        if (contact_ids == null) {
          contact_ids = [];
        }
        //Hide other accounts contacts
        contacts.find({_id : {$in: contact_ids}}, {fields: {contacts:0}}, function(e, user_contacts) {
          if (e) {
            res.send(e);
          } else {
            res.send(user_contacts);
          }
        });
      }
    });
  }
  contacts.find(query,filter, function(e, docs) {

  });
})

router.route('/byName/:name')
  /* GET named contact and get contact info */
  .get(function(req, res) {
    
    var contactName = req.params.name;
    contacts.find({'Name' : contactName}, function(e, docs) {

      if (e) {
        res.send(e);
      } else {
        res.json(docs);
      }
    });

  })

  /* POST uniquely named contact with JSON contact in body */
  /* Does not ensure uniqueness */
  .post(function(req, res) {

    var contactName = req.params.name;
    var contact = req.body;

    console.log(contact);
    //Insert contact if totally unique document: dependent on unique indices in collection
    contacts.insert(contact, function(e, doc) {
      
      res.send(
        (e === null) ? {msg : ''} : {msg : e}
      );

    });
  })

  /* DELETE named contact with JSON contact in body */
  .delete(function(req, res) {

    var contactName = req.params.name;

    contacts.remove({'Name' : contactName}, function(e, doc) {

      res.send(
        (e === null) ? {msg : ''} : {msg : e}
      );

    });
  })

  /* UPDATE contact with JSON in body */
  .put(function(req, res) {
    
    var contactName = req.params.name;
    var contactUpdate = req.body;

    contacts.update({'Name' : contactName}, {$set:contactUpdate}, function(e, doc) {

      res.send(
        (e === null) ? {msg : ''} : {msg : e}
      );

    });
});

router.route('/byID/:contactID')
  .get(function(req, res) {
    var contactID = req.params.contactID;
    contacts.find({'_id' : contactID}, function(e, docs) {
      if (e) {
        res.send(e);
      } else {
        res.json(docs);
      }
    });
  })
  /* UPDATE contact with JSON in body */
  .post(function(req, res) {
    var contactID = req.params.contactID;
   
    var contactUpdate = req.body;
    contacts.update({_id : db.id(contactID)}, {$set:contactUpdate}, function(e, doc) {

      res.send(
        (e === null) ? {msg : ''} : {msg : e}
      );

    });
    
  });

//Associates a contactID with the root ID
router.route('/link/:contactID')
  .post(function(req, res) {
    //Get current contact ID from body
    var contactRoot = req.body.contactRoot;

    contactRoot = db.id(contactRoot);
    var contactID_toLink = req.params.contactID;
    console.log(contactRoot);
    console.log(contactID_toLink);
    //contactID_toLink = db.id(contactID_toLink);

    //TODO: Make sure to check if contact id even exists

    //Add to contact
    contacts.update({_id: contactRoot}, {$addToSet:{contacts : contactID_toLink}}, 
      function(e, docs) {
        if (e) {
          console.log(e);
          res.send(e);
        } else {
          res.send("Success in linking contacts");
        }
      });
  }).delete(function(req,res) {
    var contactRoot = req.body.contactRoot;
    var contactID_toUnlink = req.params.contactID;

    contactRoot = db.id(contactRoot);
    //contactID_toUnlink = db.id(contactID_toUnlink);

    contacts.update({_id: contactRoot}, {$pull:{contacts : contactID_toUnlink}}),
      function(e, docs) {
        if (e) {
          console.log(e);
          res.send(e);
        } else {
          res.send("Success in unlinking contacts");
        }
      }

  });


/* Disconnect from db */
db.close();

module.exports = router;
