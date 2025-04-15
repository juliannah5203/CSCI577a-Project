const Answer = require('../models/Answer');
const mongoose = require('mongoose');

// Helper function: get date range
const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};

// Get mood trends for a specific time range (7 or 30 days)
exports.getMoodTrends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const range = parseInt(req.query.range) || 7; // Default 7 days, if not specified
    
    if (range !== 7 && range !== 30) {
      return res.status(400).json({ error: 'Time range must be either 7 or 30 days' });
    }

    const { startDate, endDate } = getDateRange(range);

    // Get answers within the date range and sort by date
    const answers = await Answer.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: 1 });
    
    // Process answers to create trend data
    const trendData = processMoodTrends(answers);
    
    res.json({
      userId,
      range,
      startDate,
      endDate,
      availableDays: trendData.length,
      data: trendData
    });
  } catch (err) {
    console.error('Error retrieving mood trends:', err);
    res.status(500).json({ error: err.message });
  }
};

// Process raw answer data into mood trend format
function processMoodTrends(answers) {
  const trendData = [];

  // Group answers by date
  const answersByDate = {};
  
  answers.forEach(answer => {
    // Format date as YYYY-MM-DD to use as key
    const dateKey = answer.date.toISOString().split('T')[0];
    
    if (!answersByDate[dateKey]) {
      answersByDate[dateKey] = [];
    }
    
    answersByDate[dateKey].push(answer);
  });

  // Process each day's answers
  Object.keys(answersByDate).sort().forEach(dateKey => {
    const dayAnswers = answersByDate[dateKey];
    
    // Calculate aggregated scores for this day
    // Assuming answers.answers array contains numeric ratings from 1-5
    const allScores = dayAnswers.flatMap(answer => answer.answers.map(Number));
    const averageScore = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      : null;
    
    // Get the questionnaire type (assuming only one per day)
    const questionnaireType = dayAnswers[0]?.questionnaire_id?.diseases || 'general';
    
    // Extract user notes
    const notes = dayAnswers.map(answer => answer.notes).filter(Boolean);
    
    trendData.push({
      date: dateKey,
      averageScore,
      questionnaireType,
      notes,
      // Include individual question scores for detailed analysis
      questionScores: dayAnswers.map(answer => {
        const questions = answer.questionnaire_id?.questions || [];
        return questions.map((question, index) => ({
          question,
          score: Number(answer.answers[index] || 0)
        }));
      }).flat()
    });
  });

  return trendData;
}

// Get mood score aggregation for a specific time period
exports.getMoodAggregation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const range = parseInt(req.query.range) || 7; // Default to 7 days if not specified
    
    if (range !== 7 && range !== 30) {
      return res.status(400).json({ error: 'Range must be either 7 or 30 days' });
    }

    const { startDate, endDate } = getDateRange(range);

    // Use aggregation pipeline for efficient data processing
    const aggregatedData = await Answer.aggregate([
      // Match answers for the specified user and date range
      {
        $match: {
          user_id: mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      // Group by date and calculate metrics
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          averageScore: { $avg: { $avg: "$answers" } },
          count: { $sum: 1 },
          hasNotes: {
            $sum: {
              $cond: [{ $gt: [{ $strLenCP: "$notes" }, 0] }, 1, 0]
            }
          }
        }
      },
      // Sort by date
      { $sort: { _id: 1 } },
      // Project final shape of data
      {
        $project: {
          _id: 0,
          date: "$_id",
          averageScore: 1,
          count: 1,
          hasNotes: 1
        }
      }
    ]);

    // Calculate overall statistics
    const allScores = aggregatedData.filter(day => day.averageScore !== null).map(day => day.averageScore);
    
    const stats = {
      daysWithData: aggregatedData.length,
      daysWithNotes: aggregatedData.reduce((sum, day) => sum + (day.hasNotes > 0 ? 1 : 0), 0),
      overallAverage: allScores.length > 0 
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
        : null,
      trend: calculateTrend(allScores)
    };

    res.json({
      userId,
      range,
      startDate,
      endDate,
      stats,
      dailyData: aggregatedData
    });
  } catch (err) {
    console.error('Error retrieving mood aggregation:', err);
    res.status(500).json({ error: err.message });
  }
};

// Calculate trend direction (improving, declining, stable)
function calculateTrend(scores) {
  if (scores.length < 2) return 'insufficient data';
  
  // Simple linear regression to determine trend
  const n = scores.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((sum, x) => sum + x, 0);
  const sumY = scores.reduce((sum, y) => sum + y, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * scores[i], 0);
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (Math.abs(slope) < 0.05) return 'stable';
  return slope > 0 ? 'improving' : 'declining';
}
