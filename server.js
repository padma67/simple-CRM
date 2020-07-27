const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser")
const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

const Register=require("./routes/Register");
const Login=require("./routes/Login");
const Approve=require("./routes/Approve");
const Service =require("./routes/Service");


//const dbURL = "mongodb://127.0.0.1:27017";
const dbURL ="mongodb+srv://padma:pa6789@cluster0.rkjto.mongodb.net/CustomerManagement?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use("/register",Register);
app.use("/login",Login);
app.use("/addservice",Service);
app.use("/Service",Service);
//app.use("/editservice/:service",Service);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("your app is running in", port));

app.get("/", (req, res) => {
  res.send("<h1>Simple CRM</h1>");
});

app.get("/manager", authenticatedUsers, (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    let db = client.db("CustomerManagement");
    db.collection("manager")
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

app.get("/employee", authenticatedUsers, (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    let db = client.db("CustomerManagement");
    db.collection("employee")
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



app.put("/editservice/:service", authenticatedUsers1,(req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    console.log(req.params.service);
   if (err) throw err;
    client
      .db("CustomerManagement")
      .collection("service")
      .findOneAndUpdate({ service:req.params.service }, { $set: {status:req.body.status} },(err, data) => 
        { if (err) throw err;
        client.close();
        res.status(200).json({
          message: "Service updated..!!",data
        });
      });
  });
});

function authenticatedUsers1(req, res, next) {
  const {employeejwt}=req.cookies;
  if (employeejwt == undefined) {
    res.status(401).json({
      message: "No token available in headers",
    });
  } else {
    jwt.verify(
      employeejwt,
      "uzKfyTDx4v5z6NSV",
      (err, decodedString) => {
        if (decodedString.employeetype === "senior") {
          console.log(decodedString);
         next();
        } else {
           res.status(401).json({ message: "Invalid Token" });
        }
      }
    );
  }
}

app.put("/approve/:email", authenticatedUsers,(req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    console.log(req.params.email);
   if (err) throw err;
    client
      .db("CustomerManagement")
      .collection("manager")
      .findOneAndUpdate({ email:req.params.email }, { $set: {Approve:true} },(err, data) => 
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
