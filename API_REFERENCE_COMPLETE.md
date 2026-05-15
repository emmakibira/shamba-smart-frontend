# Smart Farming App - Complete API Reference

## Base URL

```
http://localhost:8000/api
```

For production, replace with your deployed backend URL.

## Authentication

All protected endpoints require Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained after registration or login.

---

## 🔐 Authentication Endpoints

### Register User

```
POST /auth/register/
```

**Request Body:**

```json
{
  "email": "farmer@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Farmer",
  "phone_number": "+1234567890",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "location_address": "Delhi, India",
  "farm_size": 5.5,
  "primary_crops": ["wheat", "rice", "corn"],
  "soil_type": "loam"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "farmer@example.com",
    "first_name": "John",
    "last_name": "Farmer",
    "profile": {
      "id": 1,
      "phone_number": "+1234567890",
      "latitude": "28.7041",
      "longitude": "77.1025",
      "location_address": "Delhi, India",
      "farm_size": 5.5,
      "primary_crops": ["wheat", "rice", "corn"],
      "soil_type": "loam",
      "is_premium": false,
      "posts_created_this_month": 0
    }
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login with Firebase Token

```
POST /auth/login/
```

**Request Body:**

```json
{
  "firebase_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleV9pZCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Current User Profile

```
GET /auth/profile/
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "farmer@example.com",
  "first_name": "John",
  "last_name": "Farmer",
  "profile": { ... }
}
```

---

## 👤 User Endpoints

### Get Profile Details

```
GET /users/profile/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "farmer@example.com",
  "first_name": "John",
  "last_name": "Farmer",
  "profile": {
    "id": 1,
    "phone_number": "+1234567890",
    "latitude": "28.7041",
    "longitude": "77.1025",
    "location_address": "Delhi, India",
    "farm_size": 5.5,
    "primary_crops": ["wheat", "rice"],
    "soil_type": "loam",
    "years_of_experience": 5,
    "bio": "Passionate organic farmer",
    "is_premium": true,
    "premium_expiry": "2025-05-15T10:00:00Z",
    "posts_created_this_month": 3,
    "created_at": "2024-05-15T10:00:00Z"
  }
}
```

### Update Profile

```
PUT /users/profile/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "profile": {
    "phone_number": "+9876543210",
    "farm_size": 7.5,
    "primary_crops": ["wheat", "rice", "corn"],
    "soil_type": "clay",
    "bio": "Updated bio"
  }
}
```

### Get Farm History

```
GET /users/farm-data/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "crop_name": "wheat",
    "planting_date": "2024-01-15",
    "expected_harvest_date": "2024-05-15",
    "actual_harvest_date": "2024-05-10",
    "area_planted": 5.5,
    "yield_obtained": 8500.5,
    "notes": "Good yield this season",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### Create Farm Data Record

```
POST /users/farm-data/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "crop_name": "rice",
  "planting_date": "2024-06-01",
  "expected_harvest_date": "2024-09-01",
  "area_planted": 3.5,
  "notes": "New crop cycle"
}
```

---

## 👥 Community Endpoints

### List All Posts

```
GET /community/posts/?page=1
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "count": 150,
  "next": "http://api/community/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user_profile": {
        "id": 1,
        "user_email": "farmer@example.com",
        "user_name": "John Farmer",
        "profile_picture": "http://...",
        "location_address": "Delhi"
      },
      "title": "Great harvest this season!",
      "content": "Had an excellent wheat harvest...",
      "image": "http://...",
      "likes_count": 42,
      "comments_count": 5,
      "user_has_liked": false,
      "comments": [
        {
          "id": 1,
          "user_profile": { ... },
          "content": "Congratulations!",
          "created_at": "2024-05-14T10:00:00Z"
        }
      ],
      "created_at": "2024-05-15T10:00:00Z"
    }
  ]
}
```

### Create Post

```
POST /community/posts/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
title: "Great harvest this season!"
content: "Had an excellent wheat harvest..."
image: <binary image data>
```

**Response (201 Created):**

```json
{
  "id": 1,
  "title": "Great harvest this season!",
  "content": "Had an excellent wheat harvest...",
  "image": "http://...",
  "likes_count": 0,
  "comments_count": 0,
  "created_at": "2024-05-15T10:00:00Z"
}
```

### Toggle Like on Post

```
POST /community/posts/{post_id}/like/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "liked": true,
  "likes_count": 43
}
```

### Get Post Comments

```
GET /community/posts/{post_id}/comments/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user_profile": { ... },
    "content": "Great job!",
    "created_at": "2024-05-14T10:00:00Z"
  }
]
```

### Add Comment

```
POST /community/posts/{post_id}/comments/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Great job!"
}
```

---

## 💳 Payment Endpoints

### Create Payment Intent

```
POST /payments/create-payment-intent/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "plan": "monthly"
}
```

**Response (201 Created):**

```json
{
  "client_secret": "pi_1234567890...",
  "payment_intent_id": "pi_1234567890",
  "amount": 9.99,
  "payment_id": 1
}
```

### Get Subscription Status

```
GET /payments/subscription-status/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "is_premium": true,
  "is_premium_active": true,
  "premium_plan": "monthly",
  "premium_expiry": "2024-06-15T10:00:00Z",
  "posts_created_this_month": 3,
  "can_create_post": true
}
```

### Cancel Subscription

```
POST /payments/cancel-subscription/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "message": "Subscription cancelled successfully"
}
```

---

## 🤖 AI Service Endpoints

### Chat with Farming Assistant

```
POST /ai/chat/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "message": "What should I do about yellowing leaves on my wheat?"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "user_message": "What should I do about yellowing leaves on my wheat?",
  "assistant_message": "Yellowing leaves on wheat can be due to nitrogen deficiency. Based on your loam soil and current weather in Delhi, I recommend...",
  "created_at": "2024-05-15T10:00:00Z"
}
```

### Get Chat History

```
GET /ai/chat-history/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user_message": "...",
    "assistant_message": "...",
    "created_at": "2024-05-15T10:00:00Z"
  }
]
```

### Detect Crop Disease

```
POST /ai/detect-disease/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
image: <binary image data>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "image": "http://...",
  "disease_name": "Powdery Mildew",
  "confidence": 0.92,
  "treatment_suggestions": "Detected: Powdery Mildew (92% confidence). Use sulfur spray or neem oil...",
  "created_at": "2024-05-15T10:00:00Z"
}
```

### Predict Crop Yield

```
POST /ai/predict-yield/
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "crop_type": "wheat",
  "temperature": 25,
  "rainfall": 600,
  "soil_nitrogen": 180
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "crop_name": "wheat",
  "expected_yield_per_hectare": 5350.0,
  "confidence": 0.6,
  "factors_considered": {
    "temperature": 25,
    "rainfall": 600,
    "soil_nitrogen": 180
  },
  "created_at": "2024-05-15T10:00:00Z"
}
```

---

## 🌾 Farm Data Endpoints

### Get Commodity Prices

```
GET /farm/commodity-prices/?commodity_name=wheat
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "commodity_name": "wheat",
    "market_name": "Delhi Mandi",
    "price_per_unit": 2500,
    "unit": "kg",
    "date_recorded": "2024-05-15",
    "source": "Official Mandi Data"
  }
]
```

### Get Weather Advisory

```
GET /farm/weather-advisory/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "current_weather": "clear",
  "temperature": 32,
  "humidity": 45,
  "advisory": "Good for field activities. Monitor soil moisture as evaporation will be high."
}
```

### Get Nearby Markets

```
GET /farm/nearby-markets/?radius=50
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "count": 3,
  "markets": [
    {
      "id": 1,
      "name": "Delhi Mandi",
      "latitude": "28.7041",
      "longitude": "77.1025",
      "address": "Mandi Road, Delhi",
      "city": "Delhi",
      "state": "Delhi",
      "commodities": ["wheat", "rice"],
      "phone": "+91...",
      "opening_time": "06:00:00",
      "closing_time": "20:00:00",
      "distance_km": 2.5
    }
  ]
}
```

### Get Crop Recommendations

```
GET /farm/crop-recommendations/
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "soil_type": "loam",
  "temperature": 25,
  "humidity": 60,
  "recommended_crops": ["wheat", "rice", "vegetables"],
  "reason": "Based on loam soil and current weather conditions"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid input data",
  "details": {
    "farm_size": ["Ensure this value is greater than or equal to 0.1."]
  }
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "error": "You have reached the maximum number of posts for this month."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **General Endpoints**: 1000 requests/hour
- **AI Endpoints**: Subject to free tier limits
  - Gemini: 60 requests/minute
  - Hugging Face: 30,000 requests/month

