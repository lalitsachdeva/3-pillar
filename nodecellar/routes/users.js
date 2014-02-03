var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('resumedb', server);

db.open(function(err, db) {
    
    if(!err) {
        console.log("Connected to 'resumedb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }else{
        console.log(err);
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving users: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addUser = function(req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                console.log("I am here");
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}
 
exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var users = [
        {
            user_id:1,
            name:"Neeraj Joshi",
            email:"neeraj.joshi@live.com",
            password: "abc123",
            mobile: 9871451614,
            skills: "Python, PHP, Django, Javscript, CSS, HTML",
            location: "New Delhi",
            resume:"/resume/neeraj_joshi.doc",
            year_passing: 2009,
            qualification:"B.Tech (IT)",
            gender:"M",
            is_activated:false,
            last_updated: 1391414765,
            current_employer: "3 Pillar Global"
        },
            {
            user_id:2,
            name:"Ashish Tripathi",
            email:"abc@live.com",
            password: "abc123",
            mobile: 9899999999,
            skills: "Python, PHP, Django, Javscript, CSS, HTML",
            location: "Noida",
            resume:"/resume/ashish_tripathi.doc",
            year_passing: 2004,
            qualification:"MCA",
            gender:"M",
            is_activated:false,
            last_updated: 1391414798,
            current_employer: "3 Pillar Global"
        }];
 
    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
 
};
