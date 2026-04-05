const router = require("express").Router();
const protect = require("../utils/authMiddleware");
const { submitExplanation } = require("../controllers/explanation.controller");


router.post("/submit", protect, submitExplanation);



module.exports = router;