---

## Pagination

List endpoints support pagination:

```
GET /community/posts/?page=2&page_size=20
```

Response includes:

```json
{
  "count": 150,
  "next": "...",
  "previous": "...",
  "results": [...]
}
```

---

## Filtering

Some endpoints support filtering:

```
GET /farm/commodity-prices/?commodity_name=wheat&market_name=Delhi
```

---

## Ordering

List endpoints can be ordered:

```
GET /community/posts/?ordering=-created_at
```

---

## Webhook Events (Stripe)

The app receives these webhook events at `/payments/webhook/`:

### payment_intent.succeeded

Emitted when payment is successful. User premium status is updated.

### customer.subscription.created

Emitted when subscription is created. Premium benefits activated.

### customer.subscription.updated

Emitted when subscription is modified.

### customer.subscription.deleted

Emitted when subscription is cancelled. Premium benefits revoked.

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "farm_size": 5,
    "primary_crops": ["wheat"],
    "soil_type": "loam"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "firebase_token": "your_firebase_token"
  }'
```

### Get Posts

```bash
curl -X GET http://localhost:8000/api/community/posts/ \
  -H "Authorization: Bearer your_access_token"
```

---

## Best Practices

1. **Token Management**
   - Store tokens securely in AsyncStorage
   - Refresh tokens before expiry
   - Clear tokens on logout

2. **Error Handling**
   - Always check for errors in responses
   - Implement retry logic for failed requests
   - Show user-friendly error messages

3. **Performance**
   - Cache data when appropriate
   - Implement pagination for large datasets
   - Compress images before upload

4. **Security**
   - Never expose API keys in frontend
   - Use HTTPS in production
   - Validate all inputs
   - Implement rate limiting on frontend

---

For more information, refer to the complete setup guides:

- [Backend Setup](./BACKEND_COMPLETE_SETUP.md)
- [Frontend Setup](./FRONTEND_COMPLETE_SETUP.md)
