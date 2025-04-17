import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { format, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Layout from "./Layout";
import axios from "axios";

const userId = "67ff8a8411c7fe597dcf6a92"; // Replace with dynamic user ID if available

const feedbackSamples = [
  "Your mood has been pretty stable this week, keep it up! 👍",
  "Your mood significantly improved over the weekend, relaxation is key!",
  "Your mood was lower on Wednesday, try to manage stress or take more breaks.",
  "Overall, your mood has been high this week. Keep up the good work!",
];

const calculateStatistics = (data) => {
  const moodValues = data.map((d) => d.mood);
  const averageMood =
    moodValues.reduce((acc, cur) => acc + cur, 0) / moodValues.length;
  const highestMood = Math.max(...moodValues);
  const lowestMood = Math.min(...moodValues);

  return {
    averageMood,
    highestMood,
    lowestMood,
  };
};

const calculateTrendChange = (data) => {
  const moodValues = data.map((d) => d.mood);
  const trendChange = moodValues[moodValues.length - 1] - moodValues[0];
  return trendChange.toFixed(2);
};

const calculateAverageDailyRate = (data) => {
  const dailyRates = [];
  for (let i = 1; i < data.length; i++) {
    const dailyRate = data[i].mood - data[i - 1].mood;
    dailyRates.push(dailyRate);
  }
  const averageRate =
    dailyRates.reduce((acc, cur) => acc + cur, 0) / dailyRates.length;
  return averageRate.toFixed(2);
};

export default function Trends() {
  const [range, setRange] = useState(7);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [feedback] = useState(() => {
    const rand = Math.floor(Math.random() * feedbackSamples.length);
    return feedbackSamples[rand];
  });

  const fetchMoodAggregation = async (rangeValue = 7, date = new Date()) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/users/${userId}/mood-aggregation/?startDate=${format(
          date,
          "yyyy-MM-dd"
        )}&range=${rangeValue}`,
        { withCredentials: true }
      );
      console.log("Mood aggregation data:", res.data);
      const sortedData = res.data.dailyData
        .map((entry) => ({
          ...entry,
          mood: entry.averageScore,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("Sorted data:", sortedData);
      setChartData(sortedData);
    } catch (err) {
      console.error("Failed to fetch mood aggregation data", err);
    }
  };

  useEffect(() => {
    fetchMoodAggregation(range, selectedDate);
  }, [selectedDate, range]);

  const handleRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setRange(newRange);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const { averageMood, highestMood, lowestMood } =
    calculateStatistics(chartData);
  const trendChange = calculateTrendChange(chartData);
  const averageDailyRate = calculateAverageDailyRate(chartData);

  const formatValue = (val) =>
    !isFinite(val) || isNaN(val) ? "-" : Number(val).toFixed(2);

  const displayAverageDailyRate = formatValue(averageDailyRate);
  const displayTrendChange = formatValue(trendChange);
  const displayAverageMood = formatValue(averageMood);

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          fontSize={28}
          align="center"
          mb={2}
        >
          Trend Analysis
        </Typography>

        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date (End Date)"
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="yyyy/MM/dd"
                  fullWidth
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <ToggleButtonGroup
                value={range}
                exclusive
                onChange={handleRangeChange}
                fullWidth
              >
                <ToggleButton value={7}>Week</ToggleButton>
                <ToggleButton value={31}>Month</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <Card
            variant="outlined"
            sx={{
              mb: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LineChart
              xAxis={[
                {
                  scaleType: "point",
                  data: chartData.map((d) => format(parseISO(d.date), "MM/dd")),
                },
              ]}
              series={[
                {
                  data: chartData.map((d) => d.mood),
                  label: "Mood",
                },
              ]}
              width={400}
              height={300}
            />
          </Card>

          <Stack direction="row" spacing={2} sx={{ mb: 2, width: "100%" }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Daily Rate
              </Typography>
              <Typography variant="h6">{displayAverageDailyRate}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Trend Change
              </Typography>
              <Typography variant="h6">{displayTrendChange}</Typography>
            </Paper>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 2, width: "100%" }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Average Mood
              </Typography>
              <Typography variant="h6">{displayAverageMood}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Highest & Lowest
              </Typography>
              <Typography variant="h6">
                {!isFinite(highestMood) || !isFinite(lowestMood)
                  ? "-"
                  : `${highestMood} / ${lowestMood}`}
              </Typography>
            </Paper>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, width: "100%", maxWidth: 600 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                AI Suggestions
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body1">{feedback}</Typography>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}
