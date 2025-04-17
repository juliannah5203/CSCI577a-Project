import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  TextField,
  Badge,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, isSameDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import PropTypes from "prop-types";
import axios from "axios";
import Layout from "./Layout";

const moodMap = {
  1: { emoji: "😔", label: "Sad" },
  2: { emoji: "😕", label: "Worried" },
  3: { emoji: "😐", label: "Neutral" },
  4: { emoji: "🙂", label: "Good" },
  5: { emoji: "😄", label: "Great" },
};

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth && highlightedDays.some((d) => isSameDay(d, day));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? moodMap[(props.day.getDate() % 5) + 1]?.emoji : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

ServerDay.propTypes = {
  highlightedDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  day: PropTypes.instanceOf(Date).isRequired,
  outsideCurrentMonth: PropTypes.bool,
};

export default function History() {
  const [moodData, setMoodData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const prevDateRef = React.useRef(null);

  const userId = "67ff8a8411c7fe597dcf6a92"; // Replace with actual user ID

  const fetchMoodData = async (startDate) => {
    try {
      const firstDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
      const formattedDate = format(firstDay, "yyyy-MM-dd");
      const res = await axios.get(
        `http://localhost:5001/api/users/${userId}/mood-trends/?startDate=${formattedDate}&range=31`,
        {
          withCredentials: true,
        }
      );
      const flattened =
        res.data.data?.map((entry) => ({
          date: entry.moodEntries[0].time,
          mood: entry.averageScore,
          note: entry.notes?.[0] || "-",
          suggestions: entry.suggestions?.[0]?.content
            ? entry.suggestions[0].content.trim()
            : "",
        })) || [];
      console.log("Fetched mood data:", flattened);
      setMoodData(flattened);
    } catch (err) {
      console.error("Failed to fetch mood trends", err);
    }
  };

  const entry = moodData.find((e) => isSameDay(new Date(e.date), selectedDate));

  const highlightedDays = moodData.map((e) => new Date(e.date));

  useEffect(() => {
    if (selectedDate) {
      const currentMonth = selectedDate.getMonth();
      const currentYear = selectedDate.getFullYear();
      const prevMonth = prevDateRef.current?.getMonth();
      const prevYear = prevDateRef.current?.getFullYear();

      if (currentMonth !== prevMonth || currentYear !== prevYear) {
        fetchMoodData(selectedDate);
        prevDateRef.current = selectedDate;
      }
    }
  }, [selectedDate]);

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          fontSize={28}
          align="center"
          mb={2}
        >
          History
        </Typography>

        {/* Centered and Moderately Sized Card */}
        <Card
          variant="outlined"
          sx={{
            maxWidth: 800,
            width: "100%",
            mx: "auto",
            borderRadius: 4,
            mb: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              onMonthChange={(date) => {
                setSelectedDate(date);
              }}
              slots={{ day: ServerDay }}
              slotProps={{ day: { highlightedDays } }}
              sx={{
                fontSize: "1.2rem", // Reduced font size of the calendar text
                height: "400px", // Reduced calendar height
                "& .MuiPickersDay-root": {
                  fontSize: "1.2rem", // Reduced font size for the days
                },
                "& .MuiTypography-root": {
                  fontSize: "1.2rem", // Reduced font size for date labels
                },
              }}
            />
          </LocalizationProvider>
        </Card>

        {/* Display Record Content in a Card */}
        <Card
          variant="outlined"
          sx={{ maxWidth: 800, width: "100%", mx: "auto", borderRadius: 4 }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" color="text.secondary">
                {format(selectedDate, "yyyy/MM/dd", {
                  locale: enUS,
                })}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {entry ? (
              <>
                <Stack direction="row" spacing={2} mb={2}>
                  <Chip label="Mood" color="success" size="small" />
                  <Typography variant="h6">
                    {moodMap[entry.mood]?.emoji} {moodMap[entry.mood]?.label}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                  <Chip label="Note" color="success" size="small" />
                  <Typography variant="h6">{entry.note}</Typography>
                </Stack>
                {entry.suggestions?.length > 0 && (
                  <TextField
                    label="AI Suggestion"
                    value={entry.suggestions}
                    multiline
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{ mt: 2 }}
                  />
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No records for this day
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
