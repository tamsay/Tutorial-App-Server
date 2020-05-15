const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes')

const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise //To use the native js promises

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// let url = "mongodb+srv://onlineTutorAppdb:tamsay@89@cluster0-phwkh.mongodb.net/OnlineTutorApp";
let url = 'mongodb://localhost:27017/testdb3'

let db = mongoose.connection;

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
.then(result=>{
    console.log('Database Connected');
   // console.log(result)
})
.catch(err=>console.log(err));

app.use('/', routes)


app.listen(port);

