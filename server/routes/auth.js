const express = require('express')
const router = express.Router()


// import controller 
const { signup, signin, accountActivation } = require("../controllers/auth");

//import validators

const {userSignupValidator,userSigninValidator} = require('../validators/auth')
const {runValidaton} = require('../validators/index')
router.post("/signup", userSignupValidator, runValidaton,signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidaton, signin);

module.exports = router