var mongo = require('mongodb');
 
console.log("Express server in MongoDB Server 1"); 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
//var server = new Server('localhost', 27017, {auto_reconnect: true});
var server = new Server('ds053140.mongolab.com', 53140, {auto_reconnect: true});
//db = new Db('customerdb', server);
db = new Db('heroku_app31436024', server, {safe: true});
console.log("Express server in MongoDB 2 db = " + db);

db.open(function(err, db) {
	console.log("Express server in MongoDB 2 db.open = " + err);
	
	db.authenticate('wynnszenn2', 'a63114450', function(err) {
		console.log("Express server in MongoDB Server 3 err = " + err);
		if(!err) {

        console.log("Connected to 'customers' database");
			db.collection('customers', {safe:true}, function(err, collection) {
				console.log("Connected to 'customers' collection err = " + err);
				//populateDB();
				if (err) {
					console.log("The 'customers' collection doesn't exist. Creating it with sample data...");
					populateDB();
				}
			});
		
		}
		else
		{
			console.log("Failed Connected to database");
		}
	});
 
});
 
/*db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'customerdb' database");
        db.collection('customers', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'customer' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});*/

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving customer: ' + id);
    db.collection('customers', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('customers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addCustomer = function(req, res) {
    var customers = req.body;
    console.log('Adding customer: ' + JSON.stringify(customers));
    db.collection('customers', function(err, collection) {
        collection.insert(customers, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateCustomer = function(req, res) {
    var id = req.params.id;
    var customers = req.body;
    console.log('Updating customer: ' + id);
    console.log(JSON.stringify(customers));
    db.collection('customers', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, customers, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating customers: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(customers);
            }
        });
    });
}
 
exports.deleteCustomer = function(req, res) {
    var id = req.params.id;
    console.log('Deleting customer: ' + id);
    db.collection('customers', function(err, collection) {
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

var populateDB = function() {
 
    var customers = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];
 
    db.collection('customers', function(err, collection) {
        collection.insert(customers, {safe:true}, function(err, result) {});
    });
 
};

