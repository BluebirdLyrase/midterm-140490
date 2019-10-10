// server.js
// load the things we need
var express = require('express');
var app = express();
// set up Mongo
var mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useUnifiedTopology: true, useNewUrlParser: true };
///////////////////bodyParser/////////////////////////
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////////////////
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        var query = {};
        dbo.collection("Booksdata")
            .findOne({}, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/Home', { thisdata: result });
                db.close();
            });
    });
});

app.get('/products', function (req, res) {
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        var query = {};
        dbo.collection("Booksdata")
            .find(query)
            .toArray(function (err, result) {
                if (err) throw err;
                res.render('pages/products', { books: result });
                db.close();
            });
    });
});

app.get('/bookAdd', function (req, res) {
    res.render('pages/bookAdd');

});

app.post('/bookAddtoDatabase', function (req, res) {
    var ID = req.body.ID;
    var bookName = req.body.bookName;
    var author = req.body.author;
    var date = req.body.date;
    var price = req.body.price;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");

        /////////Set value///////////////
        var newbook = {
            ID: ID,
            bookName: bookName,
            author: author,
            date: date,
            price: price,
        };

        dbo.collection("Booksdata")
            .insertOne(newbook, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
    });
    res.redirect("/products");
});

app.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        var query = { ID: id };
        dbo.collection("Booksdata")
            .findOne(query, function (err, result) {
                if (err) throw err;
                res.render('pages/detail', { detail: result });
                db.close();
            });
    });
});

app.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        var query = { ID: id };
        dbo.collection("Booksdata")
            .findOne(query, function (err, result) {
                if (err) throw err;
                res.render('pages/edit', { detail: result });
                db.close();
            });
    });
});

app.post('/savebook', function (req, res) {
    var ID = req.body.ID;
    var bookName = req.body.bookName;
    var author = req.body.author;
    var date = req.body.date;
    var price = req.body.price;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        /////////Select target///////////////
        var query = { ID: ID };
        /////////Set value///////////////
        var newvalues = {
            $set: {
            ID: ID,
            bookName: bookName,
            author: author,
            date: date,
            price: price,
            }
        };

        dbo.collection("Booksdata")
            .updateOne(query, newvalues, function (err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " document(s) updated");
                db.close();
            });
    });
    res.redirect("/products");
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Books");
        var query = { ID: id };
        dbo.collection("Booksdata")
            .deleteOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.redirect("/products");
                db.close();
            });
    });
});

app.listen(8080);
console.log('port : 8080');