const Answer = require("../models/Answer");
const Suggestion = require("../models/Suggestion");
const mongoose = require("mongoose");
const {
  getWeeklySummary,
  getMonthlySummary,
} = require("../services/aiService");
// Helper function: get date range
// const getDateRange = (days, startDateParam = null, endDateParam = null) => {
//   // Initialize with default values
//   const endDate = endDateParam ? new Date(endDateParam) : new Date();
//   let startDate;

//   if (startDateParam) {
//     // If start date is provided, use it
//     startDate = new Date(startDateParam);
//   } else {
//     // If start date is not provided, calculate it based on end date and days
//     startDate = new Date(endDate);
//     startDate.setDate(startDate.getDate() - (days - 1));
//   }

//   // Set time to beginning and end of day
//   startDate.setHours(0, 0, 0, 0);
//   endDate.setHours(23, 59, 59, 999);

//   return { startDate, endDate };
// };
const getDateRange = (days, startDateParam = null, endDateParam = null) => {
  const now = new Date();

  const rawEndDate = endDateParam ? new Date(endDateParam) : now;
  const endDate = new Date(
    Date.UTC(
      rawEndDate.getUTCFullYear(),
      rawEndDate.getUTCMonth(),
      rawEndDate.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  let startDate;
  if (startDateParam) {
    const rawStartDate = new Date(startDateParam);
    startDate = new Date(
      Date.UTC(
        rawStartDate.getUTCFullYear(),
        rawStartDate.getUTCMonth(),
        rawStartDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
  } else {
    // 往前推 days - 1 天
    const temp = new Date(endDate);
    temp.setUTCDate(temp.getUTCDate() - (days - 1));
    startDate = new Date(
      Date.UTC(
        temp.getUTCFullYear(),
        temp.getUTCMonth(),
        temp.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
  }

  return { startDate, endDate };
};

// Get mood trends for a specific time range (7 or 31 days)
exports.getMoodTrends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const range = parseInt(req.query.range) || 7; // Default 7 days, if not specified
    const startDate = req.query.startDate || null; // New parameter

    if (range !== 7 && range !== 31) {
      return res
        .status(400)
        .json({ error: "Time range must be either 7 or 31 days" });
    }

    const dateRange = getDateRange(range, startDate);

    // Get answers within the date range and sort by date
    const answers = await Answer.find({
      user_id: userId,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    }).sort({ date: 1 });

    // Fetch suggestions within the same date range
    const suggestions = await Suggestion.find({
      user_id: userId,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    }).sort({ date: 1 });

    // Process answers to create trend data
    const trendData = processMoodTrendsWithSuggestions(answers, suggestions);

    res.json({
      userId,
      range,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      availableDays: trendData.length,
      data: trendData,
    });
  } catch (err) {
    console.error("Error retrieving mood trends:", err);
    res.status(500).json({ error: err.message });
  }
};

// Process raw answer data and suggestions into mood trend format
function processMoodTrendsWithSuggestions(answers, suggestions) {
  const trendData = [];

  // Group data by date
  const dataByDate = {};

  answers.forEach((answer) => {
    // Format date as YYYY-MM-DD to use as key
    const dateKey = answer.date.toISOString().split("T")[0];

    if (!dataByDate[dateKey]) {
      dataByDate[dateKey] = {
        answers: [],
        suggestions: [],
      };
    }

    dataByDate[dateKey].answers.push(answer);
  });

  // Process suggestions
  suggestions.forEach((suggestion) => {
    // Format date as YYYY-MM-DD to use as key
    const dateKey = suggestion.date.toISOString().split("T")[0];

    if (!dataByDate[dateKey]) {
      dataByDate[dateKey] = {
        answers: [],
        suggestions: [],
      };
    }

    dataByDate[dateKey].suggestions.push(suggestion);
  });

  // Process each day's data
  Object.keys(dataByDate)
    .sort()
    .forEach((dateKey) => {
      const dayData = dataByDate[dateKey];
      const dayAnswers = dayData.answers;
      const daySuggestions = dayData.suggestions;

      // Calculate average mood rating for this day
      const allScores = dayAnswers.map((answer) => answer.moodRating);
      const averageScore =
        allScores.length > 0
          ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
          : null;

      // Extract user notes
      const notes = dayAnswers.map((answer) => answer.note).filter(Boolean);

      // Format suggestions
      const formattedSuggestions = daySuggestions.map((suggestion) => ({
        time: suggestion.date.toISOString(),
        content: suggestion.content,
      }));

      trendData.push({
        date: dateKey,
        averageScore,
        notes,
        // Include individual ratings for the day
        moodEntries: dayAnswers.map((answer) => ({
          time: answer.date.toISOString(),
          moodRating: answer.moodRating,
          note: answer.note || "",
        })),
        // Include suggestions for the day
        suggestions: formattedSuggestions,
      });
    });

  return trendData;
}

// Get mood score aggregation for a specific time period
exports.getMoodAggregation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const range = parseInt(req.query.range) || 7; // Default to 7 days if not specified
    const endDate = req.query.endDate || null; // New parameter

    if (range !== 7 && range !== 31) {
      return res
        .status(400)
        .json({ error: "Range must be either 7 or 31 days" });
    }

    const dateRange = getDateRange(range, null, endDate);

    // Use aggregation pipeline for efficient data processing
    const aggregatedData = await Answer.aggregate([
      // Match answers for the specified user and date range
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        },
      },
      // Group by date and calculate metrics
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          averageScore: { $avg: "$moodRating" },
          count: { $sum: 1 },
          hasNotes: {
            $sum: {
              $cond: [{ $gt: [{ $strLenCP: "$note" }, 0] }, 1, 0],
            },
          },
        },
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
          hasNotes: 1,
        },
      },
    ]);

    // Get suggestions for the same date range
    const suggestions = await Suggestion.find({
      user_id: userId,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    }).sort({ date: 1 });

    // Group suggestions by date
    const suggestionsByDate = {};
    suggestions.forEach((suggestion) => {
      const dateKey = suggestion.date.toISOString().split("T")[0];
      if (!suggestionsByDate[dateKey]) {
        suggestionsByDate[dateKey] = [];
      }
      suggestionsByDate[dateKey].push({
        id: suggestion._id,
        content: suggestion.content,
        time: suggestion.date.toISOString(),
      });
    });

    // Merge suggestions into the aggregated data
    const enrichedData = aggregatedData.map((day) => {
      return {
        ...day,
        suggestions: suggestionsByDate[day.date] || [],
      };
    });

    // Calculate overall statistics
    const allScores = enrichedData
      .filter((day) => day.averageScore !== null)
      .map((day) => day.averageScore);

    const stats = {
      daysWithData: enrichedData.length,
      daysWithNotes: enrichedData.reduce(
        (sum, day) => sum + (day.hasNotes > 0 ? 1 : 0),
        0
      ),
      daysWithSuggestions: Object.keys(suggestionsByDate).length,
      //totalSuggestions: suggestions.length,
      overallAverage:
        allScores.length > 0
          ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
          : null,
      trend: calculateTrend(allScores),
    };

    // Get mood trend data for AI summary
    const trendData = await getMoodTrendsData(
      userId,
      dateRange.startDate,
      dateRange.endDate
    );
    // Generate AI summary based on the range
    let aiSummary = null;
    if (trendData.length > 0) {
      if (range === 7) {
        aiSummary = await getWeeklySummary(trendData);
      } else if (range === 31) {
        aiSummary = await getMonthlySummary(trendData);
      }
    }

    res.json({
      userId,
      range,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      stats,
      aiSummary,
      dailyData: enrichedData,
    });
  } catch (err) {
    console.error("Error retrieving mood aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

// Helper function to get mood trend data in the format required for AI service
async function getMoodTrendsData(userId, startDate, endDate) {
  try {
    // Get answers within the date range and sort by date
    const answers = await Answer.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Fetch suggestions within the same date range
    const suggestions = await Suggestion.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Process answers to create trend data
    return processMoodTrendsWithSuggestions(answers, suggestions);
  } catch (error) {
    console.error("Error getting mood trend data for AI summary:", error);
    return [];
  }
}

// Calculate trend direction (improving, declining, stable)
function calculateTrend(scores) {
  if (scores.length < 2) return "insufficient data";

  // Simple linear regression to determine trend
  const n = scores.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const sumX = indices.reduce((sum, x) => sum + x, 0);
  const sumY = scores.reduce((sum, y) => sum + y, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * scores[i], 0);
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  if (Math.abs(slope) < 0.05) return "stable";
  return slope > 0 ? "improving" : "declining";
}
