const express = require('express');
const router = express.Router();
const UserController = require("../Controller/Controller")

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.delete('/:username', UserController.deleteUser);

module.exports = router;