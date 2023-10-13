const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/authCtrl");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/logout", verifyToken, authCtrl.logout);

module.exports = router;
