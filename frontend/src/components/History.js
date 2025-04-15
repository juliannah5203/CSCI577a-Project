import React, { useState } from "react";
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

const mockData = [
  {
    date: "2025-04-07",
    mood: 4,
    emotion: "Stable",
    note: "A new week, full of energy",
  },
  { date: "2025-04-06", mood: 5, emotion: "Happy", note: "Had sushi" },
];

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth && highlightedDays.some((d) => isSameDay(d, day));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🟢" : undefined}
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const entry = mockData.find((e) => isSameDay(new Date(e.date), selectedDate));

  const highlightedDays = mockData.map((e) => new Date(e.date));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" align="center" mb={2}>
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
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
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
                <Typography variant="h6">{entry.mood}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} mb={2}>
                <Chip label="Emotion" color="success" size="small" />
                <Typography variant="h6">{entry.emotion}</Typography>
              </Stack>
              <TextField
                label="Note"
                value={entry.note}
                multiline
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="AI Suggestion"
                value={`Consider maintaining this energy by planning something enjoyable mid-week.`}
                multiline
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ mt: 2 }}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No records for this day
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
