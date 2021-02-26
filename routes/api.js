const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken')
// const MongoClient = require('mongodb').MongoClient;
// let client = null;

//GETALL
router.get('/members',function(req, res, next){
    //gives all user data including the salt and hash data. maybe we no give that data for security
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,
        useUnifiedTopology: true
    });   
    client.connect(err => {
        const collection = client.db("ACM").collection("Member");
        // perform actions on the collection object
        collection.find({}).toArray(function(error, result)  {
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result);
            client.close();
        });
    });
});

//Get one
router.get('/member', jsonParser, function(req, res, next){
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,
        useUnifiedTopology: true
    });    
    client.connect(err => {
        const collection = client.db("ACM").collection("Member");
        var ObjectID = require("mongodb").ObjectID
        collection.find({w_num: req.query.w_num}).toArray(function(error, result) {
            if(error) {
                return res.status(500).send(error);
            }
            res.send(result);
        });
    });
});

//add new member to db
 router.post('/signup', jsonParser, function(req, res){
  console.log(req.body);
  let newUser = new User();
  newUser.first_name = req.body.first_name;
  newUser.last_name = req.body.last_name;
  newUser.email = req.body.email;
  newUser.major = req.body.major;
  newUser.w_num = req.body.w_num;
  newUser.signup_date = new Date();
  newUser.expiration_date = new Date(newUser.signup_date.getTime() + (1000 * 60 * 60 * 24 * 365));
  newUser.setPassword(req.body.password);


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,
    useUnifiedTopology: true,
    });

client.connect(err => {
  const collection = client.db("ACM").collection("Member");
  // perform actions on the collection object
    collection.insertOne(newUser)
    .then(out => res.status(201).json({message: "Success"}))
  client.close();
    });

});

//update member info
router.put('/extend', jsonParser , function(req, res){
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,
        useUnifiedTopology: true
    });    
    client.connect(err => {
        const collection = client.db("ACM").collection("Member");
            var ObjectID = require("mongodb").ObjectID
            var up_date = new Date();
            var expiration_date = new Date(up_date.getTime() + 1000 * 60 * 60 * 24 * 365);
            collection.findOneAndUpdate({w_num: req.query.w_num}, {$set: {expiration_date : expiration_date, active: true}}).then(function(error, result) {
                if(error) {
                    return res.status(500).send(error);
                }
                console.log(expiration_date);
            });
        });
});

//delete member
router.delete('/delete', jsonParser ,function(req, res){
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,
        useUnifiedTopology: true
    });    
    client.connect(err => {
        const collection = client.db("ACM").collection("Member");
            var ObjectID = require("mongodb").ObjectID
            collection.findOneAndDelete({w_num: req.body.w_num}).then(function(error, result) {
                if(error) {
                    return res.status(500).send(error);
                }
                res.send("This member was removed.");
            });
    });
});

router.post('/login',jsonParser,function(req,res){
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jpeter:0nyx@acm-eb7i4.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,
        useUnifiedTopology: true
    });    
    client.connect(err => {
    const collection = client.db("ACM").collection("Member");
        var ObjectID = require("mongodb").ObjectID
        jwt.sign({"w_num": "w_num"}, 'loginkey', (err, token) => {
             if(err) {
                return res.status(500).send(error);
            }
            res.json({
                token
            })
        })
           
    })
})
function verifylogin(req, res, next){
    const bearerHeader = res.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1];
        req.token = bearerToken
        next();
    }
    else{
        res.sendStatus(403);
    }
}
module.exports = router;
