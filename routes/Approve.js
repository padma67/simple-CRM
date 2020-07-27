const express =require("express");
const Approve = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// simply mongodb installed
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

//const dbURL = "mongodb://127.0.0.1:27017";
const dbURL ="mongodb+srv://padma:pa6789@cluster0.rkjto.mongodb.net/CustomerManagement?retryWrites=true&w=majority";
Approve.use(bodyParser.json());
Approve.use(cors());

let token;

Approve.put("/", authenticatedUsers,(req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
   if (err) throw err;
    client
      .db("CustomerManagement")
      .collection("manager")
      .findOneAndUpdate({ name:req.params.name }, { $set: {Approve:true} },(err, data) => 
        { if (err) throw err;
        client.close();
        res.status(200).json({
          message: "Manager approved..!!",
        });
      });
  });
});

function authenticatedUsers(req, res, next) {
  const {adminjwt}=req.cookies;
  if (adminjwt == undefined) {
    res.status(401).json({
      message: "No token available in headers",
    });
  } else {
    jwt.verify(
      adminjwt,
      "uzKfyTDx4v5z6NSV",
      (err, decodedString) => {
        if (decodedString == undefined) {
          res.status(401).json({ message: "Invalid Token" });
        } else {
          console.log(decodedString);
          next();
        }
      }
    );
  }
}


module.exports=Approve