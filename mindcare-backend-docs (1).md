# MindCare Backend Architecture Documentation

## 1. Overview

MindCare is a mental health tracking application that helps users track their mental well-being through daily check-ins, receive AI-generated insights based on their input, and stay on track with personalized reminders.

## 2. System Architecture

### 2.1 Architecture Type

**Modular Monolith**: The system is built as a cohesive application organized into clear domain modules.

### 2.2 Key Components

The backend is divided into the following core modules:

1. **AuthController/Service**: Manages user authentication via Google OAuth
2. **CheckinController/Service**: Handles daily mood check-ins and history
3. **AlertController/Service**: Manages notification system for missed check-ins
4. **MoodTrendController/Service**: Processes mood data for visualization
5. **AIInsightController/Service**: Generates personalized insights using OpenAI API

### 2.3 External Integrations

1. **Google OAuth**: External authentication provider and calendar integration
2. **OpenAI API**: Service for analyzing user mood data

## 3. Database Schema

### 3.1 User

```
- userId: String (unique) (same as user_id)
- email: String
- name: String (same as username)
- diseases: String (enum: ['general', 'depression', 'anxiety'])
- gender: String
- time_zone: String
```

### 3.2 CheckIn

```
- checkinID: int
- moodRating: number  // Numeric rating representing mood
- note: string        // Text description of current mental state
- timestamp: Date     // When the check-in was recorded
- userId: String      // Reference to User
- questionnaire_id: String (reference to Questionnaire)
```

### 3.3 Alert

```
- id: String (unique)
- userId: String (reference to User)
- type: String (e.g., "missed_checkin")
- message: String
- createdAt: DateTime
- read: Boolean
```

## 4. Authentication & Security

### 4.1 AuthController

```
ENDPOINTS:
- GET /auth/google: Initiates Google OAuth flow
- GET /auth/google/callback: Handles OAuth callback
- GET /api/users/profile: Retrieves user profile
- PUT /api/users/profile: Updates user profile
- POST /api/users/logout: Terminates session
```

### 4.2 AuthService

```
METHODS:
- verifyGoogleToken(token): Validates Google authentication tokens
- loginWithGoogle(): Performs Google OAuth authentication
- logout(): Terminates user session
```

### 4.3 Authentication Flow

```
OAUTH_FLOW:
1. Client requests /auth/google
2. Server constructs Google OAuth URL with required scopes and state parameter
3. User authenticates with Google
4. Google redirects to /auth/google/callback with authorization code
5. Server exchanges code for tokens using Google's token endpoint
6. Server retrieves user information using the access token
7. User record is created/updated in database
8. Server establishes session and sends session ID via secure cookie
```

### 4.4 Session Management

```
SESSION_IMPLEMENTATION:
- HTTP-only secure cookies
- Server-side session storage
- 14-day default expiration
```

## 5. Detailed Component Specifications

### 5.1 Check-in Module

#### 5.1.1 CheckinController

```
ENDPOINTS:
- POST /api/checkins: Submit new check-in data
  Request Payload Example:
  {
    "date": "2025-02-19",
    "moodRating": 7,
    "note": "Felt refreshed after my morning walk."
  }
- GET /api/checkins: Retrieve all user check-ins with optional filters
  Query Parameters:
  - startDate (optional, format: YYYY-MM-DD)
  - endDate (optional, format: YYYY-MM-DD)
  - period (optional: "daily", "weekly", "monthly")
- GET /api/checkins/{checkinId}: Get specific check-in
- PUT /api/checkins/{checkinId}: Update existing check-in
  Request Payload Example:
  {
    "moodRating": 8,
    "note": "Updated: Feeling even better after a relaxing evening."
  }
```

#### 5.1.2 CheckinService

```
METHODS:
- saveCheckin(data): Stores new check-in record
- getCheckinHistory(userId): Retrieves user's check-in history
- generateCheckinSummary(): Creates summary from check-in data
```

### 5.2 Alert Module

#### 5.2.1 AlertController

```
ENDPOINTS:
- GET /api/alerts: Retrieve user alerts
- POST /api/alerts: Create new alert (internal use)
- PUT /api/alerts/{alertId}/read: Mark alert as read
```

