const Performance = require("../models/Performance");
const Session = require("../models/Session");
const Question = require("../models/Question");

const difficultyOrder = ["easy", "medium", "hard"];

const adjustDifficulty = (lastScore, currentDifficulty) => {
    const index = difficultyOrder.indexOf(currentDifficulty);

    if (lastScore > 90 && index < 2) {
        return difficultyOrder[index + 1];
    }

    if (lastScore < 60 && index > 0) {
        return difficultyOrder[index - 1];
    }

    return currentDifficulty;
};

const detectWeakTopic = (performance) => {
    if (!performance) return null;

    const weakTopic = performance.topicStats
    .filter(t => t.attempts >= 2)
    .sort((a, b) => a.averageScore - b.averageScore)[0];


    if (weakTopic && weakTopic.averageScore < 50) {
        return weakTopic.topic;
    }

    return null;
};

const getAdaptiveQuestion = async (userId, requestedDifficulty) => {

    const performance = await Performance.findOne({ user: userId });
    const lastSession = await Session.findOne({ user: userId })
        .sort({ createdAt: -1 });

    let difficulty = requestedDifficulty;

    // adjusting based on the last session
    if (lastSession) {
        difficulty = adjustDifficulty(lastSession.score, lastSession.difficulty);
    }


    // detect weak topic
    const weakTopic = detectWeakTopic(performance);

    let query = { difficulty };

    if (weakTopic) {
        query.topic = weakTopic;
    }

    // randomize questions
    const questions = await Question.find(query);

    if (!questions.length) return null;

    const randomIndex = Math.floor(Math.random() * questions.length);

    return questions[randomIndex];
};


module.exports = { getAdaptiveQuestion };