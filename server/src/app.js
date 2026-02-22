const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const evaluationRoutes = require("./routes/evaluation.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const snapshotRoutes = require("./routes/snapshot.routes");
const explanationRoutes = require("./routes/explanation.routes");

const app = express();
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("InterviewAI Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/snapshot", snapshotRoutes);
app.use("/api/explanation", explanationRoutes);


module.exports = app;