#### 5.2.2 Alert Service

```
METHODS:
- getMissedCheckinStatus(user): Checks if user missed check-ins
- sendMissedCheckinAlert(user): Creates alert for missed check-ins
```

### 5.3 Mood Trend Module

#### 5.3.1 MoodTrendController

```
ENDPOINTS:
- GET /api/charts/mood-trends: Get mood rating data for visualization
  Response Example:
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
- GET /api/charts/mood-distribution: Get mood rating distribution
  Response Example:
  {
    "ranges": {
      "1-3": 5,   // Count of check-ins with mood rating 1-3
      "4-6": 15,  // Count of check-ins with mood rating 4-6
      "7-10": 35  // Count of check-ins with mood rating 7-10
    }
  }
```

#### 5.3.2 MoodTrendService

```
METHODS:
- getMoodTrends(userId): Retrieves mood rating trend data
- generateMoodTrendGraph(user): Creates graph data based on mood ratings
```

### 5.4 AI Insight Module

#### 5.4.1 AIInsightController

```
ENDPOINTS:
- GET /api/insights: Get AI-generated insights based on mood ratings and notes
  Response Example:
  {
    "insights": {
      "summary": "Over the past month, your mood has been steadily improving with occasional dips around stressful workdays.",
      "recommendations": [
        "Consider incorporating mindfulness exercises on stressful days.",
        "Your mood patterns show improvement when you mention outdoor activities in your notes."
      ],
      "trend": {
        "overallMood": 7.1,
        "variance": 0.9
      }
    },
    "generatedAt": "2025-02-20T08:00:00Z"
  }
- POST /api/insights/generate: Manually trigger insights generation
```

#### 5.4.2 AIInsightService

```
METHODS:
- generateInsights(userData): Creates personalized insights via OpenAI API by analyzing mood ratings and note text
- storeInsights(userId, data): Saves generated insights
```

### 5.5 NotificationService

```
METHODS:
- sendNotification(message, user): Delivers notification to user
```

## 6. Data Flow

### 6.1 Check-in Flow

```
PROCESS:
1. User submits check-in data (moodRating and note only) via frontend
2. CheckinController receives request and validates data
   - Ensures moodRating is a number between 1-10
   - Validates note is a string
3. CheckinService stores data in database with timestamp and user reference
4. Response returns success status with created check-in ID to user
```

### 6.2 Alert Generation Flow

```
PROCESS:
1. System background job checks for missed check-ins
2. Alert service identifies users who missed check-ins
3. Alert record is created
4. NotificationService sends alert to user
```

### 6.3 AI Insight Generation Flow

```
PROCESS:
1. AIInsightController receives request for insights
2. AIInsightService fetches user check-in history
3. AIInsightService makes request to OpenAI API
4. Insights are processed and stored
5. Results are returned to user
```

## 7. API Error Handling

```
ERROR_CODES:
- 400: Bad Request - Invalid parameters or payload
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource does not exist
- 500: Internal Server Error - API processing failure
```

## 8. External Service Integration

### 8.1 Google OAuth

```
INTEGRATION_POINTS:
- Authentication flow initialization
- Token exchange and validation
- User profile information retrieval
- Calendar event creation and retrieval
```

### 8.2 OpenAI API

```
INTEGRATION_POINTS:
- Analysis of user check-in data (mood ratings and notes only)
- Text analysis of note content for sentiment and themes
- Pattern recognition across mood rating history
- Generation of personalized insights and recommendations

REQUEST_FORMAT:
{
  "userData": [
    {
      "date": "2025-02-19",
      "moodRating": 7,
      "note": "Felt refreshed after my morning walk."
    },
    {
      "date": "2025-02-20",
      "moodRating": 6,
      "note": "A stressful day at work."
    }
    // Additional historical check-in records
  ]
}
```

## 9. System Requirements

### 9.1 Performance Requirements

```
- API response time for standard endpoints
- Support for concurrent users
```

### 9.2 Security Requirements

```
- HTTPS for all communications
- OAuth 2.0 for authentication
- Session cookies are HTTP-only and secure
- OAuth state parameter used for CSRF protection
```
