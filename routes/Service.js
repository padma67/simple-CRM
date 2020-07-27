const express =require("express");
const Service = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

//const dbURL = "mongodb://127.0.0.1:27017";
const dbURL ="mongodb+srv://padma:pa6789@cluster0.rkjto.mongodb.net/CustomerManagement?retryWrites=true&w=majority";
Service.use(bodyParser.json());
Service.use(cors());

let token;

Service.post("/", authenticatedUsers,(req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
   if (err) throw err;
    client
      .db("CustomerManagement")
      .collection("service")
      .insertOne(req.body,(err, data) => 
        { if (err) throw err;
        client.close();
        res.status(200).json({
          message: "service added....",
        });
      });
  });
});

Service.get("/", authenticatedUsers2, (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    let db = client.db("CustomerManagement");
    db.collection("service")
      .find()
      .toArray()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(404).json({
          message: "No data Found or some error happen",
          error: err,
        });
      });
  });
});



function authenticatedUsers(req, res, next) {
  const {managerjwt}=req.cookies;
  if (managerjwt == undefined) {
    res.status(401).json({
      message: "No token available in headers",
    });
  } else {
    jwt.verify(
      managerjwt,
      "uzKfyTDx4v5z6NSV",
      (err, decodedString) => {
        if (decodedString.approve === true) {
          console.log(decodedString);
          next();
        } else {
          console.log(decodedString);
          res.status(401).json({ message: "You can't add service" });
        }
      }
    );
  }
}

function authenticatedUsers2(req, res, next) {
  const {adminjwt,employeejwt,managerjwt}=req.cookies;
  if (adminjwt !== undefined) {
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
  else  if (managerjwt !== undefined) {
   jwt.verify(
      managerjwt,
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
   else  if (employeejwt !== undefined) {
   jwt.verify(
      employeejwt,
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


  else{
     res.status(401).json({
      message: "you can't view srvice details",
    });
  }
}


module.exports=Service