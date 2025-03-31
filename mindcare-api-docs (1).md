# MindCare API Documentation

## Overview
```
SERVICE_NAME: MindCare
PURPOSE: Mental health tracking application
FEATURES:
- Daily mood check-ins
- AI-generated insights
- Personalized reminders
- Data visualization
```

## API Modules
```
1. User Account Management & Google Authentication
2. Daily Mood Check-In & Data Collection
3. AI Insights Using OpenAI API
4. Alerts & Calendar Synchronization (Google Calendar Integration)
5. Data Aggregation for Front-End Visualization
```

## 1. User Account Management & Google Authentication

### 1.1. GET /api/auth/google
```
DESCRIPTION: Initiates Google OAuth 2.0 flow
METHOD: GET
PARAMETERS:
  - redirect_uri: URL for return after authentication [OPTIONAL]
  - state: CSRF protection token [INTERNAL]
AUTHENTICATION: None
SUCCESS_RESPONSE:
  - Redirects to Google's OAuth sign-in page
ERROR_RESPONSE:
  - 400: Bad Request (invalid parameters)
```

### 1.2. GET /api/auth/google/callback
```
DESCRIPTION: Handles OAuth callback from Google
METHOD: GET
PARAMETERS:
  - code: Authorization code from Google [REQUIRED]
  - state: CSRF validation token [REQUIRED]
AUTHENTICATION: None
SUCCESS_RESPONSE:
  - 200: Redirects to application dashboard
ERROR_RESPONSE:
  - 400: Bad Request
  - 401: Unauthorized
```

### 1.3. GET /api/users/profile
```
DESCRIPTION: Retrieves user profile information
METHOD: GET
PARAMETERS: None
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON user profile data
    {
      "userId": "abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "profilePicture": "https://example.com/path/to/image.jpg",
      "additionalInfo": {
        "preferences": { "reminders": true },
        "createdAt": "2025-01-10T12:00:00Z"
      }
    }
ERROR_RESPONSE:
  - 401: Unauthorized (invalid/expired session)
```

### 1.4. PUT /api/users/profile
```
DESCRIPTION: Updates user profile information
METHOD: PUT
PARAMETERS:
  - Request body: JSON payload with fields to update
    {
      "name": "Johnathan Doe",
      "preferences": {
        "reminders": false,
        "theme": "dark"
      }
    }
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: Updated profile JSON
ERROR_RESPONSE:
  - 400: Bad Request (validation failure)
  - 401: Unauthorized
```

### 1.5. POST /api/users/logout
```
DESCRIPTION: Terminates user session
METHOD: POST
PARAMETERS: None
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: Logout confirmation
ERROR_RESPONSE:
  - 401: Unauthorized
```

## 2. Daily Mood Check-In & Data Collection

### 2.1. POST /api/checkins
```
DESCRIPTION: Submit new mood check-in
METHOD: POST
PARAMETERS:
  - Request body: Check-in data
    {
      "date": "2025-02-19",
      "moodRating": 7,
      "note": "Felt refreshed after my morning walk."
    }
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 201: Created check-in record ID and timestamp
ERROR_RESPONSE:
  - 400: Bad Request (invalid payload)
  - 401: Unauthorized
```

### 2.2. GET /api/checkins
```
DESCRIPTION: Retrieve user's check-in records
METHOD: GET
PARAMETERS:
  - startDate: Filter start date (YYYY-MM-DD) [OPTIONAL]
  - endDate: Filter end date (YYYY-MM-DD) [OPTIONAL]
  - period: Aggregation level ("daily", "weekly", "monthly") [OPTIONAL]
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON array of check-in records
    {
      "checkins": [
        {
          "id": "chk123",
          "date": "2025-02-19",
          "moodRating": 7,
          "note": "Felt refreshed after my morning walk."
        },
        {
          "id": "chk124",
          "date": "2025-02-20",
          "moodRating": 6,
          "note": "A stressful day at work."
        }
      ]
    }
ERROR_RESPONSE:
  - 401: Unauthorized
```

### 2.3. GET /api/checkins/{checkinId}
```
DESCRIPTION: Fetch specific check-in record
METHOD: GET
PARAMETERS:
  - checkinId: Unique identifier [PATH]
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON check-in record
ERROR_RESPONSE:
  - 401: Unauthorized
  - 404: Not Found
```

### 2.4. PUT /api/checkins/{checkinId}
```
DESCRIPTION: Update existing check-in record
METHOD: PUT
PARAMETERS:
  - checkinId: Unique identifier [PATH]
  - Request body: Fields to update
    {
      "moodRating": 8,
      "note": "Updated: Feeling even better after a relaxing evening."
    }
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: Updated check-in record
ERROR_RESPONSE:
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
```

## 3. AI Insights Using OpenAI API

### 3.1. GET /api/insights
```
DESCRIPTION: Generate AI-driven insights from user data
METHOD: GET
PARAMETERS: None
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON insights object
    {
      "insights": {
        "summary": "Over the past month, your mood has been steadily improving with occasional dips around stressful workdays.",
        "recommendations": [
          "Consider incorporating mindfulness exercises on stressful days.",
          "Your sleep pattern is consistent, which is helping your mood stabilization."
        ],
        "trend": {
          "overallMood": 7.1,
          "variance": 0.9
        }
      },
      "generatedAt": "2025-02-20T08:00:00Z"
    }
ERROR_RESPONSE:
  - 401: Unauthorized
  - 500: Internal Server Error (API failure)
```

### 3.2. POST /api/insights/generate
```
DESCRIPTION: Manually trigger fresh data analysis
METHOD: POST
PARAMETERS: None (optionally can accept analysis parameters)
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 202: Accepted (analysis queued)
ERROR_RESPONSE:
  - 401: Unauthorized
  - 500: Internal Server Error
```

