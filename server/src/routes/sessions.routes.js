const express = require("express");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const { getSessions } = require("../controllers/sessions.controller");
const { getUserProfile } = require("../controllers/sessions.controller");

router.get("/", protect, getSessions);
router.get("/profile", protect, getUserProfile);


module.exports = router;