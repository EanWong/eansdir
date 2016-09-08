var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

var db = require('monk')('db:27017/local');
var users = db.get('users');


exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {

  process.nextTick(function() {
    console.log(username);
    users.find({username:username}, {}, function(e, docs) {
     if (e) {
        cb(null, null);
      } else {
        if(docs) {

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
