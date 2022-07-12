const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

router.get("/login", authController.login);
router.post("/login", authController.auth);
router.get("/register", authController.register);
router.post("/register", authController.create);

module.exports = router;
