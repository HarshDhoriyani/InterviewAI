const Performance = require("../models/Performance");

const updatePerformance = async (userId, question, totalScore) => {
  let performance = await Performance.findOne({ user: userId });

  if (!performance) {
    performance = await Performance.create({
      user: userId,
    });
  }

  performance.totalInterviews += 1;

  // Update overall average
  performance.averageScore =
    ((performance.averageScore * (performance.totalInterviews - 1)) + totalScore) /
    performance.totalInterviews;

  performance.confidenceScore = 
    performance.averageScore > 80 ? 90 :
    performance.averageScore > 60 ? 70 :
    performance.averageScore > 40 ? 50 :
    30;

  // Update topic stats
  const topicEntry = performance.topicStats.find(
    (t) => t.topic === question.topic
  );

  if (topicEntry) {
    topicEntry.averageScore =
      ((topicEntry.averageScore * topicEntry.attempts) + totalScore) /
      (topicEntry.attempts + 1);
    topicEntry.attempts += 1;
  } else {
    performance.topicStats.push({
      topic: question.topic,
      averageScore: totalScore,
      attempts: 1,
    });
  }

  // Update difficulty stats
  const difficultyEntry = performance.difficultyStats.find(
    (d) => d.difficulty === question.difficulty
  );

  if (difficultyEntry) {
    difficultyEntry.averageScore =
      ((difficultyEntry.averageScore * difficultyEntry.attempts) + totalScore) /
      (difficultyEntry.attempts + 1);
    difficultyEntry.attempts += 1;
  } else {
    performance.difficultyStats.push({
      difficulty: question.difficulty,
      averageScore: totalScore,
      attempts: 1,
    });
  }

  await performance.save();
};

module.exports = { updatePerformance };