## 4. Alerts & Calendar Synchronization

### 4.1. GET /api/alerts
```
DESCRIPTION: Retrieve user alert notifications
METHOD: GET
PARAMETERS: None
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON array of alerts
    {
      "alerts": [
        {
          "id": "alert123",
          "type": "missed_checkin",
          "message": "You missed your check-in on 2025-02-18.",
          "createdAt": "2025-02-19T09:00:00Z",
          "read": false
        }
      ]
    }
ERROR_RESPONSE:
  - 401: Unauthorized
```

### 4.2. POST /api/alerts
```
DESCRIPTION: Create alert notification (internal use)
METHOD: POST
PARAMETERS:
  - Request body: Alert data
    {
      "userId": "abc123",
      "alertType": "missed_checkin",
      "message": "You have missed 3 consecutive check-ins."
    }
AUTHENTICATION: Internal service authentication
SUCCESS_RESPONSE:
  - 201: Created alert record
ERROR_RESPONSE:
  - 400: Bad Request
  - 401: Unauthorized
```

### 4.3. PUT /api/alerts/{alertId}/read
```
DESCRIPTION: Mark alert as read
METHOD: PUT
PARAMETERS:
  - alertId: Unique identifier [PATH]
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: Confirmation
ERROR_RESPONSE:
  - 401: Unauthorized
  - 404: Not Found
```

### 4.4. POST /api/google/calendar/events
```
DESCRIPTION: Create check-in reminder in Google Calendar
METHOD: POST
PARAMETERS:
  - Request body: Event details
    {
      "summary": "MindCare Daily Check-In",
      "description": "Reminder to complete your daily mood check-in.",
      "start": { "dateTime": "2025-02-21T09:00:00", "timeZone": "UTC" },
      "end": { "dateTime": "2025-02-21T09:15:00", "timeZone": "UTC" }
    }
AUTHENTICATION:
  - Valid session cookie
  - Google Calendar permission
SUCCESS_RESPONSE:
  - 201: Created event details
ERROR_RESPONSE:
  - 401: Unauthorized
  - 403: Forbidden (missing permissions)
```

### 4.5. GET /api/google/calendar/events
```
DESCRIPTION: Retrieve upcoming calendar events
METHOD: GET
PARAMETERS: None
AUTHENTICATION:
  - Valid session cookie
  - Calendar access permission
SUCCESS_RESPONSE:
  - 200: JSON array of calendar events
    {
      "events": [
        {
          "id": "event123",
          "summary": "MindCare Daily Check-In",
          "start": { "dateTime": "2025-02-21T09:00:00", "timeZone": "UTC" },
          "end": { "dateTime": "2025-02-21T09:15:00", "timeZone": "UTC" }
        }
      ]
    }
ERROR_RESPONSE:
  - 401: Unauthorized
  - 403: Forbidden
```

## 5. Data Aggregation for Front-End Visualization

### 5.1. GET /api/charts/mood-trends
```
DESCRIPTION: Get aggregated mood data for visualization
METHOD: GET
PARAMETERS:
  - period: Aggregation level ("daily", "weekly", "monthly") [OPTIONAL]
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON mood trend data
    {
      "daily": [
        { "date": "2025-02-18", "avgMood": 6.8 },
        { "date": "2025-02-19", "avgMood": 7.2 }
      ],
      "weekly": [
        { "week": "2025-W07", "avgMood": 7.0 }
      ],
      "monthly": [
        { "month": "2025-02", "avgMood": 7.1 }
      ]
    }
ERROR_RESPONSE:
  - 401: Unauthorized
```

### 5.2. GET /api/charts/emotion-distribution
```
DESCRIPTION: Get mood rating distribution for visualization
METHOD: GET
PARAMETERS: None
AUTHENTICATION: Valid session cookie
SUCCESS_RESPONSE:
  - 200: JSON mood distribution data
    {
      "1-3": 5,    // Count of low mood ratings (1-3)
      "4-6": 15,   // Count of medium mood ratings (4-6)
      "7-10": 25   // Count of high mood ratings (7-10)
    }
ERROR_RESPONSE:
  - 401: Unauthorized
```

## API Schema Summary

### Authentication Schema
```
SESSION_COOKIE:
  NAME: mindcare_session
  TYPE: HTTP-only secure cookie
  EXPIRATION: 14 days

OAUTH_FLOW:
  PROVIDER: Google
  SCOPES:
    - profile
    - email
    - https://www.googleapis.com/auth/calendar
  SESSION_MANAGEMENT: Server-side
```

### Data Schema
```
USER:
  userId: String (unique) (same as user_id)
  email: String
  name: String (same as username)
  diseases: String (enum: ['general', 'depression', 'anxiety'])
  gender: String
  time_zone: String

CHECK_IN:
  id: String (unique)
  userId: String (reference)
  date: Date
  moodRating: Number (1-5)
  note: String
  createdAt: DateTime
  questionnaire_id: String (reference)


ALERT:
  id: String (unique)
  userId: String (reference)
  type: String (enum)
  message: String
  createdAt: DateTime
  read: Boolean
```

### Error Codes
```
400: Bad Request - Invalid parameters or payload
401: Unauthorized - Missing or invalid authentication
403: Forbidden - Insufficient permissions
404: Not Found - Resource does not exist
500: Internal Server Error - API processing failure
```

### Security Notes
```
AUTHENTICATION:
  - Session cookies are HTTP-only and secure
  - OAuth state parameter used for CSRF protection
  - Tokens stored securely server-side
  
DATA_PROTECTION:
  - All API requests require authentication
  - Users can only access their own data
  - Health data is encrypted at rest
```
