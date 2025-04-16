import React, { useState } from "react";
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

const fullMoodData = [
  {
    date: "2025-03-09",
    mood: 3,
    emotion: "Calm",
    note: "The whole day was calm, no big mood swings.",
  },
  {
    date: "2025-03-10",
    mood: 2,
    emotion: "Tired",
    note: "So much work, not feeling very energetic.",
  },
  {
    date: "2025-03-11",
    mood: 4,
    emotion: "Invigorated",
    note: "Felt great after the workout.",
  },
  {
    date: "2025-03-12",
    mood: 2,
    emotion: "Anxious",
    note: "A bit stressed out about the presentation.",
  },
  {
    date: "2025-03-13",
    mood: 3,
    emotion: "Stable",
    note: "Nothing special happened today.",
  },
  {
    date: "2025-03-14",
    mood: 4,
    emotion: "Happy",
    note: "Had a great time eating with friends.",
  },
  {
    date: "2025-03-15",
    mood: 5,
    emotion: "Happy",
    note: "Went hiking on the weekend, beautiful weather.",
  },
  {
    date: "2025-03-16",
    mood: 5,
    emotion: "Relaxed",
    note: "Watched Netflix all day, felt relaxed.",
  },
  {
    date: "2025-03-17",
    mood: 3,
    emotion: "Indifferent",
    note: "Back to school, feeling neutral.",
  },
  {
    date: "2025-03-18",
    mood: 2,
    emotion: "Nervous",
    note: "Presentation deadline approaching.",
  },
  {
    date: "2025-03-19",
    mood: 1,
    emotion: "Frustrated",
    note: "The report was rejected, feeling discouraged.",
  },
  {
    date: "2025-03-20",
    mood: 2,
    emotion: "Sad",
    note: "Didn't sleep well, feeling down.",
  },
  {
    date: "2025-03-21",
    mood: 3,
    emotion: "Stable",
    note: "Maintained emotional stability.",
  },
  {
    date: "2025-03-22",
    mood: 5,
    emotion: "Satisfied",
    note: "Had fun at an interesting event.",
  },
  {
    date: "2025-03-23",
    mood: 4,
    emotion: "Joyful",
    note: "Cooked with friends, very relaxing.",
  },
  {
    date: "2025-03-24",
    mood: 3,
    emotion: "Normal",
    note: "Routine, everything is steady.",
  },
  {
    date: "2025-03-25",
    mood: 3,
    emotion: "Focused",
    note: "Concentrated on completing my assignments.",
  },
  {
    date: "2025-03-26",
    mood: 4,
    emotion: "Relaxed",
    note: "Finally submitted the report, feeling relieved.",
  },
  {
    date: "2025-03-27",
    mood: 5,
    emotion: "Excited",
    note: "Got a job interview invitation.",
  },
  {
    date: "2025-03-28",
    mood: 5,
    emotion: "Confident",
    note: "The presentation went well.",
  },
  {
    date: "2025-03-29",
    mood: 4,
    emotion: "Satisfied",
    note: "Preparing for a weekend trip.",
  },
  {
    date: "2025-03-30",
    mood: 3,
    emotion: "Calm",
    note: "Relaxing at home, organizing my space.",
  },
  {
    date: "2025-03-31",
    mood: 2,
    emotion: "Tired",
    note: "Feeling drained after going out.",
  },
  {
    date: "2025-04-01",
    mood: 3,
    emotion: "Relaxed",
    note: "Slowed down, a very peaceful day.",
  },
  { date: "2025-04-02", mood: 3, emotion: "Stable", note: "Regular workday." },
  {
    date: "2025-04-03",
    mood: 4,
    emotion: "Optimistic",
    note: "Looking forward to the future.",
  },
  {
    date: "2025-04-04",
    mood: 4,
    emotion: "Happy",
    note: "Went hiking with friends.",
  },
  {
    date: "2025-04-05",
    mood: 5,
    emotion: "Happy",
    note: "Had a therapeutic weekend trip.",
  },
  {
    date: "2025-04-06",
    mood: 4,
    emotion: "Relaxed",
    note: "Read a great book.",
  },
  {
    date: "2025-04-07",
    mood: 4,
    emotion: "Stable",
    note: "Starting the new week with energy.",
  },
];

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

const getChartData = (range, today = new Date()) => {
  let days = 7;
  if (range === "month") days = 30;

  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - days + 1);

  return fullMoodData
    .filter(
      (entry) =>
        new Date(entry.date) >= fromDate && new Date(entry.date) <= today
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default function Trends() {
  const [range, setRange] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(getChartData(range, selectedDate));
  const [feedback] = useState(() => {
    const rand = Math.floor(Math.random() * feedbackSamples.length);
    return feedbackSamples[rand];
  });

  const handleRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setRange(newRange);
      setChartData(getChartData(newRange, selectedDate));
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setChartData(getChartData(range, newDate));
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
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
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
              tooltip={{
                formatter: ({ dataIndex }) => {
                  const entry = chartData[dataIndex];
                  return `${entry.emotion}: ${entry.note}`;
                },
              }}
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
                {highestMood} / {lowestMood}
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
