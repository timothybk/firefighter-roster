var express = require('express');
var app = express();
var mongodb = require("mongodb")
var bodyParser = require("body-parser")

var handlebars = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + "/public"));

app.get('/list', function(req, res){
 var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/ffers";

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("unable to connect to server", err);
        } else {
            console.log("connection established");

            var collection = db.collection("ffdetails");

            collection.find().sort({"rank": -1, "number": 1}).toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render("firefighterlist", {
                        firefighter: result
                    });
                } else {
                    res.send("No docs found");
                }

                db.close();
            })
        }
    })
})

app.get("/adddata", function (req, res) {
	var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/ffers";

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("unable to connect to server", err);
        } else {
            console.log("connection established");

            var collection = db.collection("ffdetails");

            collection.find({}).toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length) {
                    res.render("adddata", {
                        firefighter: result
                    });
                } else {
                    res.send("No docs found");
                }

                db.close();
            })
        }
    })
})

app.get(/\d{6}|\d{4}/, function (req, res) {
	res.render("individual");
});

app.get("/shifts", function (req, res) {
	res.render("shifts");
});

app.get("/shiftid", function (req, res) {
	res.render("shiftid");
});

app.get('/n2list', function(req, res){
 res.render("n2list");
});

app.get("/newff", function (req, res) {
	res.render("newff");
});

app.post("/addff", function(req, res) {
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/ffers";

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Cant post to database", err)
        } else {
            console.log("Connection established");

            var collection = db.collection("ffdetails");
            var rescueQ;
            var motord;
            var aerialQ;
            if (req.body.md == null) {
                motord = false;
            } else {
                motord = true;
            }

            if (req.body.rescue == null) {
                rescueQ = false;
            } else {
                rescueQ = true;
            }

            if (req.body.aerial == null) {
                aerialQ = false;
            } else {
                aerialQ = true;
            }



            var firie1 = {
                number: parseInt(req.body.serviceNumber, 10),
                rank: req.body.rank,
                name: req.body.name,
                md: motord,
                rescue: rescueQ,
                aerial: aerialQ
            };

            collection.insert([firie1], function(err, result) {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect("newff");
                }
                db.close();
                console.log(firie1);
            })
        }
    })
})

app.post("/adddata", function (req, res) {
	// add update for the embeded document
})

// custom 404 page
app.use(function(req, res) {
    res.status(404);
    res.render("404");
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.render("500");
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});