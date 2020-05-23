const express = require('express');
const app = express();
const router = express.Router();
const {signUp, logIn, logIn2, createCourse, signUp2, allowIfLoggedin, grantAccess, getUser, getUsers, updateUser, deleteUser, logOut} = require('../controllers/auth')


router.get('/', (req, res)=>{
    res.send('You have now entered express')
})

router.get('/home', (req, res)=>{
    res.send('You are at home not express. You have now entered express')
})

router.post('/signup', signUp);

router.post('/signup2', signUp2);

router.post('/login', logIn);

router.post('/login2', logIn2);

router.post('/createcourse', createCourse)



router.get('/user/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin, grantAccess('readAny', 'profile'), getUsers);

router.put('/user/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/user/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

module.exports = router;

// app.listen(5000)