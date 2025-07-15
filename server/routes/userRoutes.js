const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require('../middleware/auth');

router.post("/add-user", userController.addUser)
router.get("/:id", userController.getUserById);
router.put("/:id", authenticate, authorize("admin","user"), userController.updateUserById)
router.get("/:id/user-name", userController.getUsernameOnly);

module.exports = router;
