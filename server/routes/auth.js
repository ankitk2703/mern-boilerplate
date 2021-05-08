const express = require('express')
const router = express.Router()


// import controller 
const {signup} = require('../controllers/auth')

//import validators

const {userSignupValidator} = require('../validators/auth')
const {runValidaton} = require('../validators/index')
router.post("/signup", userSignupValidator, runValidaton,signup);

module.exports = router