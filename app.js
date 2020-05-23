const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const jwt = require('jsonwebtoken');
const User = require('./models/user')

const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise //To use the native js promises

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));


// let url = "mongodb+srv://onlineTutorAppdb:tamsay@89@cluster0-phwkh.mongodb.net/OnlineTutorApp";
let url = 'mongodb://localhost:27017/testdb3'

let db = mongoose.connection;

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
.then(result=>{
    console.log('Database Connected');
   // console.log(result)
})
.catch(err=>console.log(err));

app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWTOKEN_KEY);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await User.findById(userId); next(); 
    } else { 
     next(); 
    } 
   });

app.use('/', routes)

app.listen(port);

