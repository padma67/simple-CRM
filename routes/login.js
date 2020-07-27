const express =require("express");
const Login = express.Router();
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
Login.use(bodyParser.json());
Login.use(cors());

let token;

Login.post("/", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
      if(req.body.type === "admin"){
      client.db("CustomerManagement")
      .collection("admin")
      .findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(req.body.password, data.password, (err, validUser) => {
            if (err) throw err;
            if (validUser) {
              token = jwt.sign(
                { type: data.type, email: data.email },
                "uzKfyTDx4v5z6NSV",
                { expiresIn: "1h" }
              );
              res.cookie("adminjwt", token);
              res.status(200).json({
                message: "login successful!!",
                token,
              });
            } else {
              res
                .status(403)
                .json({ message: "Bad Credentials, Login unsuccessful..!!" });
            }
          });
        } else {
          res.status(401).json({
            message: "Email is not registered, Kindly register..!!",
          });
        }
      });
    }

    else if(req.body.type === "manager"){
      client.db("CustomerManagement")
      .collection("manager")
      .findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(req.body.password, data.password, (err, validUser) => {
            if (err) throw err;
            if (validUser) {
              token = jwt.sign(
                { type:data.type, email: data.email,approve: data.Approve },
                "uzKfyTDx4v5z6NSV",
                { expiresIn: "1h" }
              );
              res.cookie("managerjwt", token);
              res.status(200).json({
                message: "login successful!!",
                token,
              });
            } else {
              res
                .status(403)
                .json({ message: "Bad Credentials, Login unsuccessful..!!" });
            }
          });
        } else {
          res.status(401).json({
            message: "Email is not registered, Kindly register..!!",
          });
        }
      });
    }

    else if(req.body.type === "employee"){
      client.db("CustomerManagement")
      .collection("employee")
      .findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(req.body.password, data.password, (err, validUser) => {
            if (err) throw err;
            if (validUser) {
              token = jwt.sign(
                { employeetype:data.employeetype, email: data.email },
                "uzKfyTDx4v5z6NSV",
                { expiresIn: "1h" }
              );
              res.cookie("employeejwt", token);
              res.status(200).json({
                message: "login successful!!",
                token,
              });
            } else {
              res
                .status(403)
                .json({ message: "Bad Credentials, Login unsuccessful..!!" });
            }
          });
        } else {
          res.status(401).json({
            message: "Email is not registered, Kindly register..!!",
          });
        }
      });
    }


  });
});

module.exports=Login
