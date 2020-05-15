const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const student = require('../models/students')
const User = require('../models/user')
const course = require('../models/category')
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const signUp2 = (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
   
   if(!email || !password){
       res.status(400).send({
           status: false,
           message: 'All fields are required'
       })
       return;
   }
   
   User.findOne({email})
   .then(user=>{
       if(user){
        return res.status(423).send({status: false, message: 'This email already exist in the database'});
       }

   bcrypt
   .hash(password, 12)
   .then(password =>{
       let newUser = new User({
           email, password, role: role || 'student',
       });
    return newUser;
   })
   .then((newUser)=>{
       const accessToken = jwt.sign({userId: newUser._id}, process.env.JWTOKEN_KEY, {expiresIn: '1h'});
       newUser.accessToken = accessToken;
       return newUser.save();
   })
   .then((newUser)=>{
       res.status(200).send({
           status: true, 
           message: 'New student registered successfully', 
           newUser,
           accessToken: newUser.accessToken
       })
   })
   .catch((err)=>{
        console.log(err);
   })
});
   
 };

// async function hashPassword(password) {
//     return await bcrypt.hash(password, 10);
//    }
    
//    async function validatePassword(plainPassword, hashedPassword) {
//     return await bcrypt.compare(plainPassword, hashedPassword);
//    }
// const signUp2 = async (req, res, next) => {
//     try {
//      const { email, password, role } = req.body
//      const hashedPassword = await hashPassword(password);
//      const newUser = new User({ email, password: hashedPassword, role: role || "student" });
//      const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWTOKEN_KEY, {
//       expiresIn: "1d"
//      });
//      newUser.accessToken = accessToken;
//      await newUser.save();
//      res.json({
//       data: newUser,
//       accessToken
//      })
//     } catch (error) {
//      next(error)
//     }
//    }

const signUp = (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;
   
   if(!email || !password){
       res.status(400).send({
           status: false,
           message: 'All fields are required'
       })
       return;
   }
   
   student.findOne({email})
   .then(user=>{
       if(user){
        return res.status(423).send({status: false, message: 'This email already exist in the database'});
       }
       
   bcrypt
   .hash(password, 12)
   .then(password =>{
       let newStudent = new student({
           email, password
       })
    return newStudent.save();
   })
   .then(()=>{
       res.status(200).send({
           status: true, 
           message: 'New student registered successfully',
       })
   })
   .catch((err)=>{
        console.log(err);
   })
});
   
};

const logIn = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;

    student.findOne({email})
    .then(resp=>{
        if(!resp){
            return res
            .status(404)
            .send("User not found, please provide valid credentials");
        }
        console.log(resp)

        bcrypt.compare(password, resp.password)
        .then(valid=>{
            console.log(valid, password, resp.password)
            console.log(typeof(password))
            console.log(typeof(resp.password))

            if(!valid){
              return  res.status(403).send('Incorret password, please correct and try again');
            }
            const token = jwt.sign({email: resp.email, _id: resp._id}, process.env.JWTOKEN_KEY, {expiresIn: '1h'});
            
            res.status(200).send({_id: resp._id, token, message: 'login successful'});
            // console.log(process.env)
        })
    })
    .catch(err=>console.log(err));
}

const logIn2 = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user=>{
        if(!user){
            return res
            .status(404)
            .send("User not found, please provide valid credentials");
        }
        bcrypt.compare(password, user.password)
        .then(valid=>{
            if(!valid){
              return  res.status(403).send('Incorret password, please correct and try again');
            }
            const token = jwt.sign({email: user.email, _id: user._id}, process.env.JWTOKEN_KEY, {expiresIn: '1h'});
            return token;
        })
        .then((token)=>{
            User.findByIdAndUpdate(user._id, {token});
            res.status(200).send({
                _id: user._id, 
                token, 
                message: 'login successful',
                data: {email: user.email, role: user.role},
                accessToken: user.accessToken,
                user,
            });
        })
    })
    .catch(err=>console.log(err));
}

const createCourse = (req, res, next)=>{
    let name = req.body.name;
    let subjects = req.body.subjects;

    let newCourse = new course({
        name, subjects
    });

    newCourse.save()
    .then(resp=>{
        console.log(resp)
    
            res.status(200).send({
                status: true, 
                message: 'New course created',
            })
        
    })
    .catch(err=>console.log(err));
}

module.exports = {
    signUp2: signUp2,
    signUp: signUp,
    logIn: logIn,
    logIn2: logIn2,
    createCourse: createCourse
}