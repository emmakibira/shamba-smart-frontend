# Shamba Smart - Full Stack Setup Guide

## Project Structure

```
shamba-smart/
├── shamba-smart-frontend/    (React Native/Expo app)
└── shamba-smart-backend/     (Django REST API)
```

## Backend Setup (Django)

### Prerequisites

- Python 3.9+
- pip
- virtualenv

### Installation Steps

1. **Navigate to backend folder**

   ```bash
   cd shamba-smart-backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env file and set your configuration
   ```

5. **Run migrations**

   ```bash
   python manage.py migrate
   ```

6. **Create superuser (admin account)**

   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

Backend will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

## Frontend Setup (React Native / Expo)

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (optional but recommended)

### Installation Steps

1. **Navigate to frontend folder**

   ```bash
   cd shamba-smart-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update API URL**
   Edit `services/api.ts` and set the correct backend URL:

   ```typescript
   const API_BASE_URL = "http://your-backend-ip:8000/api";
   ```

4. **Start development server**

   ```bash
   npm start
   ```

5. **Run on specific platform**
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

## Database Models

### User Profile

- Extends Django's User model
- Stores farmer-specific information
- Phone, location, farm size, experience

### Crops

- Tracks user's crops
- Health percentage
- Planting and harvest dates
- Crop status tracking

### Weather Data

- Real-time weather information
- Temperature, humidity, wind speed, rainfall

### Crop Recommendations

- AI-generated recommendations
- Profit margins, seasons
- Confidence scores

### Alerts

- Weather alerts
- Disease warnings
- Market information

## API Endpoints

### Authentication

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Dashboard

- `GET /api/dashboard/overview/` - Dashboard data
- `GET /api/dashboard/weather/current/` - Current weather
- `GET /api/dashboard/alerts/unread/` - Unread alerts

### Crops

- `GET /api/crops/crops/` - List crops
- `POST /api/crops/crops/` - Create crop
- `GET /api/crops/recommendations/` - Get recommendations

### Users

- `GET /api/users/profile/` - Get profile
- `PUT /api/users/profile/` - Update profile

## Testing Credentials

After setup, create a test user:

1. Access admin panel: `http://localhost:8000/admin`
2. Login with superuser credentials
3. Create a new user via Users section
4. Login in mobile app with those credentials

## Troubleshooting

### Backend won't start

- Check if port 8000 is available
- Ensure all migrations are applied
- Check .env file is properly configured

### Frontend can't connect to backend

- Verify backend is running
- Check API_BASE_URL in `services/api.ts`
- Ensure CORS settings in Django settings
- Check firewall settings

### Database issues

- Delete `db.sqlite3` and rerun migrations
- Check database permissions

## Git Setup (Two Separate Repos)

Frontend (existing repo):

```bash
cd shamba-smart-frontend
git init
git add .
git commit -m "Initial commit: Frontend"
git remote add origin https://github.com/username/shamba-smart-frontend.git
git push -u origin main
```

Backend (new repo):

```bash
cd shamba-smart-backend
git init
git add .
git commit -m "Initial commit: Backend"
git remote add origin https://github.com/username/shamba-smart-backend.git
git push -u origin main
```

## Next Steps

1. Set up PostgreSQL for production (currently using SQLite)
2. Add JWT token authentication
3. Implement real weather API integration
4. Add AI model for crop recommendations
5. Set up celery for background tasks
6. Deploy to production servers

## Support

For issues, create an issue in the respective GitHub repository.
