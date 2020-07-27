const express=require("express");
const Register=express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//const dbURL = "mongodb://127.0.0.1:27017";
const dbURL ="mongodb+srv://padma:pa6789@cluster0.rkjto.mongodb.net/CustomerManagement?retryWrites=true&w=majority";

Register.use(bodyParser.json());
Register.use(cors());


Register.post("/", async(req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
     if (err) throw err;
    let db = client.db("CustomerManagement");

    if(req.body.type === "employee"){
      db.collection("employee").findOne({ email: req.body.email }, (err, data) => {
      if (err) throw err;
      if (data) {
        res.status(400).json({ message: "Email already exists..!!" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, cryptPassword) => {
            if (err) throw err;
            req.body.password = cryptPassword;
            db.collection("employee").insertOne(req.body, (err, result) => {
              if (err) throw err;
              client.close();
              res.status(200).json({ message: "Registration successful..!! " });
            });
          });
        });
      }
    });}

      else if(req.body.type === "manager"){
      db.collection("manager").findOne({ email: req.body.email }, (err, data) => {
      if (err) throw err;
      if (data) {
        res.status(400).json({ message: "Email already exists..!!" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, cryptPassword) => {
            if (err) throw err;
            req.body.password = cryptPassword;
            db.collection("manager").insertOne(req.body, (err, result) => {
              if (err) throw err;
              client.close();
              res.status(200).json({ message: "Registration successful..!! " });
            });
          });
        });
      }
    });}

      else{
         res.status(401).json({
            message: "Can't register give valid details!!",
          });
      }


    });
  });

module.exports=Register