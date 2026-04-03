const express = require("express");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const { getSessions } = require("../controllers/sessions.controller");

router.get("/", protect, getSessions);


module.exports = router;