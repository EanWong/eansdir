var common = require('../config/common');
var config = common.config();
var db = require('monk')(config.mongodb.url);

var users = db.get('users');


exports.findById = function(id, cb) {
  process.nextTick(function() {
    users.find({_id: id}, {}, function(e, doc) {
      if (e) {
        cb(new Error(e));
      } else {
        if (doc) {
          cb(null, doc[0]);
        }
      }
    });
  });
}

exports.findByUsername = function(username, cb) {

  process.nextTick(function() {
    users.find({username:username}, {}, function(e, docs) {

     if (e) {
        cb(null, null);
      } else {
        if (typeof docs[0] !== 'undefined' && docs[0] !== null) { // If user exists
          console.log("Checking if found in db");
          console.log(docs);
          docs[0].id = docs[0]._id;
          return cb(null, docs[0]);
        }
        cb(null, false);
      }
    }); 
    /*

    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
    */
  });
}
