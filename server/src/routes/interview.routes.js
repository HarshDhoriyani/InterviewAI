const express = require("express");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const { startInterview } = require("../controllers/interview.controller");

router.post("/start", protect, startInterview);

module.exports = router;
