const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const loginController = require('../controllers/loginController');

router.post("/login-user", loginController);

module.exports = router;