const express = require("express");
const router = express.Router();
const protect = require("../utils/authMiddleware");
const { submitCode } = require("../controllers/evaluation.controller");

router.post("/submit", protect, submitCode);

module.exports = router;
