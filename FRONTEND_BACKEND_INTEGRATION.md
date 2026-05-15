# Frontend Integration with Backend

## Changes Made

### 1. **API Service** (`services/api.ts`)

- Created centralized API service using axios
- Handles all backend communication
- Manages authentication tokens
- Request/response interceptors for auth

### 2. **LoginScreen** (`app/LoginScreen.tsx`)

- Updated to use backend API for authentication
- Changed from email to username for login
- Calls `apiService.login()` instead of simulated auth
- Error handling for backend responses

### 3. **DashboardScreen** (`app/(tabs)/DashboardScreen.tsx`)

- Fetches real data from backend
- Weather data from API
- Crop recommendations from database
- Falls back to default data if API fails
- useEffect to fetch dashboard overview on mount

### 4. **AuthContext** (`app/contexts/AuthContext.tsx`)

- Unchanged - works as is
- Stores auth state in AsyncStorage
- Manages onboarding and login states

### 5. **Dependencies Added**

- `axios` - HTTP client for API requests

## Backend Features Implemented

### Authentication System

- User registration endpoint
- User login endpoint
- Token-based authentication
- User profile management

### Dashboard

- Weather data endpoint
- Crop health tracking
- AI recommendations
- Alerts system

### Crops Management

- Create/read/update/delete crops
- Crop recommendations
- Health percentage tracking

### User Profiles

- Extended user profiles
- Profile picture support
- Farm size tracking
- Experience level

## Environment Configuration

### Frontend

Update `services/api.ts` with backend URL:

```typescript
const API_BASE_URL = "http://192.168.100.81:8000/api";
```

### Backend

Create `.env` file:

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.100.81
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://localhost:8082,exp://192.168.100.81:8082
```

## Testing Flow

1. **Start Backend**

   ```bash
   cd shamba-smart-backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Create Test User**
   - Visit: `http://localhost:8000/admin`
   - Login with superuser
   - Create new user

3. **Start Frontend**

   ```bash
   cd shamba-smart-frontend
   npm start
   ```

4. **Test Login**
   - Complete onboarding
   - Login with test credentials
   - Verify dashboard loads data

## AsyncStorage Keys

- `@onboarding_completed` - Onboarding state
- `@user_logged_in` - Login state
- `@user_token` - Backend token
- `@user_data` - Cached user data

## Next Steps

1. Add JWT token authentication
2. Implement real weather API (OpenWeatherMap)
3. Add image upload for crops
4. Implement push notifications
5. Add offline support with local caching
6. Implement crop disease detection
7. Add real-time market prices
8. Implement social features (community)
