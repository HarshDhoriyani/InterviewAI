const router = require("express").Router();
const protect = require("../utils/authMiddleware");
const { saveSnapshot } = require("../controllers/snapshot.controller");


router.post("/", protect, saveSnapshot);
module.exports = router;