var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server);

db.open(function(err, db) {
    
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }else{
        console.log(err);
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
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
 
exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}
 
exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
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
 
    var wines = [
    {
        "id": "BVwi1",
        "name": "Sholay",
        "averageRating": 4.6,
        "releaseYear": 1992,
        "url": "http://www.sholay.com",
        "rating": "NR"
    },
    {
        "id": "BW1Ss",
        "name": "Avatar",
        "averageRating": 5.0,
        "releaseYear": 2009,
        "url": "http://www.netflix.com/Movie/Avatar/70171826",
        "rating": "NR"
    },
    {
        "id": "BW2K0",
        "name": "Sleepless in Seattle",
        "averageRating": 4.6,
        "releaseYear": 2010,
        "url": "http://www.netflix.com/Movie/To_Live_Ride_in_L.A./70175120",
        "rating": "NR"
    },
    {
        "id": "BWAhv",
        "name": "Despicable me",
        "averageRating": 4.6,
        "releaseYear": 2010,
        "url": "http://www.netflix.com/Movie/K-ON_Vol._1/70207355",
        "rating": "NR"
    },
    {
        "id": "BWDSi",
        "name": "Despicable me 2",
        "averageRating": 4.6,
        "releaseYear": 2013,
        "url": "http://www.netflix.com/Movie/Archer_Season_2_Disc_1/70217944",
        "rating": "TV-MA"
    }];
 
    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });
 
};
