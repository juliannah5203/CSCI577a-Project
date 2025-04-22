import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Layout from "./Layout";

const Settings = () => {
  const [checkInPref, setCheckInPref] = useState("Daily");
  const [emergencyContact, setEmergencyContact] = useState("Daddy");
  const [linkedAccount] = useState("daddy@gmail.com");
  const [interfaceSetting, setInterfaceSetting] = useState("Default");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            boxShadow: 6,
            p: 2,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f8faf4",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Interface:</Typography>
                {isEditing ? (
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={interfaceSetting}
                      onChange={(e) => setInterfaceSetting(e.target.value)}
                    >
                      <MenuItem value="Default">Default</MenuItem>
                      <MenuItem value="Compact">Compact</MenuItem>
                      <MenuItem value="Spacious">Spacious</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography>{interfaceSetting}</Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f8faf4",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Emergency Contact:
                </Typography>
                {isEditing ? (
                  <TextField
                    value={emergencyContact}
                    size="small"
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                ) : (
                  <Typography>{emergencyContact}</Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f8faf4",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Linked Account:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>{linkedAccount}</Typography>
                  {isEditing && (
                    <IconButton color="primary">
                      <GoogleIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f8faf4",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Frequency:</Typography>
                {isEditing ? (
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={checkInPref}
                      onChange={(e) => setCheckInPref(e.target.value)}
                    >
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography>{checkInPref}</Typography>
                )}
              </Box>
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                gap: 2,
              }}
            >
              {!isEditing ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      // 可在此觸發 API call 儲存資料
                      setIsEditing(false);
                    }}
                  >
                    Save
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Settings;
