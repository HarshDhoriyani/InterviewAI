const CodeSnapshot = require("../models/CodeSnapshot");
const { emitSnapshot } = require("../core/websocket");

exports.saveSnapshot = async (req, res) => {
    const { sessionId, code } = req.body;

    const snapshot = await CodeSnapshot.create({
        session: sessionId,
        code,
        timestamp: new Date(),
    });

    emitSnapshot(sessionId, snapshot);

    res.json({ success: true });
};